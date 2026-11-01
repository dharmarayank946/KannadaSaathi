import React from 'react';
import SectionHeader from '../layout/SectionHeader';
import ExplorePanel from '../ExplorePanel';
import { Compass } from 'lucide-react';

export default function ExploreSection({ onBackToHome, langMode, onSwitchSection }) {
  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ವಿಭಾಗ • ಮಾಹಿತಿ & ಸೇವೆಗಳು"
        badgeEn="Section • Citizen Info & Services"
        titleKn="ಅನ್ವೇಷಿಸಿ — ಕರ್ನಾಟಕ ಮಾಹಿತಿ & ಸೇವೆಗಳು"
        titleEn="Explore — Karnataka Information & Citizen Services"
        taglineKn="ಸೇವಾ ಸಿಂಧು ಯೋಜನೆಗಳು, ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ, ಶಿಕ್ಷಣ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ತುರ್ತು ಸಹಾಯವಾಣಿ ಮಾಹಿತಿ"
        taglineEn="Seva Sindhu citizen schemes, APMC market commodity prices, education circulars, and 24x7 state helplines"
        icon={Compass}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />
      <div className="section-body">
        <ExplorePanel
          langMode={langMode}
          onSwitchTab={onSwitchSection}
        />
      </div>
    </div>
  );
}
