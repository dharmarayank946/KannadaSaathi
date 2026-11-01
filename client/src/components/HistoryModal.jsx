import React from 'react';
import { X, Clock, Camera, Mic, Compass, CheckSquare, Trash2 } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, history, onClearHistory }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'camera': return <Camera size={16} />;
      case 'voice': return <Mic size={16} />;
      case 'explore': return <Compass size={16} />;
      case 'solve': return <CheckSquare size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 28, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', maxWidth: '520px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }} className="fade-in">
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#FFFDF7', borderBottom: '1px solid var(--color-cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/logo/kannadasaathi-logo.svg" alt="ಕನ್ನಡಸಾಥಿ ಲೋಗೋ" style={{ width: '28px', height: '28px', objectFit: 'contain', aspectRatio: '1 / 1' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              ಚಟುವಟಿಕೆಗಳ ಇತಿಹಾಸ (Activity History)
            </h3>
          </div>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {history.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
              ಯಾವುದೇ ಇತಿಹಾಸ ದಾಖಲಾಗಿಲ್ಲ. ಕ್ಯಾಮೆರಾ, ಧ್ವನಿ ಅಥವಾ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-cream-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon(item.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-light)' }}>
                    {item.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#FCFBF7', borderTop: '1px solid var(--color-cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', color: 'var(--color-danger)' }}
            onClick={onClearHistory}
            disabled={history.length === 0}
          >
            <Trash2 size={14} />
            <span>ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }}
            onClick={onClose}
          >
            ಮುಚ್ಚಿ
          </button>
        </div>
      </div>
    </div>
  );
}
