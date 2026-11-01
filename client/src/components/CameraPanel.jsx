import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  DollarSign,
  FileText,
  Info,
  StopCircle,
  Sparkles,
  X,
  Search,
  Key,
  HelpCircle,
  Trash2,
  ExternalLink,
  Bell,
  ListTodo
} from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../data/sampleImages';

export default function CameraPanel({ onSendToSolve, langMode, onLogActivity, serverStatus, onSwitchTab }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [setupGuide, setSetupGuide] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);
  const [currentMode, setCurrentMode] = useState(null); // 'demo' | 'live-api' | 'unconfigured'

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const isGeminiLive = Boolean(serverStatus?.details?.geminiConfigured);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setErrorNotice(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ಬೆಂಬಲವಿಲ್ಲ (Camera API not supported on this browser).');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ ಅಥವಾ ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setPreviewUrl(dataUrl);
    setSelectedImage({ isCaptured: true, dataUrl });
    setImageMeta({
      name: 'ಕ್ಯಾಮೆರಾ ಫೋಟೋ (Camera Snapshot)',
      size: `${Math.round((dataUrl.length * 3) / 4 / 1024)} KB`,
      source: 'ಲೈವ್ ಕ್ಯಾಮೆರಾ'
    });
    setAnalysisResult(null);
    setSetupGuide(null);
    setErrorNotice(null);
    setCurrentMode(null);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorNotice('ಮಾನ್ಯವಲ್ಲದ ಫೈಲ್ ಮಾದರಿ. ಬೆಂಬಲಿತ ಮಾದರಿಗಳು: JPG, PNG, WebP ಮಾತ್ರ.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorNotice('ಚಿತ್ರದ ಗಾತ್ರವು 10MB ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ದಯವಿಟ್ಟು ಚಿಕ್ಕ ಗಾತ್ರದ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }

    setErrorNotice(null);
    setAnalysisResult(null);
    setSetupGuide(null);
    setCurrentMode(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setPreviewUrl(dataUrl);
      setSelectedImage(file);
      setImageMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        source: 'ಗ್ಯಾಲರಿ ಅಪ್‌ಲೋಡ್'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectScenario = (scenario) => {
    stopCamera();
    setPreviewUrl(scenario.imageUrl);
    setSelectedImage({ isPreset: true, title: scenario.titleKn });
    setImageMeta({
      name: `${scenario.titleKn} (${scenario.category})`,
      size: 'ಮಾದರಿ ಚಿತ್ರ',
      source: 'ಡೆಮೋ ಸನ್ನಿವೇಶ'
    });
    setErrorNotice(null);
    setSetupGuide(null);
    setAnalysisResult(null);
    setCurrentMode('demo');
  };

  // User explicitly clicks "ವಿಶ್ಲೇಷಿಸಿ" (Analyze)
  const handleSubmitAnalysis = async () => {
    if (!previewUrl) {
      setErrorNotice('ದಯವಿಟ್ಟು ಮೊದಲು ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕ್ಯಾಮೆರಾ ಮೂಲಕ ಸೆರೆಹಿಡಿಯಿರಿ.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSetupGuide(null);
    setErrorNotice(null);

    // If it's a pre-set demo scenario, load its rich mock analysis
    if (selectedImage?.isPreset) {
      setTimeout(() => {
        const found = SAMPLE_SCENARIOS.find((s) => s.titleKn === selectedImage.title);
        const res = found ? found.mockAnalysis : SAMPLE_SCENARIOS[0].mockAnalysis;
        setAnalysisResult(res);
        setCurrentMode('demo');
        setIsAnalyzing(false);
        onLogActivity?.({
          type: 'camera',
          title: `ಡೆಮೋ ವಿಶ್ಲೇಷಣೆ: ${selectedImage.title}`,
          timestamp: new Date().toLocaleTimeString('kn-IN')
        });
      }, 700);
      return;
    }

    // Live API submission to Express backend: POST /api/analyze-image
    try {
      let resp = null;
      try {
        resp = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: previewUrl })
        });
      } catch (proxyErr) {
        resp = await fetch('http://localhost:5000/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: previewUrl })
        });
      }

      if (!resp) throw new Error('ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಸಂಪರ್ಕ ಸಾಧಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.');

      const data = await resp.json();

      if (resp.ok && data.success && data.data) {
        setAnalysisResult(data.data);
        setCurrentMode('live-api');
        onLogActivity?.({
          type: 'camera',
          title: `AI ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ: ${imageMeta?.name || 'ಚಿತ್ರ'}`,
          timestamp: new Date().toLocaleTimeString('kn-IN')
        });
      } else if (data.configured === false) {
        // Backend multimodal API is not configured with GEMINI_API_KEY
        setSetupGuide(data.setupGuide || {
          titleKn: 'AI ದೃಷ್ಟಿ API ಕಾನ್ಫಿಗರೇಶನ್ ಅಗತ್ಯವಿದೆ',
          messageKn: 'ನೈಜ ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಬ್ಯಾಕೆಂಡ್‌ನಲ್ಲಿ Google Gemini API Key ಅನ್ನು ಸಂರಚಿಸಬೇಕು.',
          stepsKn: [
            '1. https://aistudio.google.com/app/apikey ಗೆ ಭೇಟಿ ನೀಡಿ ಉಚಿತ API Key ಪಡೆಯಿರಿ.',
            '2. server/.env ಫೈಲ್‌ನಲ್ಲಿ GEMINI_API_KEY=your_key_here ಎಂದು ನಮೂದಿಸಿ.',
            '3. ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಮರುಪ್ರಾರಂಭಿಸಿ.'
          ]
        });
        setCurrentMode('unconfigured');
      } else {
        setErrorNotice(data.error || 'ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.');
      }
    } catch (err) {
      console.error('Image analysis error:', err);
      setErrorNotice('ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ತೊಂದರೆ: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetSelection = () => {
    setPreviewUrl(null);
    setSelectedImage(null);
    setImageMeta(null);
    setAnalysisResult(null);
    setSetupGuide(null);
    setErrorNotice(null);
    setCurrentMode(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateActionPlan = () => {
    if (!analysisResult) return;
    const taskQuery = analysisResult.suggestedNextSteps?.[0] || imageMeta?.name || 'ಚಿತ್ರದ ಕಾರ್ಯ';
    onSendToSolve({
      actionType: 'plan',
      title: imageMeta?.name || 'ಚಿತ್ರದಿಂದ ಪಡೆದ ಕಾರ್ಯ',
      query: taskQuery,
      originalText: analysisResult.whatItContainsKn
    });
  };

  const handleMakeChecklist = () => {
    if (!analysisResult) return;
    const tasks = analysisResult.suggestedNextSteps || analysisResult.suggestedTasks || [];
    onSendToSolve({
      actionType: 'checklist',
      title: imageMeta?.name || 'ಚಿತ್ರದಿಂದ ಕಾರ್ಯಸೂಚಿ',
      tasks: tasks
    });
  };

  const handleAddReminder = () => {
    if (!analysisResult) return;
    onSendToSolve({
      actionType: 'reminder',
      title: imageMeta?.name || 'ಚಿತ್ರದ ಮುಖ್ಯ ಕಾರ್ಯ ಗಡುವು',
      date: analysisResult.importantDetails?.dateOrDeadline || ''
    });
  };

  return (
    <div className="panel-container">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-header-left">
          <div className="panel-header-icon">
            <Camera size={22} />
          </div>
          <div>
            <h2 className="panel-header-title kn-heading">
              ನೋಡು — Image Understanding & Camera
            </h2>
            <p className="panel-header-subtitle">
              ದಾಖಲೆಗಳು, ಸುತ್ತೋಲೆ, ಬಿಲ್ ಅಥವಾ ಛಾಯಾಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥೈಸಿಕೊಳ್ಳಿ
            </p>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div>
          {isGeminiLive ? (
            <span className="mode-badge badge-live" title="Google Gemini 1.5 Multimodal API ಸಕ್ರಿಯವಾಗಿದೆ">
              <CheckCircle2 size={13} />
              <span>ಲೈವ್ AI ಸಕ್ರಿಯ (Gemini Vision)</span>
            </span>
          ) : (
            <span className="mode-badge badge-demo" title="ಬ್ಯಾಕೆಂಡ್‌ನಲ್ಲಿ Gemini API Key ಸಂರಚಿಸಲಾಗಿಲ್ಲ (ಡೆಮೋ ಮೋಡ್)">
              <Info size={13} />
              <span>ಡೆಮೋ ಮೋಡ್ (API Setup Required)</span>
            </span>
          )}
        </div>
      </div>

      <div className="panel-body">
        {/* Preset Sample Scenarios */}
        <div className="scenario-selector-wrap">
          <div className="scenario-title">
            <Sparkles size={16} style={{ color: 'var(--color-flag-red)' }} />
            <span>ತಕ್ಷಣ ಪರೀಕ್ಷಿಸಲು ಸಿದ್ಧ ಡೆಮೋ ಮಾದರಿಗಳು (Demonstration Scenarios):</span>
          </div>
          <div className="scenario-pills">
            {SAMPLE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`scenario-pill-btn ${selectedImage?.title === scenario.titleKn ? 'active' : ''}`}
                onClick={() => handleSelectScenario(scenario)}
              >
                <span>{scenario.titleKn}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({scenario.category})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State: Prompt to upload or use camera */}
        {!isCameraActive && !previewUrl && (
          <div
            className="dropzone-container"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-icon">
              <Upload size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                ಚಿತ್ರವನ್ನು ಇಲ್ಲಿ ಎಳೆದು ಹಾಕಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು: JPEG, PNG, WebP (ಗರಿಷ್ಠ 10MB)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
              >
                <Camera size={16} />
                <span>ಲೈವ್ ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ (Open Camera)</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload size={16} />
                <span>ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ (Upload Image)</span>
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
        />

        {/* Live Camera View Finder */}
        {isCameraActive && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#2B080A', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }} className="fade-in">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: '#FFF8E7', fontSize: '0.85rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="status-dot"></span> ಲೈವ್ ಕ್ಯಾಮೆರಾ ಸಕ್ರಿಯವಾಗಿದೆ (Live View)
              </span>
              <button
                type="button"
                onClick={stopCamera}
                style={{ background: 'none', border: 'none', color: '#FFF8E7', cursor: 'pointer' }}
                title="ಕ್ಯಾಮೆರಾ ಮುಚ್ಚಿ"
              >
                <X size={18} />
              </button>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', maxHeight: '380px', borderRadius: 'var(--radius-md)', objectFit: 'contain', background: '#000' }}
            />

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button type="button" className="btn btn-gold" onClick={captureSnapshot}>
                <Camera size={18} />
                <span>ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ (Capture Snapshot)</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                <StopCircle size={18} />
                <span>ರದ್ದುಮಾಡಿ (Cancel)</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {(cameraError || errorNotice) && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: '#FDEDEC', border: '1px solid #F5B7B1', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>{cameraError || errorNotice}</span>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              onClick={() => {
                setCameraError(null);
                setErrorNotice(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Image Preview & Analysis Stage */}
        {previewUrl && (
          <div className="preview-split-grid fade-in">
            {/* Left Column: Image Preview + Submission Controls */}
            <div className="image-preview-card">
              <img src={previewUrl} alt="ಆಯ್ಕೆಮಾಡಿದ ಚಿತ್ರ" />

              <div style={{ padding: '1rem', background: '#FFFFFF', borderTop: '1px solid var(--color-cream-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {imageMeta?.name || 'ಆಯ್ಕೆಮಾಡಿದ ಚಿತ್ರ'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      ಮೂಲ: {imageMeta?.source || 'ಚಿತ್ರ'} • ಗಾತ್ರ: {imageMeta?.size || 'ಮಾನ್ಯ'}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    onClick={resetSelection}
                    title="ಚಿತ್ರ ತೆಗೆದುಹಾಕಿ / ಬದಲಾಯಿಸಿ (Remove / Change Image)"
                  >
                    <Trash2 size={13} />
                    <span>ಬದಲಾಯಿಸಿ</span>
                  </button>
                </div>

                {/* Primary Analyze Action Button */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                    onClick={handleSubmitAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#FFF' }}></div>
                        <span>ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...</span>
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        <span>ವಿಶ್ಲೇಷಿಸಿ (Analyze Image)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Analysis / Results / Setup Guide */}
            <div className="analysis-result-card">
              {/* Ready to Analyze Prompt (before clicking ವಿಶ್ಲೇಷಿಸಿ) */}
              {!isAnalyzing && !analysisResult && !setupGuide && (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-flag-yellow-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)' }}>
                    <Search size={26} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '1.05rem' }}>
                    ಚಿತ್ರ ಪೂರ್ವವೀಕ್ಷಣೆ ಸಿದ್ಧವಾಗಿದೆ
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', maxWidth: '340px', lineHeight: 1.5 }}>
                    ಚಿತ್ರದಲ್ಲಿನ ಪಠ್ಯ, ದಿನಾಂಕಗಳು, ಶುಲ್ಕ ಮತ್ತು ಸೂಚನೆಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಪಡೆಯಲು ಎಡಭಾಗದಲ್ಲಿರುವ <strong>"ವಿಶ್ಲೇಷಿಸಿ (Analyze)"</strong> ಬಟನ್ ಒತ್ತಿ.
                  </p>
                  <button
                    type="button"
                    className="btn btn-gold"
                    onClick={handleSubmitAnalysis}
                  >
                    <Search size={16} />
                    <span>ಈಗಲೇ ವಿಶ್ಲೇಷಿಸಿ (Analyze Now)</span>
                  </button>
                </div>
              )}

              {/* Loading Indicator */}
              {isAnalyzing && (
                <div style={{ padding: '3.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '1.05rem' }}>
                    ಚಿತ್ರವನ್ನು ಕನ್ನಡದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    ಚಿತ್ರದ ವಿವರಣೆ, ಗುರುತಿಸಲಾದ ಪಠ್ಯ, ದಿನಾಂಕಗಳು ಮತ್ತು ಪ್ರಮುಖ ಕ್ರಮಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ
                  </div>
                </div>
              )}

              {/* Unconfigured Backend API Notice */}
              {!isAnalyzing && setupGuide && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="fade-in">
                  <div className="mode-badge badge-demo">
                    <Info size={13} />
                    <span>{setupGuide.titleKn}</span>
                  </div>

                  <div style={{ background: 'var(--color-cream-subtle)', border: '1px solid var(--color-cream-border)', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '8px' }}>
                      <Key size={16} style={{ color: 'var(--color-flag-red)' }} />
                      <span>{setupGuide.messageKn}</span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                      ಹೊಸ ಚಿತ್ರಗಳ ನೈಜ AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಕೆಳಗಿನ ಸುಲಭ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ:
                    </div>

                    <ol style={{ fontSize: '0.82rem', lineHeight: 1.7, paddingLeft: '1.25rem', color: 'var(--color-text-main)', margin: 0 }}>
                      {setupGuide.stepsKn?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    API ಕೀ ಇಲ್ಲದೆಯೇ KannadaSaathi ಯ ಪೂರ್ಣ ವಿಶ್ಲೇಷಣಾ ವಿಭಾಗಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಮೇಲಿನ <strong>ಡೆಮೋ ಮಾದರಿಗಳನ್ನು</strong> ಆಯ್ಕೆಮಾಡಿ "ವಿಶ್ಲೇಷಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.
                  </div>
                </div>
              )}

              {/* Analysis Result Available with 5 Separated Sections */}
              {!isAnalyzing && analysisResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="fade-in">
                  {/* Status & Confidence Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className={currentMode === 'live-api' ? 'mode-badge badge-live' : 'mode-badge badge-demo'}>
                      <CheckCircle2 size={13} />
                      <span>
                        {currentMode === 'live-api'
                          ? 'ಲೈವ್ AI ವಿಶ್ಲೇಷಣೆ (Gemini Vision)'
                          : 'ಡೆಮೋ ಪ್ರದರ್ಶನ (Demonstration Mode)'}
                      </span>
                    </div>

                    {analysisResult.confidence && (
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                        ವಿಶ್ವಾಸಾರ್ಹತೆ: {analysisResult.confidence}
                      </span>
                    )}
                  </div>

                  {/* Section 1: What the Image Contains (ಕನ್ನಡ ಸಾರಾಂಶ) */}
                  <div className="highlight-box">
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-flag-red)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      1. ಚಿತ್ರದಲ್ಲಿ ಏನಿದೆ (What the Image Contains):
                    </div>
                    <div style={{ fontSize: '0.96rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                      {analysisResult.whatItContainsKn || analysisResult.summaryKn}
                    </div>
                  </div>

                  {/* Section 2: Important Details Grid (ದಿನಾಂಕ, ಮೊತ್ತ, ಸೂಚನೆಗಳು) */}
                  {(analysisResult.importantDetails?.dateOrDeadline ||
                    analysisResult.details?.dateOrDeadline ||
                    analysisResult.importantDetails?.amountOrFees ||
                    analysisResult.details?.amount) && (
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        2. ಪ್ರಮುಖ ವಿವರಗಳು (Important Details):
                      </div>
                      <div className="key-insights-grid">
                        {(analysisResult.importantDetails?.dateOrDeadline || analysisResult.details?.dateOrDeadline) && (
                          <div className="insight-pill">
                            <span className="insight-label">
                              <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                              ದಿನಾಂಕ / ಅಂತಿಮ ಗಡುವು
                            </span>
                            <span className="insight-value">
                              {analysisResult.importantDetails?.dateOrDeadline || analysisResult.details?.dateOrDeadline}
                            </span>
                          </div>
                        )}

                        {(analysisResult.importantDetails?.amountOrFees || analysisResult.details?.amount) && (
                          <div className="insight-pill">
                            <span className="insight-label">
                              <DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }} />
                              ಶುಲ್ಕ / ಮೊತ್ತ
                            </span>
                            <span className="insight-value">
                              {analysisResult.importantDetails?.amountOrFees || analysisResult.details?.amount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Instructions and Required Actions */}
                  {(analysisResult.importantDetails?.instructionsKn || analysisResult.details?.instructionsKn) && (
                    <div style={{ fontSize: '0.85rem', background: '#FFFDF7', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                      <strong style={{ color: 'var(--color-flag-red)' }}>ಸೂಚನೆಗಳು: </strong>
                      <span style={{ color: 'var(--color-text-main)' }}>
                        {analysisResult.importantDetails?.instructionsKn || analysisResult.details?.instructionsKn}
                      </span>
                    </div>
                  )}

                  {/* Section 3: Extracted Text (ಗುರುತಿಸಲಾದ ಪಠ್ಯ) */}
                  {analysisResult.extractedText && (
                    <details style={{ background: '#FFFDF7', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                        3. ಗುರುತಿಸಲಾದ ಮೂಲ ಪಠ್ಯ (Extracted Text, if readable)
                      </summary>
                      <pre style={{ marginTop: '0.5rem', fontSize: '0.76rem', whiteSpace: 'pre-wrap', color: 'var(--color-text-main)', fontFamily: 'monospace', maxHeight: '180px', overflowY: 'auto' }}>
                        {analysisResult.extractedText}
                      </pre>
                    </details>
                  )}

                  {/* Section 4: Suggested Next Steps (ಮುಂದಿನ ಹಂತಗಳು) */}
                  {((analysisResult.suggestedNextSteps && analysisResult.suggestedNextSteps.length > 0) ||
                    (analysisResult.suggestedTasks && analysisResult.suggestedTasks.length > 0)) && (
                    <div style={{ background: 'var(--color-cream-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                        4. ಶಿಫಾರಸು ಮಾಡಲಾದ ಮುಂದಿನ ಹಂತಗಳು (Suggested Next Steps):
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.83rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                        {(analysisResult.suggestedNextSteps || analysisResult.suggestedTasks).map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Section 5: Uncertainties / Verification Needed (ಅನಿಶ್ಚಿತತೆಗಳು) */}
                  {analysisResult.uncertaintiesKn && (
                    <div style={{ fontSize: '0.82rem', background: '#FFF9E6', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid #FFE082', color: '#7A5800', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <HelpCircle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#B78103' }} />
                      <div>
                        <strong>5. ಪರಿಶೀಲಿಸಬೇಕಾದ ಅನಿಶ್ಚಿತತೆಗಳು (Uncertainties / Verification): </strong>
                        <span>{analysisResult.uncertaintiesKn}</span>
                      </div>
                    </div>
                  )}

                  {/* Connected Workflows to Solve Tab */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-cream-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 0.95rem', fontSize: '0.82rem', justifyContent: 'center' }}
                      onClick={handleCreateActionPlan}
                    >
                      <Sparkles size={16} />
                      <span>ಕ್ರಿಯಾ ಯೋಜನೆ ರಚಿಸಿ</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.65rem 0.95rem', fontSize: '0.82rem', justifyContent: 'center' }}
                      onClick={handleMakeChecklist}
                    >
                      <ListTodo size={16} />
                      <span>ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಮಾಡಿ</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-gold"
                      style={{ padding: '0.65rem 0.95rem', fontSize: '0.82rem', justifyContent: 'center' }}
                      onClick={handleAddReminder}
                    >
                      <Bell size={16} />
                      <span>ನೆನಪೋಲೆ ಸೇರಿಸಿ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
