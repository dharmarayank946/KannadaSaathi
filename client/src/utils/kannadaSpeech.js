/**
 * kannadaSpeech.js
 * Universal, production-grade text-to-speech engine for KannadaSaathi.
 *
 * Multi-Tier Playback Architecture:
 * 1. English: Instantly synthesized via native Web Speech API with module-level utterance retention
 *    to prevent Chromium V8 garbage collection drops, plus queue unfreezing and Chrome keep-alive.
 * 2. Kannada with Native Voice: If the browser has a native Kannada voice (e.g. Android Chrome or
 *    Windows with Kannada Language Pack), spoken natively via Web Speech API.
 * 3. Kannada without Native Voice:
 *    - Tier A: High-fidelity backend TTS endpoint (/api/tts -> http://localhost:5000/api/tts)
 *      with server-side concatenation, in-memory caching, and genuine neural Kannada voice.
 *    - Tier B: Direct HTML5 Audio fallback via Google Translate TTS with Referer stripping
 *      (audio.referrerPolicy = 'no-referrer') and sequential chunking for long paragraphs.
 *    - Tier C: System WebSpeech fallback (utterance.lang = 'kn-IN') to trigger mobile/OS voice engines.
 * 4. Full controls: play (with click-to-toggle off), pause, resume, stop.
 * 5. Never displays fake playing states when audio cannot play.
 */

import { useState, useEffect } from 'react';

// Shared state across all component hooks and listeners
let currentAudioElement = null;
let currentUtterance = null;
let chromeKeepAliveInterval = null;
let activeChunkQueue = [];
let currentActiveId = null;
let currentSpeakingText = null;
let isCurrentlyLoading = false;
let isCurrentlySpeaking = false;
let isCurrentlyPaused = false;
let currentError = null;

const stateListeners = new Set();

// Cache of discovered voices
let detectedVoices = [];
let nativeKnVoice = null;
let nativeEnVoice = null;

function updateVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    detectedVoices = window.speechSynthesis.getVoices() || [];

    // Prioritize authentic Kannada voices
    nativeKnVoice =
      detectedVoices.find(
        (v) =>
          (v.lang && (v.lang.toLowerCase() === 'kn' || v.lang.toLowerCase().startsWith('kn-') || v.lang.toLowerCase().includes('kn_'))) ||
          (v.name && v.name.toLowerCase().includes('kannada'))
      ) || null;

    // Prioritize Indian English for natural Kannada accentuation, then standard English
    nativeEnVoice =
      detectedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-in')) ||
      detectedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-gb')) ||
      detectedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
      detectedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      null;
  } catch (e) {
    console.warn('Voice enumeration warning:', e);
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateVoices();
  window.speechSynthesis.onvoiceschanged = updateVoices;
}

function notifyListeners() {
  const state = {
    activeId: currentActiveId,
    isSpeaking: isCurrentlySpeaking,
    isPaused: isCurrentlyPaused,
    isLoading: isCurrentlyLoading,
    error: currentError,
    speakingText: currentSpeakingText,
    hasNativeKannadaVoice: Boolean(nativeKnVoice)
  };
  stateListeners.forEach((listener) => {
    try {
      listener(state);
    } catch (e) {
      console.warn('Speech listener error:', e);
    }
  });
}

function clearKeepAlive() {
  if (chromeKeepAliveInterval) {
    clearInterval(chromeKeepAliveInterval);
    chromeKeepAliveInterval = null;
  }
}

function startKeepAlive() {
  clearKeepAlive();
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  chromeKeepAliveInterval = setInterval(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);
}

/**
 * Split long texts into manageable chunks for speech synthesizers
 */
