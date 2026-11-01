import React from 'react';
import { Camera, Mic, Compass, CheckSquare } from 'lucide-react';

export default function PillarTabs({ activeTab, onSelectTab, langMode }) {
  const pillars = [
    {
      id: 'camera',
      icon: Camera,
      titleKn: 'ನೋಡು',
      titleEn: 'See',
      descKn: 'ಕ್ಯಾಮೆರಾ & ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ',
      descEn: 'Camera & Document Vision'
    },
    {
      id: 'voice',
      icon: Mic,
      titleKn: 'ಮಾತನಾಡು',
      titleEn: 'Speak',
      descKn: 'ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ',
      descEn: 'Kannada Voice Assistant'
    },
    {
      id: 'explore',
      icon: Compass,
      titleKn: 'ತಿಳಿದುಕೋ',
      titleEn: 'Explore',
      descKn: 'ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ & ಸೇವೆಗಳು',
      descEn: 'Citizen Info & Services'
    },
    {
      id: 'solve',
      icon: CheckSquare,
      titleKn: 'ಪರಿಹರಿಸು',
      titleEn: 'Solve',
      descKn: 'ಕ್ರಿಯಾ ಯೋಜನೆ & ನೆನಪೋಲೆ',
      descEn: 'Action Plans & Reminders'
    }
  ];

  return (
    <div className="action-pillars-grid">
      {pillars.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            id={`tab-btn-${item.id}`}
            className={`pillar-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectTab(item.id);
              }
            }}
          >
            <div className="pillar-icon-box">
              <IconComponent size={26} />
            </div>
            <div className="pillar-title-kn">{item.titleKn}</div>
            <div className="pillar-title-en">{item.titleEn}</div>
            <div className="pillar-desc">
              {langMode === 'kn' ? item.descKn : `${item.descKn} (${item.descEn})`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
