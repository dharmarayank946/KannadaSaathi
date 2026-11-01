import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../layout/SectionHeader';
import {
  User,
  CheckCircle2,
  Clock,
  BookOpen,
  Gamepad2,
  Bookmark,
  Settings,
  Volume2,
  RotateCcw,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  HardDrive,
  AlertCircle,
  Camera,
  ShieldCheck,
  Mail,
  Phone,
  Languages,
  X,
  Award,
  ChevronRight,
  Sliders,
  Check,
  Sparkles,
  Lock
} from 'lucide-react';

export default function ProfilePage({ onBackToHome, langMode, setLangMode, speechRate, setSpeechRate }) {
  const isKn = langMode === 'kn';
  const fileInputRef = useRef(null);

  // Active section in the Account Settings layout:
  // 'profile' | 'preferences' | 'progress' | 'privacy'
  const [activeTab, setActiveTab] = useState('profile');

  // Load real user activity counts from localStorage
  const [savedPhrasesCount, setSavedPhrasesCount] = useState(0);
  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || (isKn ? 'ಕನ್ನಡ ಕಲಿ' : 'Kannada Learner'),
          email: parsed.email || 'learner@kannadasaathi.org',
          phone: parsed.phone || '+91 98765 43210',
          interfaceLanguage: parsed.interfaceLanguage || langMode,
          avatar: parsed.avatar || '👤',
          photoUrl: parsed.photoUrl || null,
          level: parsed.level || 'beginner',
          dailyGoalMinutes: parsed.dailyGoalMinutes || 15
        };
      } catch (e) {}
    }
    return {
      name: isKn ? 'ಕನ್ನಡ ಕಲಿ' : 'Kannada Learner',
      email: 'learner@kannadasaathi.org',
      phone: '+91 98765 43210',
      interfaceLanguage: langMode,
      avatar: '👤',
      photoUrl: null,
      level: 'beginner',
      dailyGoalMinutes: 15
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEmail, setTempEmail] = useState(profile.email);
  const [tempPhone, setTempPhone] = useState(profile.phone);
  const [tempInterfaceLang, setTempInterfaceLang] = useState(profile.interfaceLanguage || langMode);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(profile.photoUrl || null);
  const [tempLevel, setTempLevel] = useState(profile.level);
  const [tempGoal, setTempGoal] = useState(profile.dailyGoalMinutes);
  const [validationError, setValidationError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const avatarChoices = ['👤', '🧒', '👩‍🎓', '👨‍🎓', '🧑‍🏫', '👩‍🌾', '💼', '🌸', '✨'];

  // Read real local counts from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem('kannada_saathi_phrases');
      if (p) setSavedPhrasesCount(JSON.parse(p).length);

      const w = localStorage.getItem('kannada_saathi_diff_words');
      if (w) setSavedWordsCount(JSON.parse(w).length);

      const t = localStorage.getItem('kannada_saathi_teacher_progress');
      if (t) {
        const parsed = JSON.parse(t);
        setCompletedLessonsCount(Array.isArray(parsed) ? parsed.length : (typeof parsed === 'number' ? parsed : 0));
      }

      const h = localStorage.getItem('kannada_saathi_history');
      if (h) setActivityCount(JSON.parse(h).length);
    } catch (e) {}
  }, []);

  const handleStartEditing = () => {
    setTempName(profile.name);
    setTempEmail(profile.email || 'learner@kannadasaathi.org');
    setTempPhone(profile.phone || '+91 98765 43210');
    setTempInterfaceLang(profile.interfaceLanguage || langMode);
    setTempAvatar(profile.avatar);
    setTempPhotoUrl(profile.photoUrl || null);
    setTempLevel(profile.level);
    setTempGoal(profile.dailyGoalMinutes);
    setValidationError('');
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setValidationError('');
    setTempPhotoUrl(profile.photoUrl || null);
    setTempAvatar(profile.avatar);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setValidationError(
        isKn
          ? 'ಚಿತ್ರದ ಗಾತ್ರ ೨ MB ಗಿಂತ ಕಡಿಮೆಯಿರಬೇಕು. ದಯವಿಟ್ಟು ಚಿಕ್ಕ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
          : 'Image file size must be under 2 MB for browser storage.'
      );
      return;
    }

    if (!file.type.startsWith('image/')) {
      setValidationError(
        isKn ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಚಿತ್ರ ಕಡತವನ್ನು (PNG, JPG, WebP) ಆರಿಸಿ.' : 'Please select a valid image file (PNG, JPG, WebP).'
      );
      return;
    }

    setValidationError('');
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setTempPhotoUrl(loadEvent.target.result);
      if (!isEditing) {
        // If not in full edit mode, save photo directly
        const directUpdated = {
          ...profile,
          photoUrl: loadEvent.target.result
        };
        setProfile(directUpdated);
        localStorage.setItem('kannada_saathi_profile', JSON.stringify(directUpdated));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setTempPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!isEditing) {
      const directUpdated = {
        ...profile,
        photoUrl: null
      };
      setProfile(directUpdated);
      localStorage.setItem('kannada_saathi_profile', JSON.stringify(directUpdated));
    }
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    const cleanName = tempName.trim();
    if (!cleanName) {
      setValidationError(isKn ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your name.');
      return;
    }

    const updated = {
      ...profile,
      name: cleanName,
      email: tempEmail.trim() || 'learner@kannadasaathi.org',
      phone: tempPhone.trim() || '+91 98765 43210',
      interfaceLanguage: tempInterfaceLang,
      avatar: tempAvatar,
      photoUrl: tempPhotoUrl,
      level: tempLevel,
      dailyGoalMinutes: Number(tempGoal) || 15
    };

    setProfile(updated);
    if (setLangMode && tempInterfaceLang !== langMode) {
      setLangMode(tempInterfaceLang);
    }

    try {
      localStorage.setItem('kannada_saathi_profile', JSON.stringify(updated));
      setValidationError('');
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setValidationError(
        isKn
          ? 'ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಸಂಗ್ರಹ ಮೀರಿದೆ. ಫೋಟೋ ತೆಗೆದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'Browser local storage full. Please remove photo or use emoji avatar.'
      );
    }
  };

  const handleResetProgress = () => {
    const confirmMsg = isKn
      ? 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಚಟುವಟಿಕೆ ಇತಿಹಾಸವನ್ನು ಮರುಹೊಂದಿಸಲು ಬಯಸುವಿರಾ?'
      : 'Do you want to reset your local browser profile and activity history?';

    if (window.confirm(confirmMsg)) {
      const reset = {
        name: isKn ? 'ಕನ್ನಡ ಕಲಿ' : 'Kannada Learner',
        email: 'learner@kannadasaathi.org',
        phone: '+91 98765 43210',
        interfaceLanguage: langMode,
        avatar: '👤',
        photoUrl: null,
        level: 'beginner',
        dailyGoalMinutes: 15
      };
      setProfile(reset);
      localStorage.setItem('kannada_saathi_profile', JSON.stringify(reset));
      localStorage.removeItem('kannada_saathi_history');
      localStorage.removeItem('kannada_saathi_teacher_progress');
      setActivityCount(0);
      setCompletedLessonsCount(0);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const currentAvatarDisplay = profile.photoUrl ? (
    <img
      src={profile.photoUrl}
      alt="Profile Avatar"
      className="profile-avatar-img"
    />
  ) : (
    <span className="profile-avatar-emoji">{profile.avatar}</span>
  );

  const editingAvatarDisplay = tempPhotoUrl ? (
    <img
      src={tempPhotoUrl}
      alt="Preview Avatar"
      className="profile-avatar-img"
    />
  ) : (
    <span className="profile-avatar-emoji">{tempAvatar}</span>
  );

  const sidebarTabs = [
    { id: 'profile', titleKn: 'ಪ್ರೊಫೈಲ್ ಸಂಯೋಜನೆ', titleEn: 'Profile Settings', icon: User },
    { id: 'preferences', titleKn: 'ಕಲಿಕಾ ಆದ್ಯತೆಗಳು', titleEn: 'Learning Preferences', icon: Sliders },
    { id: 'progress', titleKn: 'ಕಲಿಕಾ ಪ್ರಗತಿ', titleEn: 'Learning Progress', icon: Award },
    { id: 'privacy', titleKn: 'ಖಾತೆ & ಗೌಪ್ಯತೆ', titleEn: 'Account & Privacy', icon: ShieldCheck }
  ];

  return (
    <div className="section-container profile-page-root" style={{ maxWidth: '1120px', margin: '0 auto', padding: '1rem' }}>
      {/* Hidden file input for device photo selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />

      {/* Page Header */}
      <SectionHeader
        badgeKn="ವೈಯಕ್ತಿಕ ಖಾತೆ • ಸಂಯೋಜನೆ"
        badgeEn="ACCOUNT • Profile Settings"
        titleKn="ನನ್ನ ಕಲಿಕಾ ಪ್ರೊಫೈಲ್"
        titleEn="My Learning Profile"
        taglineKn="ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪ್ರೊಫೈಲ್, ಕಲಿಕಾ ಹಂತ, ಧ್ವನಿ ಆದ್ಯತೆಗಳು ಮತ್ತು ದೈನಂದಿನ ಪ್ರಗತಿ"
        taglineEn="Manage your personal profile, learning goals, voice speed, and recorded progress"
        icon={User}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="profile-settings-layout">
        {/* ================================================================== */}
        {/* LEFT SIDEBAR / MOBILE NAVIGATION TABS                              */}
        {/* ================================================================== */}
        <aside className="profile-settings-sidebar" aria-label="Profile navigation">
          {/* User Profile Mini Banner in Sidebar */}
          <div className="sidebar-user-card">
            <div className="sidebar-avatar-wrap">
              {currentAvatarDisplay}
              <button
                type="button"
                className="sidebar-avatar-cam-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title={isKn ? "ಸಾಧನದಿಂದ ಫೋಟೋ ಬದಲಿಸಿ" : "Change photo from device"}
                aria-label={isKn ? "ಫೋಟೋ ಬದಲಿಸಿ" : "Change photo"}
              >
                <Camera size={12} />
              </button>
            </div>
            <div className="sidebar-user-meta">
              <div className="sidebar-user-name kn-heading">{profile.name}</div>
              <div className="sidebar-user-badge">
                {profile.level === 'beginner'
                  ? (isKn ? 'ಆರಂಭಿಕ ಹಂತ' : 'Beginner')
                  : profile.level === 'intermediate'
                  ? (isKn ? 'ಮಧ್ಯಮ ಹಂತ' : 'Intermediate')
                  : (isKn ? 'ಪ್ರೌಢ ಹಂತ' : 'Advanced')}
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="profile-nav-menu">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`profile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setValidationError('');
                  }}
                >
                  <Icon size={17} className="nav-item-icon" />
                  <span className="nav-item-text">{isKn ? tab.titleKn : tab.titleEn}</span>
                  <ChevronRight size={15} className="nav-item-arrow" />
                </button>
              );
            })}
          </nav>

          {/* Quick Stats Pill in Sidebar */}
          <div className="sidebar-quick-stats">
            <div className="quick-stat-item">
              <span className="stat-label">{isKn ? 'ಉಳಿಸಿದ ಪದಗಳು' : 'Saved Words'}</span>
              <span className="stat-value">{savedWordsCount}</span>
            </div>
            <div className="quick-stat-item">
              <span className="stat-label">{isKn ? 'ದಿನದ ಗುರಿ' : 'Daily Goal'}</span>
              <span className="stat-value">{profile.dailyGoalMinutes} {isKn ? 'ನಿಮಿಷ' : 'min'}</span>
            </div>
          </div>
        </aside>

        {/* ================================================================== */}
        {/* MAIN SETTINGS CONTENT AREA                                         */}
        {/* ================================================================== */}
        <main className="profile-settings-content">
          {/* Notification Toast Banners */}
          {saveSuccess && (
            <div className="profile-toast-success">
              <CheckCircle2 size={18} />
              <span>{isKn ? 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Settings updated successfully!'}</span>
            </div>
          )}

          {validationError && (
            <div className="profile-toast-error">
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 1: PROFILE SETTINGS (Information Form & Photo)                */}
          {/* ================================================================ */}
          {activeTab === 'profile' && (
            <section className="profile-tab-section" aria-label="Profile information">
              {/* Profile Top Hero Card */}
              <div className="profile-info-hero-card">
                <div className="hero-card-left">
                  <div className="hero-avatar-container">
                    {isEditing ? editingAvatarDisplay : currentAvatarDisplay}
                    <button
                      type="button"
                      className="hero-camera-action-btn"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      title={isKn ? "ಸಾಧನದಿಂದ ಫೋಟೋ ಬದಲಿಸಿ" : "Edit Photo from Device"}
                      aria-label={isKn ? "ಸಾಧನದಿಂದ ಫೋಟೋ ಬದಲಿಸಿ" : "Edit Photo"}
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <div className="hero-text-details">
                    <div className="hero-display-name kn-heading">
                      {isEditing ? (tempName || profile.name) : profile.name}
                    </div>
                    <div className="hero-sub-details">
                      <span>{profile.email}</span>
                      <span className="detail-separator">•</span>
                      <span>{profile.phone}</span>
                    </div>
                    <div className="hero-pills-row">
                      <span className="hero-level-chip">
                        ✦ {profile.level === 'beginner' ? (isKn ? 'ಆರಂಭಿಕ ಹಂತ' : 'Beginner Tier') : profile.level === 'intermediate' ? (isKn ? 'ಮಧ್ಯಮ ಹಂತ' : 'Intermediate Tier') : (isKn ? 'ಪ್ರೌಢ ಹಂತ' : 'Advanced Tier')}
                      </span>
                      <span className="hero-goal-chip">
                        ⏱️ {profile.dailyGoalMinutes} {isKn ? 'ನಿಮಿಷ ದಿನದ ಗುರಿ' : 'min daily goal'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hero-card-action">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn-settings-edit"
                      onClick={handleStartEditing}
                    >
                      <Settings size={15} />
                      <span>{isKn ? 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ' : 'Edit Profile'}</span>
                    </button>
                  ) : (
                    <div className="hero-action-buttons-group">
                      <button
                        type="button"
                        className="btn-settings-save"
                        onClick={handleSaveProfile}
                      >
                        <Save size={15} />
                        <span>{isKn ? 'ಉಳಿಸಿ' : 'Save Changes'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-settings-cancel"
                        onClick={handleCancelEditing}
                      >
                        <X size={15} />
                        <span>{isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo & Avatar Customization Drawer (Visible when editing) */}
              {isEditing && (
                <div className="profile-photo-editor-card">
                  <div className="photo-editor-header">
                    <div className="editor-title kn-heading">
                      {isKn ? 'ಪ್ರೊಫೈಲ್ ಚಿತ್ರ & ಅವತಾರ್ ಆಯ್ಕೆ' : 'Profile Photo & Avatar Options'}
                    </div>
                    <div className="editor-sub">
                      {isKn
                        ? 'ಸಾಧನದಿಂದ ನಿಮ್ಮ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಗರಿಷ್ಠ ೨ MB) ಅಥವಾ ಕೆಳಗಿನ ಅವತಾರ್ ಐಕಾನ್ ಆರಿಸಿ:'
                        : 'Upload photo from your device (Max 2MB) or choose a default avatar icon:'}
                    </div>
                  </div>

                  <div className="photo-editor-actions-row">
                    <button
                      type="button"
                      className="btn-upload-trigger"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <Upload size={14} />
                      <span>{tempPhotoUrl ? (isKn ? 'ಫೋಟೋ ಬದಲಿಸಿ' : 'Change Photo') : (isKn ? 'ಸಾಧನದಿಂದ ಫೋಟೋ ಆರಿಸಿ' : 'Upload from Device')}</span>
                    </button>

                    {tempPhotoUrl && (
                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 size={14} />
                        <span>{isKn ? 'ಫೋಟೋ ತೆಗೆಯಿರಿ' : 'Remove Photo'}</span>
                      </button>
                    )}
                  </div>

                  {/* Preset Avatar Emoji Options */}
                  <div className="avatar-choices-grid">
                    {avatarChoices.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`avatar-choice-pill ${(!tempPhotoUrl && tempAvatar === av) ? 'selected' : ''}`}
                        onClick={() => {
                          setTempAvatar(av);
                          setTempPhotoUrl(null);
                        }}
                        aria-label={`Select avatar ${av}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields: Balanced Two-Column Form */}
              <div className="profile-form-container">
                <div className="form-section-title kn-heading">
                  {isKn ? 'ಖಾತೆ ವಿವರಗಳು' : 'Personal Information'}
                </div>

                <form onSubmit={handleSaveProfile} className="profile-two-col-grid">
                  {/* Field 1: Display Name */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ಪೂರ್ಣ ಹೆಸರು (Display Name)' : 'Display Name'}
                    </label>
                    <div className="field-input-wrap">
                      <User size={16} className="field-icon" />
                      <input
                        type="text"
                        className="field-input"
                        value={isEditing ? tempName : profile.name}
                        onChange={(e) => setTempName(e.target.value)}
                        disabled={!isEditing}
                        maxLength={50}
                        required
                        placeholder={isKn ? "ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ" : "Enter your name"}
                      />
                    </div>
                  </div>

                  {/* Field 2: Email */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ (Email Address)' : 'Email Address'}
                    </label>
                    <div className="field-input-wrap">
                      <Mail size={16} className="field-icon" />
                      <input
                        type="email"
                        className="field-input"
                        value={isEditing ? tempEmail : profile.email}
                        onChange={(e) => setTempEmail(e.target.value)}
                        disabled={!isEditing}
                        maxLength={60}
                        placeholder="learner@kannadasaathi.org"
                      />
                    </div>
                  </div>

                  {/* Field 3: Phone */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ (Phone Number)' : 'Phone Number'}
                    </label>
                    <div className="field-input-wrap">
                      <Phone size={16} className="field-icon" />
                      <input
                        type="tel"
                        className="field-input"
                        value={isEditing ? tempPhone : profile.phone}
                        onChange={(e) => setTempPhone(e.target.value)}
                        disabled={!isEditing}
                        maxLength={20}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Field 4: Interface Language */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ಆದ್ಯತೆಯ ಭಾಷೆ (Interface Language)' : 'Preferred Language'}
                    </label>
                    <div className="field-input-wrap">
                      <Languages size={16} className="field-icon" />
                      <select
                        className="field-select"
                        value={isEditing ? tempInterfaceLang : (profile.interfaceLanguage || langMode)}
                        onChange={(e) => setTempInterfaceLang(e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                        <option value="en">English (English)</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 5: Learning Tier */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ಕಲಿಕೆಯ ಹಂತ (Kannada Level)' : 'Kannada Learning Tier'}
                    </label>
                    <div className="field-input-wrap">
                      <Award size={16} className="field-icon" />
                      <select
                        className="field-select"
                        value={isEditing ? tempLevel : profile.level}
                        onChange={(e) => setTempLevel(e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="beginner">{isKn ? 'ಆರಂಭಿಕ ಹಂತ (Beginner)' : 'Beginner Tier'}</option>
                        <option value="intermediate">{isKn ? 'ಮಧ್ಯಮ ಹಂತ (Intermediate)' : 'Intermediate Tier'}</option>
                        <option value="advanced">{isKn ? 'ಪ್ರೌಢ ಹಂತ (Advanced)' : 'Advanced Tier'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 6: Daily Practice Goal */}
                  <div className="profile-field-group">
                    <label className="field-label">
                      {isKn ? 'ದೈನಂದಿನ ಕಲಿಕಾ ಗುರಿ (Daily Goal)' : 'Daily Learning Goal'}
                    </label>
                    <div className="field-input-wrap">
                      <Clock size={16} className="field-icon" />
                      <select
                        className="field-select"
                        value={isEditing ? tempGoal : profile.dailyGoalMinutes}
                        onChange={(e) => setTempGoal(Number(e.target.value))}
                        disabled={!isEditing}
                      >
                        <option value={10}>{isKn ? '೧೦ ನಿಮಿಷ / ದಿನ' : '10 min / day'}</option>
                        <option value={15}>{isKn ? '೧೫ ನಿಮಿಷ / ದಿನ (ಶಿಫಾರಸು)' : '15 min / day (Recommended)'}</option>
                        <option value={20}>{isKn ? '೨೦ ನಿಮಿಷ / ದಿನ' : '20 min / day'}</option>
                        <option value={30}>{isKn ? '೩೦ ನಿಮಿಷ / ದಿನ' : '30 min / day'}</option>
                        <option value={45}>{isKn ? '೪೫ ನಿಮಿಷ / ದಿನ' : '45 min / day'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Bottom Save Bar when editing */}
                  {isEditing && (
                    <div className="form-bottom-save-bar">
                      <button type="submit" className="btn-form-save">
                        <Save size={16} />
                        <span>{isKn ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' : 'Save Changes'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-form-cancel"
                        onClick={handleCancelEditing}
                      >
                        <X size={16} />
                        <span>{isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </section>
          )}

          {/* ================================================================ */}
          {/* TAB 2: LEARNING PREFERENCES                                       */}
          {/* ================================================================ */}
          {activeTab === 'preferences' && (
            <section className="profile-tab-section" aria-label="Learning preferences">
              <div className="tab-header-box">
                <h3 className="tab-title kn-heading">
                  {isKn ? 'ಕಲಿಕಾ ಮತ್ತು ಧ್ವನಿ ಆದ್ಯತೆಗಳು' : 'Learning & Speech Preferences'}
                </h3>
                <p className="tab-subtitle">
                  {isKn
                    ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಭಾಷೆ, ಧ್ವನಿ ಓದುವ ವೇಗ ಮತ್ತು ದೈನಂದಿನ ಅಧ್ಯಯನ ನಿಯತಾಂಕಗಳನ್ನು ಬದಲಿಸಿ.'
                    : 'Customize website language, audio pronunciation speed, and practice routine.'}
                </p>
              </div>

              <div className="preferences-cards-stack">
                {/* 1. Website Interface Language Toggle */}
                <div className="pref-card-row">
                  <div className="pref-info">
                    <div className="pref-title kn-heading">
                      {isKn ? 'ವೆಬ್‌ಸೈಟ್ ಇಂಟರ್ಫೇಸ್ ಭಾಷೆ' : 'Interface Display Language'}
                    </div>
                    <div className="pref-desc">
                      {isKn ? 'ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ತಾಣವನ್ನು ವೀಕ್ಷಿಸಿ.' : 'Toggle complete platform navigation between Kannada and English.'}
                    </div>
                  </div>
                  <div className="pref-controls">
                    <button
                      type="button"
                      className={`pref-pill-btn ${langMode === 'kn' ? 'active' : ''}`}
                      onClick={() => setLangMode('kn')}
                    >
                      <span>ಕನ್ನಡ</span>
                      {langMode === 'kn' && <Check size={14} />}
                    </button>
                    <button
                      type="button"
                      className={`pref-pill-btn ${langMode === 'en' ? 'active' : ''}`}
                      onClick={() => setLangMode('en')}
                    >
                      <span>English</span>
                      {langMode === 'en' && <Check size={14} />}
                    </button>
                  </div>
                </div>

                {/* 2. Text-to-Speech Speed Selector */}
                <div className="pref-card-row">
                  <div className="pref-info">
                    <div className="pref-title kn-heading">
                      {isKn ? 'ಕನ್ನಡ ಧ್ವನಿ ಉಚ್ಚಾರಣೆಯ ವೇಗ' : 'Speech Playback Speed'}
                    </div>
                    <div className="pref-desc">
                      {isKn
                        ? 'ಸ್ಪಷ್ಟ ಉಚ್ಚಾರಣೆ ಕಲಿಯಲು ನಿಧಾನ (0.8x), ಸಾಮಾನ್ಯ (0.95x) ಅಥವಾ ವೇಗ (1.1x) ಆರಿಸಿ.'
                        : 'Adjust audio reading speed across translator, daily dialogues, stories, and heritage.'}
                    </div>
                  </div>
                  <div className="pref-controls speed-pills">
                    {[
                      { rate: 0.8, label: '0.8x (ನಿಧಾನ)' },
                      { rate: 0.95, label: '0.95x (ಸಾಮಾನ್ಯ)' },
                      { rate: 1.1, label: '1.1x (ವೇಗ)' }
                    ].map((item) => (
                      <button
                        key={item.rate}
                        type="button"
                        className={`pref-pill-btn ${speechRate === item.rate ? 'active' : ''}`}
                        onClick={() => setSpeechRate(item.rate)}
                      >
                        <span>{item.label}</span>
                        {speechRate === item.rate && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Daily Practice Goal Quick Switch */}
                <div className="pref-card-row">
                  <div className="pref-info">
                    <div className="pref-title kn-heading">
                      {isKn ? 'ದೈನಂದಿನ ಕಲಿಕಾ ಸಮಯ' : 'Daily Study Goal'}
                    </div>
                    <div className="pref-desc">
                      {isKn
                        ? 'ದಿನಕ್ಕೆ ೧೫ ನಿಮಿಷಗಳ ನಿರಂತರ ಅಭ್ಯಾಸವು ಅತ್ಯುತ್ತಮ ಫಲಿತಾಂಶ ನೀಡುತ್ತದೆ.'
                        : 'Consistent 15-minute daily practice provides the strongest conversational retention.'}
                    </div>
                  </div>
                  <div className="pref-controls goal-pills">
                    {[10, 15, 20, 30].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        className={`pref-pill-btn ${profile.dailyGoalMinutes === mins ? 'active' : ''}`}
                        onClick={() => {
                          const updated = { ...profile, dailyGoalMinutes: mins };
                          setProfile(updated);
                          localStorage.setItem('kannada_saathi_profile', JSON.stringify(updated));
                          setSaveSuccess(true);
                          setTimeout(() => setSaveSuccess(false), 2000);
                        }}
                      >
                        <span>{mins} {isKn ? 'ನಿಮಿಷ' : 'min'}</span>
                        {profile.dailyGoalMinutes === mins && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================================================================ */}
          {/* TAB 3: LEARNING PROGRESS (Compact Metrics Section)                */}
          {/* ================================================================ */}
          {activeTab === 'progress' && (
            <section className="profile-tab-section" aria-label="Learning progress metrics">
              <div className="tab-header-box">
                <h3 className="tab-title kn-heading">
                  {isKn ? 'ಸ್ಥಳೀಯ ಕಲಿಕಾ ಪ್ರಗತಿ & ಅಂಕಿಅಂಶಗಳು' : 'Learning Progress & Local Metrics'}
                </h3>
                <p className="tab-subtitle">
                  {isKn
                    ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ದಾಖಲಾಗಿರುವ ಶಬ್ದಗಳು, ಪೂರ್ಣಗೊಂಡ ಪಾಠಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳು.'
                    : 'Real metrics stored locally in your browser session and storage.'}
                </p>
              </div>

              {/* Compact Metrics 4-Card Grid */}
              <div className="metrics-compact-grid">
                {/* 1. Saved Words */}
                <div className="metric-box-card">
                  <div className="metric-icon-wrap yellow">
                    <BookOpen size={20} />
                  </div>
                  <div className="metric-details">
                    <div className="metric-number kn-heading">{savedWordsCount}</div>
                    <div className="metric-title">{isKn ? 'ಉಳಿಸಿದ ಶಬ್ದಗಳು' : 'Saved Words'}</div>
                    <div className="metric-sub">{isKn ? 'ಶಬ್ದಕೋಶ ಸಂಗ್ರಹ' : 'Vocabulary Vault'}</div>
                  </div>
                </div>

                {/* 2. Completed Lessons */}
                <div className="metric-box-card">
                  <div className="metric-icon-wrap red">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="metric-details">
                    <div className="metric-number kn-heading">{completedLessonsCount}</div>
                    <div className="metric-title">{isKn ? 'ಪೂರ್ಣಗೊಂಡ ಪಾಠಗಳು' : 'Completed Lessons'}</div>
                    <div className="metric-sub">{isKn ? 'ಕನ್ನಡ ಗುರು ಹಂತಗಳು' : 'Curriculum Units'}</div>
                  </div>
                </div>

                {/* 3. Daily Goal */}
                <div className="metric-box-card">
                  <div className="metric-icon-wrap green">
                    <Clock size={20} />
                  </div>
                  <div className="metric-details">
                    <div className="metric-number kn-heading">{profile.dailyGoalMinutes} <span style={{ fontSize: '0.9rem' }}>{isKn ? 'ನಿಮಿಷ' : 'min'}</span></div>
                    <div className="metric-title">{isKn ? 'ನಿತ್ಯ ಅಭ್ಯಾಸ ಗುರಿ' : 'Daily Goal'}</div>
                    <div className="metric-sub">{isKn ? 'ನಿಯಮಿತ ಅಧ್ಯಯನ' : 'Active Schedule'}</div>
                  </div>
                </div>

                {/* 4. Quiz Activity */}
                <div className="metric-box-card">
                  <div className="metric-icon-wrap blue">
                    <Gamepad2 size={20} />
                  </div>
                  <div className="metric-details">
                    <div className="metric-number kn-heading">{activityCount}</div>
                    <div className="metric-title">{isKn ? 'ದಾಖಲಿತ ಚಟುವಟಿಕೆಗಳು' : 'Activity Logs'}</div>
                    <div className="metric-sub">{isKn ? 'ರಸಪ್ರಶ್ನೆ & ಸಂವಾದ' : 'Quiz & Dialogue'}</div>
                  </div>
                </div>
              </div>

              {/* Saved Phrases Summary Card */}
              <div className="progress-summary-card">
                <div className="summary-left">
                  <Bookmark size={22} className="summary-icon" />
                  <div>
                    <div className="summary-title kn-heading">
                      {isKn ? 'ಉಳಿಸಿದ ದೈನಂದಿನ ಸಂಭಾಷಣೆ ವಾಕ್ಯಗಳು' : 'Saved Everyday Dialogue Phrases'}
                    </div>
                    <div className="summary-desc">
                      {isKn
                        ? `ನೀವು ಒಟ್ಟು ${savedPhrasesCount} ಉಪಯುಕ್ತ ಸಂಭಾಷಣೆ ವಾಕ್ಯಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಿಕೊಂಡಿದ್ದೀರಿ.`
                        : `You have saved ${savedPhrasesCount} practical phrases for quick offline recall.`}
                    </div>
                  </div>
                </div>
                <div className="summary-count-badge">
                  {savedPhrasesCount} {isKn ? 'ವಾಕ್ಯಗಳು' : 'phrases'}
                </div>
              </div>
            </section>
          )}

          {/* ================================================================ */}
          {/* TAB 4: ACCOUNT & PRIVACY                                          */}
          {/* ================================================================ */}
          {activeTab === 'privacy' && (
            <section className="profile-tab-section" aria-label="Account and privacy">
              <div className="tab-header-box">
                <h3 className="tab-title kn-heading">
                  {isKn ? 'ಖಾತೆ ಭದ್ರತೆ & ಸ್ಥಳೀಯ ಸಾಧನ ಗೌಪ್ಯತೆ' : 'Account Security & Device Privacy'}
                </h3>
                <p className="tab-subtitle">
                  {isKn
                    ? 'ಕನ್ನಡಸಾಥಿಯ ಪೂರ್ಣ ಡೇಟಾ ಖಾಸಗಿತನ, ಸ್ಥಳೀಯ ಸಂಗ್ರಹ ಮತ್ತು ಸುರಕ್ಷತೆಯ ನಿಯಮಗಳು.'
                    : 'KannadaSaathi client-first local architecture guarantees complete personal data privacy.'}
                </p>
              </div>

              {/* Verified Privacy Pillar */}
              <div className="privacy-card-banner green">
                <ShieldCheck size={26} className="privacy-banner-icon" />
                <div className="privacy-banner-content">
                  <div className="privacy-banner-heading kn-heading">
                    {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ರಹಿತ ಸ್ಥಳೀಯ ಮೋಡ್ (100% ಖಾಸಗಿ)' : 'Passwordless Local-First (100% Private)'}
                  </div>
                  <div className="privacy-banner-text">
                    {isKn
                      ? 'ಕನ್ನಡಸಾಥಿ ನಿಮ್ಮ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ವಿವರ, ಫೋಟೋ ಅಥವಾ ಕಲಿಕಾ ಮಾಹಿತಿಯನ್ನು ಕ್ಲೌಡ್ ಸರ್ವರ್‌ಗಳಿಗೆ ರವಾನಿಸುವುದಿಲ್ಲ. ನಿಮ್ಮ ವಿವರಗಳು ಕೇವಲ ನಿಮ್ಮ ಫೋನ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರವೇ ಸ್ಥಳೀಯವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.'
                      : 'KannadaSaathi never transmits your personal details, profile image, or study logs to external cloud databases. Everything is stored directly in your local browser sandbox.'}
                  </div>
                </div>
              </div>

              {/* Device Storage Status Pillar */}
              <div className="privacy-card-banner neutral">
                <HardDrive size={24} className="privacy-banner-icon" />
                <div className="privacy-banner-content">
                  <div className="privacy-banner-heading kn-heading">
                    {isKn ? 'ಸ್ಥಳೀಯ ಸಾಧನ ಸಂಗ್ರಹ ಮಾತ್ರ (Client Storage)' : 'Local Storage Only (No Cloud Tracking)'}
                  </div>
                  <div className="privacy-banner-text">
                    {isKn
                      ? 'ನಾವು ನಿಮ್ಮ ಗೂಗಲ್ ಖಾತೆಯ ಪ್ರೊಫೈಲ್ ಚಿತ್ರವನ್ನು ಪ್ರವೇಶಿಸುವುದಿಲ್ಲ. ನಿಮ್ಮ ಸಾಧನದಿಂದಲೇ ಯಾವುದೇ ಫೋಟೋವನ್ನು ನೇರವಾಗಿ ಆಯ್ಕೆಮಾಡಿಕೊಳ್ಳಲು ಸ್ವತಂತ್ರರಾಗಿದ್ದೀರಿ.'
                      : 'We do not read or scrape your Google account avatar. You have complete control to upload or remove device photos at any time.'}
                  </div>
                </div>
              </div>

              {/* Data Management Section: Reset */}
              <div className="danger-zone-card">
                <div className="danger-zone-info">
                  <div className="danger-zone-title kn-heading">
                    {isKn ? 'ಸ್ಥಳೀಯ ಕಲಿಕಾ ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ' : 'Reset Local Learning Data'}
                  </div>
                  <div className="danger-zone-desc">
                    {isKn
                      ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್, ಉಳಿಸಿದ ಶಬ್ದಗಳು ಮತ್ತು ಪಾಠಗಳ ಪ್ರಗತಿಯನ್ನು ಆರಂಭಿಕ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಿ.'
                      : 'Clear cached learning records, lesson checkboxes, and restore default beginner settings.'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-danger-reset"
                  onClick={handleResetProgress}
                >
                  <RotateCcw size={15} />
                  <span>{isKn ? 'ಸ್ಥಳೀಯ ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ' : 'Reset Data'}</span>
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