function splitIntoAudioChunks(text, maxLen = 140) {
  if (!text || text.length <= maxLen) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    let sliceIdx = remaining.lastIndexOf('.', maxLen);
    if (sliceIdx < 40) sliceIdx = remaining.lastIndexOf('।', maxLen);
    if (sliceIdx < 40) sliceIdx = remaining.lastIndexOf('?', maxLen);
    if (sliceIdx < 40) sliceIdx = remaining.lastIndexOf('!', maxLen);
    if (sliceIdx < 40) sliceIdx = remaining.lastIndexOf(',', maxLen);
    if (sliceIdx < 40) sliceIdx = remaining.lastIndexOf(' ', maxLen);
    if (sliceIdx < 40) sliceIdx = maxLen;

    const chunk = remaining.substring(0, sliceIdx + 1).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.substring(sliceIdx + 1).trim();
  }
  return chunks.filter(Boolean);
}

/**
 * Pause any active speech (HTML5 audio or speechSynthesis)
 */
export function pauseSpeech() {
  if (currentAudioElement && isCurrentlySpeaking && !isCurrentlyPaused) {
    try {
      currentAudioElement.pause();
      isCurrentlyPaused = true;
      notifyListeners();
    } catch (e) {}
    return;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
    try {
      window.speechSynthesis.pause();
      isCurrentlyPaused = true;
      notifyListeners();
    } catch (e) {}
  }
}

/**
 * Resume paused speech (HTML5 audio or speechSynthesis)
 */
export function resumeSpeech() {
  if (currentAudioElement && isCurrentlyPaused) {
    try {
      currentAudioElement.play();
      isCurrentlyPaused = false;
      notifyListeners();
    } catch (e) {}
    return;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.resume();
      isCurrentlyPaused = false;
      notifyListeners();
    } catch (e) {}
  }
}

/**
 * Stop any active speech immediately (both HTML5 audio and speechSynthesis)
 */
export function stopSpeech() {
  clearKeepAlive();
  activeChunkQueue = [];

  // 1. Stop HTML5 audio
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.onplay = null;
      currentAudioElement.onended = null;
      currentAudioElement.onerror = null;
      currentAudioElement.oncanplay = null;
      currentAudioElement.src = '';
    } catch (e) {}
    currentAudioElement = null;
  }

  // 2. Stop Web Speech Synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  currentUtterance = null;

  currentActiveId = null;
  currentSpeakingText = null;
  isCurrentlyLoading = false;
  isCurrentlySpeaking = false;
  isCurrentlyPaused = false;
  currentError = null;
  notifyListeners();
}

/**
 * Play speech for a given text and language with strict toggle and overlap prevention.
 *
 * @param {Object} options
 * @param {string} options.text - Kannada or English text to speak
 * @param {string} [options.lang='kn'] - Language ('kn' or 'en')
 * @param {string|number} [options.id='global'] - Unique identifier for the card/button
 * @param {number} [options.rate=1.0] - Speech rate
 * @param {Function} [options.onStart] - Callback when playback begins
 * @param {Function} [options.onEnd] - Callback when playback finishes
 * @param {Function} [options.onError] - Callback on error
 */
export function playSpeech({
  text,
  lang = 'kn',
  id = 'global',
  rate = 1.0,
  onStart,
  onEnd,
  onError
}) {
  const cleanText = (text || '').trim();
  if (!cleanText) return;

  // Toggle OFF if already playing this item
  if (currentActiveId === id && isCurrentlySpeaking) {
    stopSpeech();
    onEnd?.();
    return;
  }

  // Stop previous speech first (strictly prevents overlapping audio)
  stopSpeech();

  currentActiveId = id;
  currentSpeakingText = cleanText;
  isCurrentlyLoading = true;
  isCurrentlySpeaking = false;
  currentError = null;
  notifyListeners();

  const isKannada = lang === 'kn';

  // Strategy 1: English Speech -> Always use native Web Speech API first
  if (!isKannada && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    updateVoices();
    const enVoice = nativeEnVoice || detectedVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) || null;
    speakViaWebSpeech({
      text: cleanText,
      voice: enVoice,
      langCode: enVoice?.lang || 'en-US',
      rate,
      onStart,
      onEnd,
      onError: (err) => {
        console.warn('English WebSpeech error, falling back to audio stream:', err);
        fallbackToAudioStreaming({ text: cleanText, lang, id, rate, onStart, onEnd, onError });
      }
    });
    return;
  }

  // Strategy 2: Kannada Speech with an authentic native Kannada voice installed in browser
  if (isKannada && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    updateVoices();
    if (nativeKnVoice) {
      speakViaWebSpeech({
        text: cleanText,
        voice: nativeKnVoice,
        langCode: nativeKnVoice.lang || 'kn-IN',
        rate,
        onStart,
        onEnd,
        onError: (err) => {
          console.warn('Native Kannada speech error, falling back to audio stream:', err);
          fallbackToAudioStreaming({ text: cleanText, lang, id, rate, onStart, onEnd, onError });
        }
      });
      return;
    }
  }

  // Strategy 3: Stream high-fidelity authentic Kannada voice via Backend / Direct TTS
  fallbackToAudioStreaming({ text: cleanText, lang, id, rate, onStart, onEnd, onError });
}

