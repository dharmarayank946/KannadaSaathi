import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  X,
  Info,
  Clock,
  Sparkles,
  MessageSquare,
  Building,
  GraduationCap,
  Bus,
  PhoneCall,
  CheckSquare,
  ListTodo,
  Bell
} from 'lucide-react';

export default function ExplorePanel({ onSendToSolve, langMode, onLogActivity, serverStatus, onSwitchTab }) {
  const isKn = langMode === 'kn';

  const [activeCategory, setActiveCategory] = useState(null); // null | 'local' | 'announcements' | 'education' | 'general'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchEmpty, setSearchEmpty] = useState(false);

  // Quick Action Categories Configuration (4 Core Public Services)
  const QUICK_ACTIONS = [
    {
      id: 'announcements',
      titleKn: 'ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆಗಳು',
      titleEn: 'Public Schemes',
      descKn: 'ಗೃಹ ಜ್ಯೋತಿ, ಶಕ್ತಿ ಯೋಜನೆ, ಗೃಹ ಲಕ್ಷ್ಮಿ',
      descEn: 'Gruha Jyothi, Shakti Bus Scheme, Griha Lakshmi',
      icon: Building,
      defaultQuery: 'ಗೃಹ ಜ್ಯೋತಿ 200 ಯೂನಿಟ್ ನಿಯಮ'
    },
    {
      id: 'local',
      titleKn: 'ಸ್ಥಳೀಯ & ಎಪಿಎಂಸಿ',
      titleEn: 'Local & Mandi',
      descKn: 'APMC ಮಾರುಕಟ್ಟೆ ದರ & ಸಾರಿಗೆ ವಿವರ',
      descEn: 'APMC market commodity rates & public transport',
      icon: Bus,
      defaultQuery: 'ಕರ್ನಾಟಕ APMC ಬೆಳೆ ಧಾರಣೆ'
    },
    {
      id: 'education',
      titleKn: 'ಶಿಕ್ಷಣ & ಪರೀಕ್ಷೆ',
      titleEn: 'Education Circulars',
      descKn: 'SSP ಸ್ಕಾಲರ್‌ಶಿಪ್ & KEA CET ಮಾರ್ಗದರ್ಶಿ',
      descEn: 'SSP Scholarship & KEA CET guidelines',
      icon: GraduationCap,
      defaultQuery: 'SSP ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ನಿಯಮಗಳು'
    },
    {
      id: 'general',
      titleKn: 'ತುರ್ತು ಸಹಾಯವಾಣಿ',
      titleEn: 'Helplines & Services',
      descKn: '112, 108, ಜನಸ್ಪಂದನ 1902',
      descEn: 'Emergency 112, 108, Janaspandana 1902',
      icon: PhoneCall,
      defaultQuery: 'ಕರ್ನಾಟಕ ತುರ್ತು ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು'
    }
  ];



  // Search current information via backend endpoint POST /api/current-info
  const handleSearch = async (queryToSearch = null, categoryParam = null) => {
    const q = (queryToSearch !== null ? queryToSearch : searchQuery).trim();
    const cat = categoryParam || activeCategory || 'general';

    if (!q) return;

    setIsSearching(true);
    setSearchResult(null);
    setSearchError(null);
    setSearchEmpty(false);

    try {
      let resp = null;
      try {
        resp = await fetch('/api/current-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, category: cat })
        });
      } catch (e) {
        resp = await fetch('http://localhost:5000/api/current-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, category: cat })
        });
      }

      if (!resp.ok) {
        throw new Error('ಮಾಹಿತಿ ಸರ್ವರ್‌ನಿಂದ ದೋಷ ಪ್ರತಿಕ್ರಿಯೆ ಬಂದಿದೆ.');
      }

      const data = await resp.json();

      if (data.success) {
        setSearchResult(data);
        setSearchEmpty(false);
        onLogActivity?.({
          type: 'explore',
          title: `ನೈಜ ಮಾಹಿತಿ ಶೋಧ: ${q}`,
          timestamp: new Date().toLocaleTimeString('kn-IN')
        });
      } else if (data.unverified) {
        // Honest handling: No verified match found
        setSearchResult(data);
        setSearchEmpty(true);
      } else {
        setSearchError(data.error || 'ಮಾಹಿತಿ ಶೋಧಿಸುವಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('ನೆಟ್‌ವರ್ಕ್ ಅಥವಾ ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickActionClick = (action) => {
    setActiveCategory(action.id);
    setSearchQuery(action.defaultQuery);
    handleSearch(action.defaultQuery, action.id);
  };

  // Connected Workflows to Solve tab
  const handleCreateActionPlan = () => {
    if (!searchResult) return;
    onSendToSolve({
      actionType: 'plan',
      title: `ಮಾಹಿತಿ: ${searchResult.query}`,
      query: searchResult.query,
      originalText: searchResult.explanationKn
    });
  };

  const handleMakeChecklist = () => {
    if (!searchResult) return;
    const tasks = searchResult.actionableTasks || searchResult.retrievedFacts?.slice(0, 3) || [];
    onSendToSolve({
      actionType: 'checklist',
      title: `ಮಾಹಿತಿ ಆಧಾರಿತ ಕಾರ್ಯ: ${searchResult.query}`,
      tasks: tasks
    });
  };

  const handleAddReminder = () => {
    if (!searchResult) return;
    onSendToSolve({
      actionType: 'reminder',
      title: `ಮಾಹಿತಿ ಪರಿಶೀಲನೆ: ${searchResult.query}`
    });
  };

  // Connected Workflow 2: Send query to Voice/Chat assistant for deeper conversation
  const handleSendToChatClick = () => {
    if (onSwitchTab) {
      onSwitchTab('voice');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="panel-container" style={{ padding: '0.5rem 0', border: 'none', background: 'transparent', boxShadow: 'none' }}>
      {/* Verified Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} style={{ color: 'var(--color-flag-red)' }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {isKn ? 'ನೈಜ-ಸಮಯದ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು & ಮಾಹಿತಿ' : 'Real-Time Citizen Services & Information'}
          </span>
        </div>
        <div className="mode-badge badge-live" style={{ margin: 0 }}>
          <ShieldCheck size={13} />
          <span>{isKn ? 'ದೃಢೀಕೃತ ಸಾರ್ವಜನಿಕ ಮೂಲಗಳು (Seva Sindhu & State Portals)' : 'Verified Public Sources (Seva Sindhu & State Portals)'}</span>
        </div>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {/* 4 Quick-Action Citizen Service Cards in a Balanced Grid */}
        <div className="quick-action-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.5rem' }}>
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            const isSelected = activeCategory === action.id;
            return (
              <div
                key={action.id}
                className={`quick-action-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleQuickActionClick(action)}
              >
                <div className="card-icon">
                  <IconComponent size={20} />
                </div>
                <div className="card-title">{isKn ? action.titleKn : action.titleEn}</div>
                <div className="card-desc">{isKn ? action.descKn : action.descEn}</div>
              </div>
            );
          })}
        </div>

        {/* Public Information Search Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              type="text"
              className={isKn ? "kn-text" : ""}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-cream-border)',
                outline: 'none',
                fontSize: '0.95rem',
                background: '#FFFFFF'
              }}
              placeholder={isKn ? "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಬಸ್ ಪ್ರಯಾಣ, ಕೃಷಿ ಬೆಲೆ ಅಥವಾ ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ..." : "Search govt schemes, bus travel, APMC mandi prices, or circulars..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />

            {searchQuery && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.75rem 0.85rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSearchResult(null);
                  setSearchEmpty(false);
                }}
                title={isKn ? "ತೆರವುಗೊಳಿಸಿ" : "Clear"}
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary"
              disabled={!searchQuery.trim() || isSearching}
              onClick={() => handleSearch()}
            >
              {isSearching ? (
                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#FFF' }}></div>
              ) : (
                <Search size={18} />
              )}
              <span>{isKn ? 'ಹುಡುಕಿ' : 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Loading State for Search */}
        {isSearching && (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 8px', width: '32px', height: '32px' }}></div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {isKn ? 'ಅಧಿಕೃತ ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying official public information...'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {isKn ? 'ಸರ್ಕಾರಿ ವಾಹಿನಿಗಳು ಮತ್ತು ದೃಢೀಕೃತ ದಾಖಲೆಗಳಿಂದ ಸತ್ಯಾಂಶಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ' : 'Gathering facts from verified government sources and public records'}
            </div>
          </div>
        )}

        {/* General Error State with Retry */}
        {searchError && !isSearching && (
          <div style={{ padding: '1rem', background: '#FDEDEC', border: '1px solid #F5B7B1', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{searchError}</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
              onClick={() => handleSearch()}
            >
              <RefreshCw size={12} />
              <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ' : 'Try Again'}</span>
            </button>
          </div>
        )}

        {/* Empty State when no verified match is found */}
        {searchEmpty && !isSearching && searchResult && (
          <div className="empty-state-card fade-in">
            <div className="empty-state-icon-wrap">
              <Search size={22} />
            </div>
            <div className="empty-state-title">
              {searchResult.error || (isKn ? 'ಮಾಹಿತಿ ದೃಢೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ' : 'Information could not be verified')}
            </div>
            <div className="empty-state-desc" style={{ maxWidth: '420px', lineHeight: 1.6 }}>
              {isKn ? searchResult.messageKn : (searchResult.messageEn || searchResult.messageKn)}
            </div>
            {searchResult.suggestedTopics && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchResult.suggestedTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="scenario-pill-btn"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      setSearchQuery(topic);
                      handleSearch(topic);
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verified Current Information Result Card */}
        {!isSearching && searchResult && !searchEmpty && (
          <div className="analysis-result-card fade-in" style={{ marginTop: '1.25rem' }}>
            {/* Header: Verified Source Badge + Category + Timestamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div className="mode-badge badge-live">
                <ShieldCheck size={13} />
                <span>{isKn ? `ದೃಢೀಕೃತ ಮೂಲ: ${searchResult.source}` : `Verified Source: ${searchResult.source}`}</span>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>{isKn ? `ಪಡೆದ ಸಮಯ: ${new Date(searchResult.retrievedAt).toLocaleDateString('kn-IN')}` : `Retrieved: ${new Date(searchResult.retrievedAt).toLocaleDateString('en-US')}`}</span>
                {searchResult.sourceUrl && (
                  <a
                    href={searchResult.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-flag-red)', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}
                  >
                    {isKn ? 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್' : 'Official Portal'} <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* SEPARATED SECTION 1: Retrieved Verified Facts */}
            <div style={{ background: '#FFFDF7', border: '1px solid var(--color-cream-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.15rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                {isKn ? '1. ದೃಢೀಕೃತ ಸತ್ಯಾಂಶಗಳು (Retrieved Verified Facts):' : '1. Retrieved Verified Facts:'}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.65 }}>
                {searchResult.retrievedFacts?.map((fact, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{fact}</li>
                ))}
              </ul>
            </div>

            {/* SEPARATED SECTION 2: Plain-Language Explanation */}
            <div className="highlight-box">
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isKn ? '2. ಕನ್ನಡ ಸರಳ ವಿವರಣೆ (Plain-Language Explanation):' : '2. Plain-Language Explanation:'}
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-main)' }}>
                {isKn ? searchResult.explanationKn : (searchResult.explanationEn || searchResult.explanationKn)}
              </div>
            </div>

            {/* Connected Workflows Actions Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-cream-border)' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 0.95rem' }}
                onClick={handleCreateActionPlan}
              >
                <Sparkles size={16} />
                <span>{isKn ? 'ಕ್ರಿಯಾ ಯೋಜನೆ ರಚಿಸಿ' : 'Action Plan'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 0.95rem' }}
                onClick={handleMakeChecklist}
              >
                <ListTodo size={16} />
                <span>{isKn ? 'ಪರಿಶೀಲನಾ ಪಟ್ಟಿ' : 'Checklist'}</span>
              </button>

              <button
                type="button"
                className="btn btn-gold"
                style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 0.95rem' }}
                onClick={handleAddReminder}
              >
                <Bell size={16} />
                <span>{isKn ? 'ನೆನಪೋಲೆ ಸೇರಿಸಿ' : 'Reminder'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 0.95rem' }}
                onClick={handleSendToChatClick}
              >
                <MessageSquare size={16} />
                <span>{isKn ? 'ಧ್ವನಿ ವಿವರಣೆ ಕೇಳಿ' : 'Listen / Discuss'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
