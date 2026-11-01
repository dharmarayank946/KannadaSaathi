import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ArrowRight,
  Sparkles,
  X,
  Database,
  FileText,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Info,
  Layers,
  ChevronRight,
  ListTodo
} from 'lucide-react';

export default function SolvePanel({ incomingPlan, langMode, onLogActivity, onSwitchTab }) {
  // Navigation: 'plan' | 'checklist' | 'reminders'
  const [activeTab, setActiveTab] = useState('plan');

  // 1. Action Plan Generator State
  const [planInput, setPlanInput] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planLang, setPlanLang] = useState('kn'); // 'kn' | 'en'
  const [planError, setPlanError] = useState('');

  // 2. Checklist State (persisted to localStorage)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: '1', text: 'ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಶುಲ್ಕ ₹1,850 ಪಾವತಿಸಿ (ನವೆಂಬರ್ 28 ರೊಳಗೆ)', completed: false, date: '2026-11-28' },
      { id: '2', text: 'ಟೊಮೆಟೊ ಎಲೆಗಳಿಗೆ ಮ್ಯಾಂಕೋಜೆಬ್ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ', completed: true, date: '2026-10-20' },
      { id: '3', text: 'ಬೆಸ್ಕಾಂ ವಿದ್ಯುತ್ ಬಿಲ್ ₹420 ಪಾವತಿ ಮಾಡಿ ರಶೀದಿ ಉಳಿಸಿ', completed: false, date: '2026-11-12' }
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // 3. Reminders State (persisted to localStorage)
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'r1', title: 'ಕಾಲೇಜು ಶುಲ್ಕ ಅಂತಿಮ ದಿನಾಂಕ', date: '2026-11-28', time: '17:00', priority: 'high', completed: false },
      { id: 'r2', title: 'ಬೆಸ್ಕಾಂ ಬಿಲ್ ಕೊನೆಯ ದಿನ', date: '2026-11-12', time: '18:00', priority: 'medium', completed: false }
    ];
  });
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDate, setNewReminderDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [newReminderTime, setNewReminderTime] = useState('10:00');
  const [newReminderPriority, setNewReminderPriority] = useState('medium');
  const [reminderFormError, setReminderFormError] = useState('');

  // Browser Notification Status
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  // UI Modals & Alerts
  const [showConfirmResetChecklist, setShowConfirmResetChecklist] = useState(false);
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);
  const [reminderAlertBanner, setReminderAlertBanner] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [originalSourceNote, setOriginalSourceNote] = useState(null);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem('kannada_saathi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync reminders to localStorage
  useEffect(() => {
    localStorage.setItem('kannada_saathi_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Show transient toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Preset tasks for quick plan generation
  const quickPlanPresets = [
    { labelKn: 'ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ', labelEn: 'Scholarship App', query: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP) ಅರ್ಜಿ ಸಲ್ಲಿಕೆ' },
    { labelKn: 'ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ', labelEn: 'Exam Preparation', query: 'ಪರೀಕ್ಷೆಗಳಿಗೆ ಯಶಸ್ವಿ ಸಿದ್ಧತಾ ವೇಳಾಪಟ್ಟಿ' },
    { labelKn: 'ಸಣ್ಣ ಉದ್ಯಮ ಆರಂಭ', labelEn: 'Small Business', query: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಹೊಸ ಸಣ್ಣ ಉದ್ಯಮ (MSME) ಆರಂಭಿಸುವುದು' },
    { labelKn: 'ಹ್ಯಾಕಥಾನ್ ಸಿದ್ಧತೆ', labelEn: 'Hackathon Prep', query: 'ಕೋಡಿಂಗ್ ಹ್ಯಾಕಥಾನ್ ಸಿದ್ಧತೆ ಮತ್ತು ಗೆಲುವಿನ ಕಾರ್ಯಸೂಚಿ' },
    { labelKn: 'ಸರ್ಕಾರಿ ಸೇವೆ / ಗ್ಯಾರಂಟಿ', labelEn: 'Govt Services', query: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸೇವಾ ಸಿಂಧು ಅರ್ಜಿ' }
  ];

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted') {
        showToast('✓ ಬ್ರೌಸರ್ ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ಯಶಸ್ವಿಯಾಗಿ ಸಕ್ರಿಯಗೊಂಡಿವೆ!');
        new Notification('ಕನ್ನಡಸಾಥಿ ನೆನಪೋಲೆ ವ್ಯವಸ್ಥೆ', {
          body: 'ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ನೆನಪೋಲೆಗಳ ಗಂಟೆ ಯಶಸ್ವಿಯಾಗಿ ಸಕ್ರಿಯವಾಗಿದೆ.',
          icon: '/logo/kannadasaathi-logo.svg'
        });
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  // Generate Action Plan via backend
  const handleGenerateActionPlan = async (queryToUse) => {
    const q = (queryToUse || planInput).trim();
    if (!q) {
      setPlanError('ದಯವಿಟ್ಟು ನೀವು ಪೂರ್ಣಗೊಳಿಸಬೇಕಾದ ಕಾರ್ಯದ ವಿವರವನ್ನು ನಮೂದಿಸಿ.');
      return;
    }

    setPlanError('');
    setIsGeneratingPlan(true);

    try {
      const res = await fetch('http://localhost:5000/api/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: planLang })
      });

      const data = await res.json();
      if (res.ok && data.success && data.plan) {
        setGeneratedPlan(data.plan);
        setActiveTab('plan');
        onLogActivity?.({
          type: 'solve',
          title: `ಕ್ರಿಯಾ ಯೋಜನೆ: ${data.plan.titleKn || q}`,
          timestamp: new Date().toLocaleTimeString('kn-IN')
        });
      } else {
        setPlanError(data.error || 'ಕ್ರಿಯಾ ಯೋಜನೆ ರೂಪಿಸುವಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.');
      }
    } catch (err) {
      console.error('Action plan fetch error:', err);
      setPlanError('ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Convert Action Plan into Checklist Items
  const handleConvertPlanToChecklist = () => {
    if (!generatedPlan) return;
    const stepsList = planLang === 'en' && generatedPlan.stepsEn ? generatedPlan.stepsEn : generatedPlan.stepsKn;
    if (!stepsList || stepsList.length === 0) return;

    const newTasks = stepsList.map((step, idx) => ({
      id: Date.now().toString() + '_' + idx,
      text: `${step.stepNumber}. ${step.title}: ${step.description}`,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }));

    setTasks((prev) => [...newTasks, ...prev]);
    setActiveTab('checklist');
    showToast(`✓ ${newTasks.length} ಹಂತಗಳನ್ನು ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!`);
  };

  // Pre-fill Reminder from Action Plan
  const handlePlanToReminder = () => {
    if (!generatedPlan) return;
    setNewReminderTitle(planLang === 'en' ? generatedPlan.titleEn : generatedPlan.titleKn);
    setActiveTab('reminders');
    showToast('ನೆನಪೋಲೆ ನಮೂನೆಗೆ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಲಾಗಿದೆ. ದಿನಾಂಕ ಮತ್ತು ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ ಸೇರಿಸಿ.');
  };

  // Handle incoming cross-feature plans (Voice, Camera, Explore)
  useEffect(() => {
    if (!incomingPlan) return;

    const actionType = incomingPlan.actionType || 'checklist';

    if (actionType === 'plan') {
      const q = incomingPlan.query || incomingPlan.title || 'ಮುಖ್ಯ ಕಾರ್ಯ';
      setPlanInput(q);
      if (incomingPlan.originalText) {
        setOriginalSourceNote({
          origin: incomingPlan.title || 'ಹಿಂದಿನ ವಿಭಾಗದಿಂದ',
          text: incomingPlan.originalText
        });
      }
      handleGenerateActionPlan(q);
      setActiveTab('plan');
    } else if (actionType === 'reminder') {
      setActiveTab('reminders');
      setNewReminderTitle(incomingPlan.title || 'ಹೊಸ ನೆನಪೋಲೆ');
      if (incomingPlan.date) setNewReminderDate(incomingPlan.date);
      if (incomingPlan.time) setNewReminderTime(incomingPlan.time);
      showToast('ಹೊಸ ನೆನಪೋಲೆ ರಚನೆಗೆ ವಿವರಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.');
    } else {
      // Checklist transfer
      const planTasks = incomingPlan.tasks || incomingPlan.suggestedNextSteps || [];
      if (planTasks.length > 0) {
        const generatedTasks = planTasks.map((taskText, idx) => ({
          id: Date.now().toString() + idx,
          text: typeof taskText === 'string' ? taskText : taskText.text || 'ಹೊಸ ಕಾರ್ಯ',
          completed: false,
          date: incomingPlan.details?.dateOrDeadline || new Date().toISOString().split('T')[0]
        }));
        setTasks((prev) => [...generatedTasks, ...prev]);
        setActiveTab('checklist');
        showToast(`✓ ${generatedTasks.length} ಕಾರ್ಯಗಳನ್ನು ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!`);
      }
    }
  }, [incomingPlan]);

  // Checklist Actions
  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = () => {
    const text = newTaskInput.trim();
    if (!text) return;
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskInput('');
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditTask = (taskId) => {
    if (!editingTaskText.trim()) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, text: editingTaskText.trim() } : t))
    );
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const handleResetChecklist = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    setShowConfirmResetChecklist(false);
    showToast('ಪರಿಶೀಲನಾ ಪಟ್ಟಿಯ ಎಲ್ಲಾ ಕಾರ್ಯಗಳನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ.');
  };

  // Reminders Actions
  const handleAddReminder = () => {
    const title = newReminderTitle.trim();
    if (!title) {
      setReminderFormError('ದಯವಿಟ್ಟು ನೆನಪಿಸಬೇಕಾದ ವಿಷಯವನ್ನು ನಮೂದಿಸಿ.');
      return;
    }
    if (!newReminderDate) {
      setReminderFormError('ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }

    setReminderFormError('');
    const newRem = {
      id: 'rem_' + Date.now(),
      title,
      date: newReminderDate,
      time: newReminderTime || '10:00',
      priority: newReminderPriority,
      completed: false
    };

    setReminders((prev) => [newRem, ...prev]);
    setNewReminderTitle('');
    showToast('✓ ನೆನಪೋಲೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!');

    // Schedule real browser notification if permission granted
    if (notificationPermission === 'granted') {
      try {
        const scheduledDateTime = new Date(`${newReminderDate}T${newReminderTime || '10:00'}:00`);
        const now = new Date();
        const diffMs = scheduledDateTime.getTime() - now.getTime();
        if (diffMs > 0 && diffMs < 86400000 * 7) {
          setTimeout(() => {
            new Notification(`ಕನ್ನಡಸಾಥಿ ನೆನಪೋಲೆ: ${title}`, {
              body: `ನಿಗದಿತ ಸಮಯ: ${newReminderTime}`,
              icon: '/logo/kannadasaathi-logo.svg'
            });
            testTriggerReminder(newRem);
          }, diffMs);
        }
      } catch (e) {
        console.warn('Could not schedule timer notification:', e);
      }
    }
  };

  const toggleReminderCompleted = (remId) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === remId ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleDeleteReminder = (remId) => {
    setReminders((prev) => prev.filter((r) => r.id !== remId));
  };

  const testTriggerReminder = (reminder) => {
    setReminderAlertBanner(`🔔 ಗಂಟೆ ಮೊಳಗಿದೆ! ನೆನಪೋಲೆ: "${reminder.title}" — ನಿಗದಿತ ಸಮಯ: ${reminder.time}`);
    if (notificationPermission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
      new Notification(`ಕನ್ನಡಸಾಥಿ ನೆನಪೋಲೆ: ${reminder.title}`, {
        body: `ನಿಗದಿತ ಸಮಯ: ${reminder.time} | ದಿನಾಂಕ: ${reminder.date}`,
        icon: '/logo/kannadasaathi-logo.svg'
      });
    }
    setTimeout(() => {
      setReminderAlertBanner(null);
    }, 7000);
  };

  const handleConfirmClearAll = () => {
    setTasks([]);
    setReminders([]);
    setShowConfirmClearAll(false);
    showToast('ಎಲ್ಲಾ ಕಾರ್ಯಗಳು ಮತ್ತು ನೆನಪೋಲೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ.');
  };

  // Progress metrics
  const completedTaskCount = tasks.filter((t) => t.completed).length;
  const totalTaskCount = tasks.length;
  const progressPercent = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  return (
    <div className="panel-container">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-header-left">
          <div className="panel-header-icon">
            <CheckSquare size={22} />
          </div>
          <div>
            <h2 className="panel-header-title kn-heading">
              ಪರಿಹರಿಸು — Practical Solutions & Reminders
            </h2>
            <p className="panel-header-subtitle">
              ಹಂತ-ಹಂತದ ಕ್ರಿಯಾ ಯೋಜನೆಗಳು, ಸಂವಾದಾತ್ಮಕ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಮತ್ತು ಬ್ರೌಸರ್ ನೆನಪೋಲೆಗಳು
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="solve-tab-bar">
          <button
            type="button"
            className={`solve-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            <Sparkles size={15} />
            <span>ಕ್ರಿಯಾ ಯೋಜನೆ</span>
          </button>
          <button
            type="button"
            className={`solve-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <ListTodo size={15} />
            <span>ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ({totalTaskCount > 0 ? `${completedTaskCount}/${totalTaskCount}` : '0'})</span>
          </button>
          <button
            type="button"
            className={`solve-tab-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            <Bell size={15} />
            <span>ನೆನಪೋಲೆಗಳು ({reminders.length})</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fade-in" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#1B5E20', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Real-time Reminder Alert Simulation Banner */}
        {reminderAlertBanner && (
          <div className="fade-in" style={{ marginBottom: '1.25rem', padding: '0.9rem 1.25rem', background: '#FFF8E1', border: '1.5px solid var(--color-flag-yellow)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', color: '#7A5800', boxShadow: 'var(--shadow-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={22} className="heartbeat" style={{ color: 'var(--color-flag-red)' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {reminderAlertBanner}
              </div>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              onClick={() => setReminderAlertBanner(null)}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Original Transferred Text Banner if available */}
        {originalSourceNote && (
          <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1.15rem', background: 'var(--color-cream-subtle)', border: '1px solid var(--color-cream-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-flag-red)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Info size={14} />
              <span>ಮೂಲ ಸಂದೇಶ ({originalSourceNote.origin}):</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-main)', fontStyle: 'italic' }}>
              "{originalSourceNote.text}"
            </p>
          </div>
        )}

        {/* TAB 1: ACTION PLAN GENERATOR */}
        {activeTab === 'plan' && (
          <div className="fade-in">
            {/* Generator Search Box */}
            <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-cream-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>
                ಹೊಸ ಕ್ರಿಯಾ ಯೋಜನೆ ರೂಪಿಸಿ (Generate Step-by-Step Action Plan):
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="kn-text"
                  style={{ flex: 1, minWidth: '260px', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', outline: 'none', fontSize: '0.95rem' }}
                  placeholder="ಯಾವ ಕೆಲಸಕ್ಕೆ ಹಂತ-ಹಂತದ ಕ್ರಿಯಾ ಯೋಜನೆ ಬೇಕು? (ಉದಾ: ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ, ಸಣ್ಣ ಉದ್ಯಮ, ಹ್ಯಾಕಥಾನ್)..."
                  value={planInput}
                  onChange={(e) => setPlanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateActionPlan();
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isGeneratingPlan || !planInput.trim()}
                  onClick={() => handleGenerateActionPlan()}
                >
                  {isGeneratingPlan ? (
                    <>
                      <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', width: '16px', height: '16px' }}></div>
                      <span>ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      <span>ಯೋಜನೆ ರಚಿಸಿ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  ತ್ವರಿತ ಉದಾಹರಣೆಗಳು:
                </span>
                {quickPlanPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      background: 'var(--color-cream-subtle)',
                      border: '1px solid var(--color-cream-border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.28rem 0.65rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: 'var(--color-primary-dark)',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setPlanInput(preset.query);
                      handleGenerateActionPlan(preset.query);
                    }}
                  >
                    {preset.labelKn}
                  </button>
                ))}
              </div>

              {planError && (
                <div style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={15} />
                  <span>{planError}</span>
                </div>
              )}
            </div>

            {/* Generated Plan Display */}
            {generatedPlan ? (
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-cream-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }} className="fade-in">
                {/* Plan Header & Bilingual Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-cream-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="mode-badge badge-live">
                        <CheckCircle2 size={12} /> ದೃಢೀಕೃತ ಕ್ರಿಯಾ ಯೋಜನೆ
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} /> {planLang === 'en' ? generatedPlan.estimatedDurationEn : generatedPlan.estimatedDurationKn}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                      {planLang === 'en' ? generatedPlan.titleEn : generatedPlan.titleKn}
                    </h3>
                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                      {planLang === 'en' ? generatedPlan.summaryEn : generatedPlan.summaryKn}
                    </p>
                  </div>

                  {/* Language Switcher */}
                  <div style={{ display: 'flex', background: 'var(--color-cream-subtle)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-cream-border)' }}>
                    <button
                      type="button"
                      style={{
                        padding: '0.28rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        background: planLang === 'kn' ? 'var(--color-flag-red)' : 'transparent',
                        color: planLang === 'kn' ? '#FFFFFF' : 'var(--color-text-main)',
                        fontWeight: 700
                      }}
                      onClick={() => setPlanLang('kn')}
                    >
                      ಕನ್ನಡ
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '0.28rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        background: planLang === 'en' ? 'var(--color-flag-red)' : 'transparent',
                        color: planLang === 'en' ? '#FFFFFF' : 'var(--color-text-main)',
                        fontWeight: 700
                      }}
                      onClick={() => setPlanLang('en')}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Required Documents / Materials Section */}
                {((planLang === 'en' && generatedPlan.requiredDocumentsEn?.length > 0) ||
                  generatedPlan.requiredDocumentsKn?.length > 0) && (
                  <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--color-cream-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileText size={15} />
                      <span>{planLang === 'en' ? 'Required Documents & Prerequisites:' : 'ಅಗತ್ಯ ದಾಖಲೆಗಳು & ಸಾಮಗ್ರಿಗಳು:'}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {(planLang === 'en' ? generatedPlan.requiredDocumentsEn : generatedPlan.requiredDocumentsKn).map((doc, idx) => (
                        <span key={idx} className="plan-doc-badge">
                          <CheckCircle2 size={13} style={{ color: 'var(--color-flag-red)' }} />
                          <span>{doc}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numbered Step-by-Step Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {(planLang === 'en' ? generatedPlan.stepsEn : generatedPlan.stepsKn)?.map((step, idx) => (
                    <div key={idx} className="step-card">
                      <div className="step-number-badge">{step.stepNumber || idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                            {step.title}
                          </h4>
                          {step.timeEstimate && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={12} /> {step.timeEstimate}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Warnings Box */}
                {((planLang === 'en' && generatedPlan.warningsEn?.length > 0) ||
                  generatedPlan.warningsKn?.length > 0) && (
                  <div className="plan-warning-box" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.4rem' }}>
                      <ShieldAlert size={16} />
                      <span>{planLang === 'en' ? 'Important Warnings & Verification:' : 'ಮುಖ್ಯ ಎಚ್ಚರಿಕೆಗಳು & ದೃಢೀಕರಣದ ಅಂಶಗಳು:'}</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.83rem', lineHeight: 1.5 }}>
                      {(planLang === 'en' ? generatedPlan.warningsEn : generatedPlan.warningsKn).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                    {generatedPlan.verificationSource && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.76rem', color: '#7f1d1d', borderTop: '1px dashed #FFCDD2', paddingTop: '0.4rem' }}>
                        ಅಧಿಕೃತ ಪರಿಶೀಲನಾ ಮೂಲ: <strong>{generatedPlan.verificationSource}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Conversion Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--color-cream-border)', paddingTop: '1.25rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '220px' }}
                    onClick={handleConvertPlanToChecklist}
                  >
                    <ListTodo size={17} />
                    <span>ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗೆ ಪರಿವರ್ತಿಸಿ (Make Checklist)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-gold"
                    style={{ flex: 1, minWidth: '200px' }}
                    onClick={handlePlanToReminder}
                  >
                    <Bell size={17} />
                    <span>ನೆನಪೋಲೆ ನಿಗದಿಪಡಿಸಿ (Add Reminder)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State for Action Plan */
              <div className="empty-state-card fade-in">
                <div className="empty-state-icon-wrap">
                  <Sparkles size={24} />
                </div>
                <div className="empty-state-title">ಹೊಸ ಕ್ರಿಯಾ ಯೋಜನೆ ಸಿದ್ಧವಾಗಿಲ್ಲ (No Plan Generated)</div>
                <div className="empty-state-desc">
                  ಮೇಲಿನ ಹುಡುಕಾಟ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ನೀವು ಪೂರ್ಣಗೊಳಿಸಬೇಕಾದ ಕೆಲಸವನ್ನು ನಮೂದಿಸಿ (ಉದಾ: "ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ" ಅಥವಾ "ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ") ಅಥವಾ ತ್ವರಿತ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="fade-in">
            {/* Progress Bar Header */}
            {tasks.length > 0 && (
              <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-cream-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    ಕಾರ್ಯ ಪ್ರಗತಿ (Checklist Progress):
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-flag-red)' }}>
                    {completedTaskCount} / {totalTaskCount} ಪೂರ್ಣಗೊಂಡಿದೆ ({progressPercent}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            {/* Add Task Input */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="kn-text"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  background: '#FFFFFF'
                }}
                placeholder="ಹೊಸ ಕಾರ್ಯವನ್ನು ಬರೆಯಿರಿ (ಉದಾ: ರಸಗೊಬ್ಬರ ಖರೀದಿ, ಹಾಲ್ ಟಿಕೆಟ್ ಪ್ರಿಂಟ್)..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={!newTaskInput.trim()}
                onClick={handleAddTask}
              >
                <Plus size={18} />
                <span>ಸೇರಿಸಿ</span>
              </button>
            </div>

            {/* Empty State when tasks are empty */}
            {tasks.length === 0 && (
              <div className="empty-state-card fade-in">
                <div className="empty-state-icon-wrap">
                  <CheckSquare size={24} />
                </div>
                <div className="empty-state-title">ಕಾರ್ಯ ಪಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ (No Tasks)</div>
                <div className="empty-state-desc">
                  ನಿಮ್ಮ ಬಳಿ ಯಾವುದೇ ಬಾಕಿ ಕೆಲಸಗಳಿಲ್ಲ! ಮೇಲಿನ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಹೊಸ ಕಾರ್ಯವನ್ನು ಸೇರಿಸಿ ಅಥವಾ "ಕ್ರಿಯಾ ಯೋಜನೆ" ಟ್ಯಾಬ್‌ನಿಂದ ಹಂತ-ಹಂತದ ಯೋಜನೆಯನ್ನು ಆಮದು ಮಾಡಿಕೊಳ್ಳಿ.
                </div>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setActiveTab('plan')}
                >
                  <Sparkles size={16} />
                  <span>ಕ್ರಿಯಾ ಯೋಜನೆ ಜನರೇಟರ್‌ಗೆ ಹೋಗಿ</span>
                </button>
              </div>
            )}

            {/* Task Items List */}
            {tasks.length > 0 && (
              <div className="task-list">
                {tasks.map((task) => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />

                      {editingTaskId === task.id ? (
                        <div style={{ display: 'flex', gap: '0.4rem', flex: 1 }}>
                          <input
                            type="text"
                            className="kn-text"
                            style={{ flex: 1, padding: '0.35rem 0.6rem', borderRadius: '4px', border: '1px solid var(--color-primary)' }}
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditTask(task.id);
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => saveEditTask(task.id)}
                          >
                            ಉಳಿಸಿ
                          </button>
                        </div>
                      ) : (
                        <div className="task-text" style={{ fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.4 }}>
                          {task.text}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {task.date && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={12} /> {task.date}
                        </span>
                      )}

                      {editingTaskId !== task.id && (
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)' }}
                          onClick={() => startEditTask(task)}
                          title="ತಿದ್ದಿ (Edit Task)"
                        >
                          <Edit3 size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', opacity: 0.7 }}
                        onClick={() => handleDeleteTask(task.id)}
                        title="ತೆಗೆದುಹಾಕಿ (Delete)"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Checklist Reset Options */}
            {tasks.length > 0 && (
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                  onClick={() => setShowConfirmResetChecklist(true)}
                >
                  <RotateCcw size={13} />
                  <span>ಗುರುತುಗಳನ್ನು ಮರುಹೊಂದಿಸಿ (Reset Checklist)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SMART REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="fade-in">
            {/* Notification Permission Advisor Card */}
            <div style={{ background: '#FFFFFF', padding: '1.15rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-cream-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Bell size={20} style={{ color: notificationPermission === 'granted' ? '#2ECC71' : 'var(--color-flag-red)' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      ಬ್ರೌಸರ್ ನೋಟಿಫಿಕೇಶನ್ ವ್ಯವಸ್ಥೆ (Browser Notifications):
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {notificationPermission === 'granted' && '✓ ಬ್ರೌಸರ್ ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ. ಗಡುವಿನ ವೇಳೆ ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್/ಮೊಬೈಲ್‌ನಲ್ಲಿ ಗಂಟೆ ಬಾರಿಸುತ್ತದೆ.'}
                      {notificationPermission === 'denied' && '⚠️ ನೋಟಿಫಿಕೇಶನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಅಪ್ಲಿಕೇಶನ್ ತೆರೆದಿದ್ದಾಗ ಮಾತ್ರ ಧ್ವನಿ/ಬ್ಯಾನರ್ ಮೂಲಕ ನೆನಪಿಸಲಾಗುತ್ತದೆ.'}
                      {notificationPermission === 'default' && 'ಬ್ರೌಸರ್ ನೋಟಿಫಿಕೇಶನ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಅನುಮತಿ ನೀಡಿ.'}
                      {notificationPermission === 'unsupported' && 'ℹ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Notifications ಬೆಂಬಲವಿಲ್ಲ. ಅಪ್ಲಿಕೇಶನ್ ತೆರೆದಿದ್ದಾಗ ಧ್ವನಿ/ಬ್ಯಾನರ್ ಮೂಲಕ ನೆನಪಿಸಲಾಗುತ್ತದೆ.'}
                    </div>
                  </div>
                </div>

                {notificationPermission === 'default' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
                    onClick={handleRequestNotificationPermission}
                  >
                    <span>ಅನುಮತಿ ಸಕ್ರಿಯಗೊಳಿಸಿ</span>
                  </button>
                )}
                {notificationPermission === 'granted' && (
                  <span className="mode-badge badge-live">
                    <CheckCircle2 size={12} /> ಸಕ್ರಿಯ (Active)
                  </span>
                )}
              </div>
            </div>

            {/* Set New Reminder Form */}
            <div style={{ background: 'var(--color-cream-subtle)', padding: '1.15rem 1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--color-cream-border)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={16} />
                <span>ಹೊಸ ನೆನಪೋಲೆ ಸೇರಿಸಿ (Set New Reminder):</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="kn-text"
                  style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', background: '#FFFFFF', fontSize: '0.9rem' }}
                  placeholder="ನೆನಪಿಸಬೇಕಾದ ವಿಷಯ..."
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                />
                <input
                  type="date"
                  style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', background: '#FFFFFF', fontSize: '0.9rem' }}
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                />
                <input
                  type="time"
                  style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', background: '#FFFFFF', fontSize: '0.9rem' }}
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                />
                <select
                  style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', background: '#FFFFFF', fontSize: '0.85rem' }}
                  value={newReminderPriority}
                  onChange={(e) => setNewReminderPriority(e.target.value)}
                >
                  <option value="high">ಹೆಚ್ಚಿನ ಆದ್ಯತೆ (High)</option>
                  <option value="medium">ಸಾಧಾರಣ (Medium)</option>
                </select>
                <button
                  type="button"
                  className="btn btn-gold"
                  disabled={!newReminderTitle.trim()}
                  onClick={handleAddReminder}
                  style={{ padding: '0.65rem 1rem' }}
                >
                  <Bell size={16} />
                  <span>ನೆನಪಿಸು</span>
                </button>
              </div>

              {reminderFormError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} />
                  <span>{reminderFormError}</span>
                </div>
              )}
            </div>

            {/* Empty State for Reminders */}
            {reminders.length === 0 && (
              <div className="empty-state-card fade-in">
                <div className="empty-state-icon-wrap">
                  <Bell size={24} />
                </div>
                <div className="empty-state-title">ನೆನಪೋಲೆಗಳ ಪಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ (No Reminders)</div>
                <div className="empty-state-desc">
                  ಮುಖ್ಯ ಗಡುವು ಅಥವಾ ದಿನಾಂಕಗಳಿಗಾಗಿ ಮೇಲಿನ ಫಾರ್ಮ್ ಬಳಸಿ ನೆನಪೋಲೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ.
                </div>
              </div>
            )}

            {/* Reminders List */}
            {reminders.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {reminders.map((rem) => (
                  <div key={rem.id} className={`reminder-card ${rem.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={rem.completed}
                        onChange={() => toggleReminderCompleted(rem.id)}
                        title="ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ"
                      />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: rem.completed ? 'var(--color-text-muted)' : 'var(--color-primary-dark)', textDecoration: rem.completed ? 'line-through' : 'none' }}>
                          {rem.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '4px', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Calendar size={13} /> {rem.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={13} /> {rem.time}
                          </span>
                          <span className={`reminder-badge ${rem.priority === 'high' ? 'high' : 'medium'}`}>
                            {rem.priority === 'high' ? 'ತುರ್ತು (High)' : 'ಸಾಧಾರಣ'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => testTriggerReminder(rem)}
                        title="ಪರೀಕ್ಷಾರ್ಥವಾಗಿ ಗಂಟೆ ಮೊಳಗಿಸಿ (Test Chime Simulation)"
                      >
                        <Bell size={13} />
                        <span>ಪರೀಕ್ಷಿಸಿ</span>
                      </button>

                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                        onClick={() => handleDeleteReminder(rem.id)}
                        title="ತೆಗೆದುಹಾಕಿ (Delete)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clear All Bottom Controls & Privacy Notice */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-cream-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <Database size={14} style={{ color: 'var(--color-flag-red)' }} />
            <span>ಡೇಟಾ ನಿಮ್ಮ ಬ್ರೌಸರ್ LocalStorage ನಲ್ಲಿ ಮಾತ್ರ ಸಂಗ್ರಹವಾಗಿದ್ದು, ೧೦೦% ಸುರಕ್ಷಿತವಾಗಿದೆ.</span>
          </div>

          {(tasks.length > 0 || reminders.length > 0) && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', color: 'var(--color-danger)' }}
              onClick={() => setShowConfirmClearAll(true)}
            >
              ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ (Clear All)
            </button>
          )}
        </div>

        {/* Confirmation Modal: Reset Checklist */}
        {showConfirmResetChecklist && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <RotateCcw size={22} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಮರುಹೊಂದಿಸಿ</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                ಪೂರ್ಣಗೊಂಡಿರುವ ಎಲ್ಲಾ ಕಾರ್ಯಗಳ ಗುರುತುಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಪಟ್ಟಿಯನ್ನು ಆರಂಭಿಕ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುತ್ತೀರಾ?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmResetChecklist(false)}
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleResetChecklist}
                >
                  ಹೌದು, ಮರುಹೊಂದಿಸಿ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal: Clear All */}
        {showConfirmClearAll && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', marginBottom: '0.75rem' }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ಖಚಿತಪಡಿಸಿ (Confirm Action)</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                ನಿಮ್ಮ ಎಲ್ಲಾ ಉಳಿಸಿದ ಕಾರ್ಯಗಳು ಮತ್ತು ನೆನಪೋಲೆಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುತ್ತೀರಾ?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmClearAll(false)}
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmClearAll}
                >
                  ಹೌದು, ತೆರವುಗೊಳಿಸಿ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