/**
 * Web Speech API playback with GC protection and Chromium queue unfreezing
 */
function speakViaWebSpeech({ text, voice, langCode, rate = 1.0, onStart, onEnd, onError }) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('Web Speech API not supported'));
      return;
    }

    // Chrome unfreeze: resume if paused, then cancel old queue
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = langCode || (voice?.lang) || 'en-US';
    utterance.rate = rate || 0.95;

    // Retain at module level to prevent Chromium V8 garbage collection mid-speech
    currentUtterance = utterance;

    utterance.onstart = () => {
      isCurrentlyLoading = false;
      isCurrentlySpeaking = true;
      isCurrentlyPaused = false;
      notifyListeners();
      startKeepAlive();
      onStart?.();
    };

    utterance.onend = () => {
      clearKeepAlive();
      currentUtterance = null;
      stopSpeech();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      clearKeepAlive();
      currentUtterance = null;
      console.warn('WebSpeech utterance error event:', e);
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);

    // Chrome bugfix: immediately trigger resume to kickstart queued speech
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 100);
  } catch (err) {
    console.warn('speakViaWebSpeech exception:', err);
    onError?.(err);
  }
}

/**
 * Fast Audio Streaming Fallback: Backend /api/tts -> Direct Google TTS without Referer -> WebSpeech
 */
function fallbackToAudioStreaming({ text, lang, id, rate, onStart, onEnd, onError }) {
  // Fast check: probe /api/tts with a responsive 1.5s timeout to protect transient user gesture activation
  const tryEndpoint = (url) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.referrerPolicy = 'no-referrer';
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          audio.src = '';
          reject(new Error('Timeout'));
        }
      }, 1500);

      audio.oncanplay = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(audio);
        }
      };

      audio.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          reject(new Error('Audio load failed'));
        }
      };

      audio.src = url;
      audio.load();
    });
  };

  const backendUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;

  tryEndpoint(backendUrl)
    .then((audio) => {
      attachAndPlayAudioElement(audio, id, onStart, onEnd, onError);
    })
    .catch(() => {
      // Backend not running or timed out -> Play directly via Google Translate TTS with no-referrer
      playDirectGoogleTTS({ text, lang, id, onStart, onEnd, onError });
    });
}

/**
 * Direct client-side HTML5 Audio via Google Translate TTS
 * Uses audio.referrerPolicy = 'no-referrer' to prevent Google's 404 blocking
 */
