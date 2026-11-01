import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Landmark,
  Palette,
  Sparkles,
  Trees,
  Scissors,
  FileCode,
  Flame,
  BookMarked,
  FileText,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function KarnatakaCulturalShowcase({ onSelectSection, langMode = 'kn' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const isKn = langMode === 'kn';

  // 9 Official Cultural Categories
  const categories = [
    { id: 'historical', titleKn: 'ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ', titleEn: 'Historical Places & Architecture', icon: Landmark },
    { id: 'folk_arts', titleKn: 'ಕಲೆ & ಜನಪದ', titleEn: 'Arts & Folk', icon: Palette },
    { id: 'festivals', titleKn: 'ಹಬ್ಬಗಳು & ಆಚರಣೆಗಳು', titleEn: 'Festivals', icon: Sparkles },
    { id: 'nature', titleKn: 'ಪ್ರಕೃತಿ & ಪ್ರವಾಸೋದ್ಯಮ', titleEn: 'Nature & Tourism', icon: Trees },
    { id: 'handicrafts', titleKn: 'ಕರಕುಶಲ & ಕೈಮಗ್ಗ', titleEn: 'Handicrafts', icon: Scissors },
    { id: 'inscriptions', titleKn: 'ಶಾಸನಗಳು & ಭಾಷೆಯ ಇತಿಹಾಸ', titleEn: 'Inscriptions & History', icon: FileCode },
    { id: 'sharanas', titleKn: 'ಶಿವಶರಣರು & ವಚನಗಳು', titleEn: 'Shivasharanas', icon: Flame },
    { id: 'literature', titleKn: 'ಸಾಹಿತ್ಯ & ಜ್ಞಾನಪೀಠ', titleEn: 'Literature & Jnanpith', icon: BookMarked },
    { id: 'civic', titleKn: 'ಗೀತೆಗಳು & ಸಂವಿಧಾನ', titleEn: 'Songs & Constitution', icon: FileText }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSelectSection('heritage');
  };

  return (
    <section className="karnataka-showcase-section reveal-on-scroll" style={{ maxWidth: '1080px', margin: '0 auto 3rem', padding: '0 1rem' }} aria-label={isKn ? "ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆ" : "Karnataka Pride"}>
      <div style={{ background: '#FFFFFF', border: '1.5px solid #E8E8E8', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
        
        {/* Compact Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <span>✦</span>
              <span>{isKn ? 'ಕರ್ನಾಟಕದ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ' : 'Karnataka Cultural Heritage'}</span>
            </div>
            <h2 className="kn-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111111', margin: 0 }}>
              {isKn ? 'ನಮ್ಮ ಕನ್ನಡ, ನಮ್ಮ ಸಂಸ್ಕೃತಿ' : 'Our Kannada, Our Culture'}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onSelectSection('heritage')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700 }}
          >
            <span>{isKn ? 'ಸಂಪೂರ್ಣ ಪರಂಪರೆ ನೋಡಿ' : 'Explore All Heritage'}</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Compact Cultural Search Field */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F8F8F8', border: '1.5px solid #E0E0E0', borderRadius: '12px', padding: '0.35rem 0.75rem', gap: '0.6rem' }}>
            <Search size={18} color="#666666" />
            <input
              type="text"
              placeholder={isKn ? "ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಹುಡುಕಿ… (ಹಂಪಿ, ಮಸಾಲ ದೋಸೆ, ಯಕ್ಷಗಾನ, ಹಲ್ಮಿಡಿ, ಬಸವಣ್ಣ, ನಾಡಗೀತೆ)" : "Search Karnataka (Hampi, Dosa, Yakshagana, Halmidi, Basavanna, Anthem)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-kannada)' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              <span>{isKn ? 'ಹುಡುಕಿ' : 'Search'}</span>
            </button>
          </div>
        </form>

        {/* 10 Category Quick Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem', marginBottom: '1.5rem' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectSection('heritage', cat.id)}
                style={{
                  background: '#FAFAFA',
                  border: '1px solid #EAEAEA',
                  borderRadius: '12px',
                  padding: '0.65rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: 'var(--color-flag-red)' }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#222222', fontFamily: 'var(--font-kannada)' }}>
                  {isKn ? cat.titleKn : cat.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accessible Civic & National Heritage Banner (State Anthem, National Anthem/Song, Constitution Preamble) */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF5EB 100%)',
          border: '1.5px solid var(--color-flag-yellow)',
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <FileText size={13} />
              <span>{isKn ? 'ನಾಡಗೀತೆ, ರಾಷ್ಟ್ರಗೀತೆ & ಸಂವಿಧಾನ ಪೀಠಿಕೆ' : 'State Anthem, National Anthem & Preamble'}</span>
            </div>
            <h3 className="kn-heading" style={{ fontSize: '1.12rem', color: '#111111', margin: '0 0 0.25rem 0' }}>
              {isKn ? 'ಕರ್ನಾಟಕದ ನಾಡಗೀತೆ ಮತ್ತು ಸಂವಿಧಾನದ ಪೀಠಿಕೆ' : 'Karnataka State Anthem & Constitution Preamble'}
            </h3>
            <p className="kn-text" style={{ fontSize: '0.84rem', color: '#555555', margin: 0, maxWidth: '600px' }}>
              {isKn
                ? 'ಕುವೆಂಪುರವರ “ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ” ನಾಡಗೀತೆ, ಭಾರತದ ರಾಷ್ಟ್ರಗೀತೆ, ರಾಷ್ಟ್ರೀಯ ಗೀತೆ ಮತ್ತು ಸಂವಿಧಾನ ಪೀಠಿಕೆಯ ಅಧಿಕೃತ ವಿವರಗಳನ್ನು ಓದಿ ಮತ್ತು ಆಲಿಸಿ.'
                : 'Read and listen to Rashtrakavi Kuvempu’s State Anthem, India’s National Anthem & Song, and the Constitution Preamble in Kannada.'}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSelectSection('heritage', 'civic')}
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={15} />
            <span>{isKn ? 'ಓದಿ & ಆಲಿಸಿ' : 'Read & Listen'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