function playDirectGoogleTTS({ text, lang, id, onStart, onEnd, onError }) {
  const chunks = splitIntoAudioChunks(text, 130);
  if (chunks.length === 0) {
    stopSpeech();
    onEnd?.();
    return;
  }

  activeChunkQueue = [...chunks];

  const playNextChunk = () => {
    if (activeChunkQueue.length === 0) {
      stopSpeech();
      onEnd?.();
      return;
    }

    const nextChunk = activeChunkQueue.shift();
    const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(nextChunk)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const audio = new Audio();
    audio.referrerPolicy = 'no-referrer';
    audio.crossOrigin = 'anonymous';
    currentAudioElement = audio;

    audio.onplay = () => {
      isCurrentlyLoading = false;
      isCurrentlySpeaking = true;
      notifyListeners();
      onStart?.();
    };

    audio.onended = () => {
      if (activeChunkQueue.length > 0) {
        playNextChunk();
      } else {
        stopSpeech();
        onEnd?.();
      }
    };

    audio.onerror = (e) => {
      console.warn('Direct Google TTS chunk load failed, trying WebSpeech generic:', e);
      playGenericWebSpeechFallback({ text, lang, id, onStart, onEnd, onError });
    };

    audio.src = directUrl;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Direct audio play error:', err);
        playGenericWebSpeechFallback({ text, lang, id, onStart, onEnd, onError });
      });
    }
  };

  playNextChunk();
}

/**
 * Final WebSpeech fallback passing explicit lang tag ('kn-IN' or 'en-IN')
 */
function playGenericWebSpeechFallback({ text, lang, id, onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    const errorMsg = lang === 'kn' ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಲಭ್ಯವಿಲ್ಲ.' : 'Audio playback is not available.';
    currentError = errorMsg;
    stopSpeech();
    onError?.(errorMsg);
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 0.95;
    currentUtterance = utterance;

    utterance.onstart = () => {
      isCurrentlyLoading = false;
      isCurrentlySpeaking = true;
      notifyListeners();
      startKeepAlive();
      onStart?.();
    };

    utterance.onend = () => {
      clearKeepAlive();
      currentUtterance = null;
      stopSpeech();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      clearKeepAlive();
      currentUtterance = null;
      console.warn('Generic WebSpeech utterance error:', e);
      const errorMsg = lang === 'kn' ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಲಭ್ಯವಿಲ್ಲ.' : 'Audio playback is not available.';
      currentError = errorMsg;
      stopSpeech();
      onError?.(errorMsg);
    };

    window.speechSynthesis.speak(utterance);
    setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 100);
  } catch (err) {
    const errorMsg = lang === 'kn' ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಲಭ್ಯವಿಲ್ಲ.' : 'Audio playback is not available.';
    currentError = errorMsg;
    stopSpeech();
    onError?.(errorMsg);
  }
}

/**
 * Helper to attach state listeners to a ready HTML5 Audio element and trigger play
 */
function attachAndPlayAudioElement(audio, id, onStart, onEnd, onError) {
  currentAudioElement = audio;

  audio.onplay = () => {
    isCurrentlyLoading = false;
    isCurrentlySpeaking = true;
    isCurrentlyPaused = false;
    notifyListeners();
    onStart?.();
  };

  audio.onended = () => {
    stopSpeech();
    onEnd?.();
  };

  audio.onerror = (e) => {
    console.warn('Audio element error:', e);
    stopSpeech();
    onError?.(e);
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Audio play promise rejected:', err);
      stopSpeech();
      onError?.(err);
    });
  }
}

/**
 * React Hook for using the Universal Kannada Speech system in any component
 */
export function useKannadaSpeech() {
  const [speechState, setSpeechState] = useState({
    activeId: currentActiveId,
    isSpeaking: isCurrentlySpeaking,
    isPaused: isCurrentlyPaused,
    isLoading: isCurrentlyLoading,
    error: currentError,
    speakingText: currentSpeakingText,
    hasNativeKannadaVoice: Boolean(nativeKnVoice)
  });

  useEffect(() => {
    stateListeners.add(setSpeechState);
    return () => {
      stateListeners.delete(setSpeechState);
    };
  }, []);

  return {
    activeId: speechState.activeId,
    isSpeaking: speechState.isSpeaking,
    isPaused: speechState.isPaused,
    isLoading: speechState.isLoading,
    error: speechState.error,
    speakingText: speechState.speakingText,
    hasNativeKannadaVoice: speechState.hasNativeKannadaVoice,
    playSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  };
}

export default {
  playSpeech,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
  useKannadaSpeech
};
