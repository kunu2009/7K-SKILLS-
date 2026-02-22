import { useState, useEffect, ElementType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Droplets, Dumbbell, BookOpen, Brain, Smile, Gamepad2, 
  CheckCircle2, Circle, Sunrise, Flame, Star, Zap, Footprints,
  Calendar as CalendarIcon, ListTodo, Bell, Trophy, Plus, Moon,
  Clock, X, Timer, Download, ChevronRight, Settings, Book, Palette,
  Smartphone, Trash2, ChevronLeft, Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ICONS: Record<string, ElementType> = {
  Sunrise, Sun, Smile, Droplets, Brain, Dumbbell, BookOpen, Gamepad2,
  Flame, Star, Zap, Footprints, Trophy, Circle, Moon, Clock, Timer
};

type Habit = {
  id: string;
  title: string;
  iconName: string;
  time: string;
  completed: boolean;
  repeatDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
};

type Stack = {
  id: string;
  title: string;
  habits: Habit[];
};

const INITIAL_STACKS: Stack[] = [
  {
    id: 'morning',
    title: 'Morning Stack',
    habits: [
      { id: 'h1', title: 'Wake up at 6:30 AM', iconName: 'Sunrise', time: '06:30', completed: false },
      { id: 'h2', title: '5 Min Morning Sun', iconName: 'Sun', time: '06:35', completed: false },
      { id: 'h3', title: 'Face Wash & Exercise', iconName: 'Smile', time: '06:45', completed: false },
      { id: 'h4', title: 'Drink Water (1L)', iconName: 'Droplets', time: '07:00', completed: false },
    ],
  },
  {
    id: 'afternoon',
    title: 'Afternoon Stack',
    habits: [
      { id: 'h5', title: 'Study Session (Deep Work)', iconName: 'Brain', time: '14:00', completed: false },
      { id: 'h6', title: 'Workout', iconName: 'Dumbbell', time: '17:00', completed: false },
      { id: 'h7', title: 'Drink Water (1L)', iconName: 'Droplets', time: '18:00', completed: false },
    ],
  },
  {
    id: 'evening',
    title: 'Evening Stack',
    habits: [
      { id: 'h8', title: 'Read Book/Article', iconName: 'BookOpen', time: '20:00', completed: false },
      { id: 'h9', title: 'Play Chess', iconName: 'Gamepad2', time: '21:00', completed: false },
      { id: 'h10', title: 'Face Wash', iconName: 'Smile', time: '21:30', completed: false },
    ],
  }
];

const BADGES = [
  { id: 'first_step', title: 'First Step', description: 'Complete your first habit', iconName: 'Footprints' },
  { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all habits in a day', iconName: 'Star' },
  { id: 'daily_streak', title: 'Daily Streak', description: 'Complete all habits for the day', iconName: 'Trophy' },
  { id: 'streak_3', title: '3 Day Streak', description: 'Maintain a 3-day streak', iconName: 'Flame' },
  { id: 'streak_7', title: '7 Day Streak', description: 'Maintain a 7-day streak', iconName: 'Zap' },
];

const THEMES = {
  light: { bg: 'bg-[#f5f5f5]', text: 'text-[#1a1a1a]', card: 'bg-white', border: 'border-black/5', accent: 'bg-black', accentText: 'text-white' },
  dark: { bg: 'bg-[#121212]', text: 'text-[#e5e5e5]', card: 'bg-[#1e1e1e]', border: 'border-white/10', accent: 'bg-white', accentText: 'text-black' },
  midnight: { bg: 'bg-[#0f172a]', text: 'text-[#e2e8f0]', card: 'bg-[#1e293b]', border: 'border-white/10', accent: 'bg-[#38bdf8]', accentText: 'text-[#0f172a]' },
  forest: { bg: 'bg-[#1a2e1a]', text: 'text-[#e2e8f0]', card: 'bg-[#2a402a]', border: 'border-white/10', accent: 'bg-[#4ade80]', accentText: 'text-[#1a2e1a]' },
  timberwolf: { bg: 'bg-[#d6d3d1]', text: 'text-[#44403c]', card: 'bg-[#e7e5e4]', border: 'border-[#a8a29e]', accent: 'bg-[#57534e]', accentText: 'text-[#f5f5f4]' },
};

type ThemeKey = keyof typeof THEMES;

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatTimeDisplay = (time24: string) => {
  const [h, m] = time24.split(':');
  const hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${m} ${ampm}`;
};

type Goal = {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
};

type AppData = {
  stacks: Stack[];
  history: Record<string, string[]>; // date -> array of completed habit ids
  journal: Record<string, { text: string; mood: string; highlights: string[] }>; // date -> journal entry
  points: number;
  badges: string[];
  lastDate: string;
  sleepTime: string;
  journalTime: string;
  theme: ThemeKey;
  goals: Goal[];
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('7k-skills-v4');
    const today = getTodayStr();
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        if (parsed.lastDate !== today) {
          return {
            ...parsed,
            stacks: parsed.stacks.map(s => ({
              ...s,
              habits: s.habits.map(h => ({ ...h, completed: false }))
            })),
            lastDate: today
          };
        }
        // Migrations
        if (!parsed.journal) parsed.journal = {};
        // Migrate old string journal to object
        Object.keys(parsed.journal).forEach(date => {
          if (typeof parsed.journal[date] === 'string') {
            // @ts-ignore
            parsed.journal[date] = { text: parsed.journal[date], mood: 'neutral', highlights: [] };
          }
        });
        if (!parsed.theme) parsed.theme = 'light';
        if (!parsed.journalTime) parsed.journalTime = "20:00";
        if (!parsed.goals) parsed.goals = [];
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    
    return {
      stacks: INITIAL_STACKS,
      history: {},
      journal: {},
      points: 0,
      badges: [],
      lastDate: today,
      sleepTime: "22:00",
      journalTime: "20:00",
      theme: 'light',
      goals: []
    };
  });

  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'goals' | 'settings'>('today');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [viewingDate, setViewingDate] = useState<string>(getTodayStr());
  
  // New Habit State
  const [addingToStack, setAddingToStack] = useState<string | null>(null);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('12:00');
  const [newHabitIcon, setNewHabitIcon] = useState('Circle');
  const [newHabitRepeatDays, setNewHabitRepeatDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Goals State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  // Sleep Countdown State
  const [timeLeftToSleep, setTimeLeftToSleep] = useState<string>('');

  // PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Selected Date for History View
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // End of Day Summary State
  const [showEndOfDay, setShowEndOfDay] = useState(false);

  const theme = THEMES[data.theme];

  useEffect(() => {
    localStorage.setItem('7k-skills-v4', JSON.stringify(data));
  }, [data]);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Real-time Date Check & Reminder Check & Sleep Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = getTodayStr();

      // Check for day change
      if (data.lastDate !== todayStr) {
        setData(prev => ({
          ...prev,
          stacks: prev.stacks.map(s => ({
            ...s,
            habits: s.habits.map(h => ({ ...h, completed: false }))
          })),
          lastDate: todayStr
        }));
        setViewingDate(todayStr);
      }

      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      // Reminders
      if ('Notification' in window && Notification.permission === 'granted') {
        data.stacks.forEach(stack => {
          stack.habits.forEach(habit => {
            if (!habit.completed && habit.time === currentTime) {
              const notifiedKey = `notified-${todayStr}-${habit.id}`;
              if (!localStorage.getItem(notifiedKey)) {
                new Notification("7K Skills", {
                  body: `Time for: ${habit.title}`,
                  icon: '/logo.svg'
                });
                localStorage.setItem(notifiedKey, 'true');
              }
            }
          });
        });

        // Journal Reminder
        if (data.journalTime === currentTime) {
          const journalKey = `notified-journal-${todayStr}`;
          if (!localStorage.getItem(journalKey)) {
            new Notification("7K Skills", {
              body: "Time to write your daily journal entry.",
              icon: '/logo.svg'
            });
            localStorage.setItem(journalKey, 'true');
          }
        }
      }

      // Sleep Countdown Calculation
      const [sleepH, sleepM] = data.sleepTime.split(':').map(Number);
      const sleepDate = new Date();
      sleepDate.setHours(sleepH, sleepM, 0, 0);
      
      if (now > sleepDate) {
        sleepDate.setDate(sleepDate.getDate() + 1);
      }
      
      const diff = sleepDate.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeftToSleep(`${hoursLeft}h ${minutesLeft}m`);

    }, 1000);

    return () => clearInterval(interval);
  }, [data.stacks, data.sleepTime, data.lastDate]);

  const calculateStreak = (history: Record<string, string[]>) => {
    let streak = 0;
    let d = new Date();
    const todayStr = getTodayStr();
    if (!history[todayStr] || history[todayStr].length === 0) {
      d.setDate(d.getDate() - 1);
    }

    while (true) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (history[dateStr] && history[dateStr].length > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const toggleHabit = (stackId: string, habitId: string) => {
    setData(prev => {
      let newPoints = prev.points;
      const newBadges = new Set(prev.badges);
      
      const currentCompleted = prev.history[viewingDate] || [];
      const isCompleting = !currentCompleted.includes(habitId);
      
      let newCompleted;
      if (isCompleting) {
        newCompleted = [...currentCompleted, habitId];
        newPoints += 10;
        newBadges.add('first_step');
      } else {
        newCompleted = currentCompleted.filter(id => id !== habitId);
        newPoints = Math.max(0, newPoints - 10);
      }
      
      const newHistory = { ...prev.history, [viewingDate]: newCompleted };

      const d = new Date(viewingDate);
      const dayOfWeek = d.getDay();
      const totalHabitsForDay = prev.stacks.flatMap(s => s.habits).filter(h => !h.repeatDays || h.repeatDays.includes(dayOfWeek)).length;

      if (newCompleted.length === totalHabitsForDay && totalHabitsForDay > 0) {
        newBadges.add('perfect_day');
        newBadges.add('daily_streak');
        newPoints += 50;
        
        if (viewingDate === getTodayStr()) {
          const summaryKey = `summary-${viewingDate}`;
          if (!localStorage.getItem(summaryKey)) {
            setShowEndOfDay(true);
            localStorage.setItem(summaryKey, 'true');
          }
        }
      }

      const currentStreak = calculateStreak(newHistory);
      if (currentStreak >= 3) newBadges.add('streak_3');
      if (currentStreak >= 7) newBadges.add('streak_7');

      return {
        ...prev,
        history: newHistory,
        points: newPoints,
        badges: Array.from(newBadges)
      };
    });
  };

  const updateHabitTime = (stackId: string, habitId: string, newTime: string) => {
    setData(prev => ({
      ...prev,
      stacks: prev.stacks.map(stack => {
        if (stack.id !== stackId) return stack;
        return {
          ...stack,
          habits: stack.habits.map(habit => {
            if (habit.id !== habitId) return habit;
            return { ...habit, time: newTime };
          })
        };
      })
    }));
    setEditingHabit(null);
  };

  const deleteHabit = (stackId: string, habitId: string) => {
    if (!confirm('Delete this habit?')) return;
    setData(prev => ({
      ...prev,
      stacks: prev.stacks.map(stack => {
        if (stack.id !== stackId) return stack;
        return {
          ...stack,
          habits: stack.habits.filter(h => h.id !== habitId)
        };
      })
    }));
  };

  const addNewHabit = () => {
    if (!addingToStack || !newHabitTitle.trim()) return;
    
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      title: newHabitTitle,
      time: newHabitTime,
      iconName: newHabitIcon,
      completed: false,
      repeatDays: newHabitRepeatDays.length === 7 ? undefined : newHabitRepeatDays
    };

    setData(prev => ({
      ...prev,
      stacks: prev.stacks.map(stack => {
        if (stack.id !== addingToStack) return stack;
        return {
          ...stack,
          habits: [...stack.habits, newHabit]
        };
      })
    }));

    setAddingToStack(null);
    setNewHabitTitle('');
    setNewHabitTime('12:00');
    setNewHabitRepeatDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const addNewGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDate) return;
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle,
      targetDate: newGoalDate,
      completed: false
    };
    setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    setNewGoalTitle('');
    setNewGoalDate('');
  };

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
    }));
  };

  const deleteGoal = (goalId: string) => {
    if (!confirm("Delete this goal?")) return;
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
  };

  const updateJournal = (date: string, field: 'text' | 'mood' | 'highlights', value: any) => {
    setData(prev => {
      const entry = prev.journal[date] || { text: '', mood: 'neutral', highlights: [] };
      return {
        ...prev,
        journal: { ...prev.journal, [date]: { ...entry, [field]: value } }
      };
    });
  };

  const viewingDateObj = new Date(viewingDate);
  const viewingDayOfWeek = viewingDateObj.getDay();
  const viewingHabits = data.stacks.flatMap(s => s.habits).filter(h => !h.repeatDays || h.repeatDays.includes(viewingDayOfWeek));
  const totalHabits = viewingHabits.length;
  const completedHabits = viewingHabits.filter(h => (data.history[viewingDate] || []).includes(h.id)).length;
  const progress = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const currentStreak = calculateStreak(data.history);

  const changeDate = (days: number) => {
    const [year, month, day] = viewingDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    setViewingDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const renderCalendar = () => {
    const days = [];
    const today = new Date();
    
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
      <div key={`label-${i}`} className={`text-center text-[10px] font-bold opacity-30 mb-1 ${theme.text}`}>
        {day}
      </div>
    ));

    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 27);
    const startDayOfWeek = startDay.getDay();
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayOfWeek = d.getDay();
      
      const completedCount = data.history[dateStr]?.length || 0;
      const hasJournal = !!data.journal[dateStr];
      const totalForDay = data.stacks.flatMap(s => s.habits).filter(h => !h.repeatDays || h.repeatDays.includes(dayOfWeek)).length;
      
      let intensityClass = data.theme === 'light' ? "bg-black/5" : "bg-white/5";
      if (completedCount > 0) intensityClass = data.theme === 'light' ? "bg-black/20" : "bg-white/20";
      if (completedCount > 3) intensityClass = data.theme === 'light' ? "bg-black/40" : "bg-white/40";
      if (completedCount > 6) intensityClass = data.theme === 'light' ? "bg-black/70" : "bg-white/70";
      if (completedCount >= totalForDay && totalForDay > 0) intensityClass = data.theme === 'light' ? "bg-black" : "bg-white";

      days.push(
        <button 
          key={dateStr} 
          onClick={() => setSelectedDate(dateStr)}
          aria-label={`View history for ${dateStr}. ${completedCount} habits completed.`}
          className={`aspect-square rounded-md ${intensityClass} transition-all relative
            ${data.theme === 'light' ? 'hover:ring-black/20 focus:ring-black' : 'hover:ring-white/20 focus:ring-white'} 
            hover:ring-2 focus:outline-none focus:ring-2`}
          title={`${dateStr}: ${completedCount} completed`}
        >
          {hasJournal && (
            <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${data.theme === 'light' ? 'bg-red-500' : 'bg-yellow-400'}`} />
          )}
        </button>
      );
    }

    return (
      <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm`}>
        <h3 className={`text-sm font-semibold uppercase tracking-widest opacity-50 mb-4 ${theme.text}`}>History & Journal</h3>
        <div className="grid grid-cols-7 gap-x-2 gap-y-1">
          {dayLabels}
          {days}
        </div>
      </div>
    );
  };

  const renderHistoryCharts = () => {
    // Prepare data for the last 7 days
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({
        name: dayName,
        completed: data.history[dateStr]?.length || 0,
        date: dateStr
      });
    }

    return (
      <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm mb-6`}>
        <h3 className={`text-sm font-semibold uppercase tracking-widest opacity-50 mb-6 ${theme.text}`}>Weekly Trends</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`${theme.accent} ${theme.accentText} text-xs p-2 rounded-lg shadow-xl`}>
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p>{payload[0].value} Habits</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
                {last7Days.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.date === getTodayStr() ? (data.theme === 'midnight' ? '#38bdf8' : data.theme === 'forest' ? '#4ade80' : '#000000') : 'currentColor'} 
                    className={entry.date === getTodayStr() ? '' : 'opacity-30'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans pb-24 selection:${theme.accent} selection:${theme.accentText} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${theme.bg}/80 backdrop-blur-md border-b ${theme.border} px-6 py-4`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">7K Skills</h1>
            {activeTab === 'today' ? (
              <div className="flex items-center gap-2 mt-0.5">
                <button onClick={() => changeDate(-1)} className="opacity-40 hover:opacity-100 p-1 -ml-1"><ChevronLeft className="w-4 h-4" /></button>
                <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">
                  {viewingDate === getTodayStr() ? 'Today, ' : ''}{new Date(viewingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <button onClick={() => changeDate(1)} disabled={viewingDate === getTodayStr()} className="opacity-40 hover:opacity-100 disabled:opacity-10 p-1"><ChevronRight className="w-4 h-4" /></button>
              </div>
            ) : (
              <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'}`}>
              <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-500' : 'opacity-30'}`} />
              <span className="font-semibold text-sm">{currentStreak}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'}`}>
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-sm">{data.points}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {activeTab === 'today' && (
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-xs font-medium opacity-50 mb-1.5 uppercase tracking-wider">
              <span>Daily Progress</span>
              <span>{progress}%</span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'}`}>
              <motion.div 
                className={`h-full ${theme.accent}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div 
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              {/* Sleep Countdown Widget */}
              <div className={`${theme.accent} ${theme.accentText} p-6 rounded-3xl shadow-lg flex items-center justify-between`}>
                <div>
                  <div className="text-xs font-medium opacity-60 uppercase tracking-widest mb-1">Sleep Countdown</div>
                  <div className="text-3xl font-light tracking-tighter">{timeLeftToSleep}</div>
                </div>
                <Moon className="w-8 h-8 opacity-20" />
              </div>

              {data.stacks.map((stack) => {
                const stackHabits = stack.habits.filter(h => !h.repeatDays || h.repeatDays.includes(viewingDayOfWeek));
                if (stackHabits.length === 0) return null;

                return (
                <section key={stack.id} className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4 flex-1">
                      <h2 className="text-lg font-semibold tracking-tight">{stack.title}</h2>
                      <div className={`flex-1 h-px ${data.theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`}></div>
                    </div>
                    {viewingDate === getTodayStr() && (
                      <button 
                        onClick={() => setAddingToStack(stack.id)}
                        aria-label={`Add habit to ${stack.title}`}
                        className={`ml-4 p-1.5 rounded-full transition-colors ${data.theme === 'light' ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20'}`}
                      >
                        <Plus className="w-4 h-4 opacity-60" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {stackHabits.map((habit) => {
                      const Icon = ICONS[habit.iconName] || Circle;
                      const isEditing = editingHabit === habit.id;
                      const isCompleted = (data.history[viewingDate] || []).includes(habit.id);

                      return (
                        <motion.div
                          key={habit.id}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                            ${isCompleted 
                              ? `${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'} border-transparent opacity-60` 
                              : `${theme.card} ${theme.border} shadow-sm hover:opacity-80`
                            }
                          `}
                          layout
                        >
                          <button 
                            onClick={() => toggleHabit(stack.id, habit.id)}
                            aria-label={`Mark ${habit.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                            className={`shrink-0 transition-colors duration-300 ${isCompleted ? 'opacity-50' : ''}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                            ) : (
                              <Circle className="w-7 h-7" aria-hidden="true" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0 flex flex-col items-start">
                            <button 
                              onClick={() => toggleHabit(stack.id, habit.id)}
                              className={`font-medium text-left truncate transition-all duration-300 ${isCompleted ? 'line-through opacity-50' : ''}`}
                            >
                              {habit.title}
                            </button>
                            
                            {isEditing ? (
                              <div className="flex items-center gap-2 mt-2 w-full">
                                <input 
                                  type="time" 
                                  defaultValue={habit.time}
                                  className={`text-xs font-medium rounded px-2 py-1 outline-none focus:ring-1 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black' : 'bg-white/10 focus:ring-white'}`}
                                  autoFocus
                                  onBlur={(e) => updateHabitTime(stack.id, habit.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateHabitTime(stack.id, habit.id, e.currentTarget.value);
                                    }
                                  }}
                                />
                                <button 
                                  onClick={() => deleteHabit(stack.id, habit.id)}
                                  className="text-xs text-red-500 hover:text-red-700 ml-auto px-2"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setEditingHabit(habit.id)}
                                aria-label={`Edit time for ${habit.title}`}
                                className="flex items-center gap-1.5 mt-1 opacity-40 hover:opacity-100 transition-colors"
                              >
                                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="text-xs font-medium uppercase tracking-wider">{formatTimeDisplay(habit.time)}</span>
                              </button>
                            )}
                          </div>
                          
                          <div className="shrink-0 opacity-20">
                            <Icon className="w-5 h-5" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
                );
              })}
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {renderHistoryCharts()}
              {renderCalendar()}

              <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm`}>
                <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50 mb-4">Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {BADGES.map(badge => {
                    const unlocked = data.badges.includes(badge.id);
                    const Icon = ICONS[badge.iconName] || Trophy;
                    return (
                      <div 
                        key={badge.id} 
                        className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all
                          ${unlocked ? `${theme.accent} ${theme.accentText} border-transparent` : `${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'} border-transparent opacity-60`}
                        `}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${unlocked ? 'text-yellow-400' : ''}`} />
                        <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
                        <p className="text-[10px] leading-tight opacity-80">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'goals' ? (
            <motion.div 
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm`}>
                <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50 mb-6">Add New Goal</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="e.g. Read 12 books this year"
                    className={`w-full p-4 rounded-2xl outline-none focus:ring-2 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black/10' : 'bg-white/10 focus:ring-white/10'}`}
                  />
                  <div className="flex gap-4">
                    <input 
                      type="date" 
                      value={newGoalDate}
                      onChange={(e) => setNewGoalDate(e.target.value)}
                      className={`flex-1 p-4 rounded-2xl outline-none focus:ring-2 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black/10' : 'bg-white/10 focus:ring-white/10'}`}
                    />
                    <button 
                      onClick={addNewGoal}
                      disabled={!newGoalTitle.trim() || !newGoalDate}
                      className={`px-6 rounded-2xl font-bold disabled:opacity-50 ${theme.accent} ${theme.accentText}`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {data.goals.map(goal => (
                  <div key={goal.id} className={`${theme.card} p-5 rounded-3xl border ${theme.border} shadow-sm flex items-center gap-4`}>
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`shrink-0 transition-colors duration-300 ${goal.completed ? 'opacity-50' : ''}`}
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <Circle className="w-8 h-8" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${goal.completed ? 'line-through opacity-50' : ''}`}>{goal.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1 opacity-50 text-xs font-medium uppercase tracking-wider">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <button onClick={() => deleteGoal(goal.id)} className="p-2 opacity-20 hover:opacity-100 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {data.goals.length === 0 && (
                  <div className="text-center opacity-40 py-10">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No goals set yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Theme Settings */}
              <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm`}>
                <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50 mb-6">Appearance</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(THEMES).map((t) => (
                    <button
                      key={t}
                      onClick={() => setData(prev => ({ ...prev, theme: t as ThemeKey }))}
                      className={`p-4 rounded-xl border text-left transition-all ${data.theme === t ? `${theme.accent} ${theme.accentText} border-transparent` : `${theme.border} hover:opacity-80`}`}
                    >
                      <span className="capitalize font-medium">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Settings */}
              <div className={`${theme.card} p-6 rounded-3xl border ${theme.border} shadow-sm`}>
                <h3 className="text-sm font-semibold uppercase tracking-widest opacity-50 mb-6">Schedule</h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-2xl ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 opacity-60" />
                      <span className="font-medium">Sleep Time</span>
                    </div>
                    <input 
                      type="time" 
                      value={data.sleepTime}
                      onChange={(e) => setData(prev => ({ ...prev, sleepTime: e.target.value }))}
                      className={`bg-transparent font-mono text-lg outline-none cursor-pointer rounded px-2 transition-colors ${data.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
                    />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-2xl ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <Book className="w-5 h-5 opacity-60" />
                      <span className="font-medium">Journal Reminder</span>
                    </div>
                    <input 
                      type="time" 
                      value={data.journalTime}
                      onChange={(e) => setData(prev => ({ ...prev, journalTime: e.target.value }))}
                      className={`bg-transparent font-mono text-lg outline-none cursor-pointer rounded px-2 transition-colors ${data.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
                    />
                  </div>
                </div>
              </div>

              {/* PWA Install */}
              {installPrompt && (
                <button 
                  onClick={handleInstallClick}
                  aria-label="Install App"
                  className={`w-full p-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${theme.accent} ${theme.accentText}`}
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Install App
                </button>
              )}

              {/* Branding */}
              <div className="pt-8 pb-6 text-center space-y-6 border-t border-black/5 mt-12 opacity-60">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2">Made by</p>
                  <h3 className="text-lg font-bold tracking-tight">7K Ecosystem</h3>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kunal (Founder)</p>
                  <div className="flex justify-center gap-4 text-xs opacity-70">
                    <a href="https://7kc.me" target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>
                    <span>•</span>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                    <span>•</span>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  </div>
                  <a href="mailto:kunal@7kc.me" className="text-xs opacity-60 hover:opacity-100 block mt-1">kunal@7kc.me</a>
                </div>

                <p className="text-[10px] opacity-50 uppercase tracking-widest">© 2025 7K Ecosystem. All rights reserved.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {addingToStack && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              role="dialog"
              aria-labelledby="add-habit-title"
              className={`${theme.card} w-full max-w-sm rounded-3xl p-6 shadow-2xl ${theme.text}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 id="add-habit-title" className="text-lg font-bold">Add New Habit</h3>
                <button 
                  onClick={() => setAddingToStack(null)} 
                  aria-label="Close modal"
                  className={`p-2 rounded-full ${data.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase opacity-40 mb-1 block">Title</label>
                  <input 
                    type="text" 
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="e.g. Meditate"
                    className={`w-full p-3 rounded-xl outline-none focus:ring-2 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black/10' : 'bg-white/10 focus:ring-white/10'}`}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase opacity-40 mb-1 block">Time</label>
                  <input 
                    type="time" 
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    className={`w-full p-3 rounded-xl outline-none focus:ring-2 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black/10' : 'bg-white/10 focus:ring-white/10'}`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase opacity-40 mb-2 block">Repeat</label>
                  <div className="flex justify-between gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (newHabitRepeatDays.includes(i)) {
                            if (newHabitRepeatDays.length > 1) {
                              setNewHabitRepeatDays(prev => prev.filter(d => d !== i));
                            }
                          } else {
                            setNewHabitRepeatDays(prev => [...prev, i].sort());
                          }
                        }}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                          newHabitRepeatDays.includes(i) 
                            ? `${theme.accent} ${theme.accentText}` 
                            : `${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'} opacity-40`
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase opacity-40 mb-2 block">Icon</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {Object.keys(ICONS).slice(0, 8).map(iconName => {
                      const Icon = ICONS[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => setNewHabitIcon(iconName)}
                          className={`p-3 rounded-xl shrink-0 transition-all ${newHabitIcon === iconName ? `${theme.accent} ${theme.accentText}` : `${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'} opacity-60`}`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={addNewHabit}
                  disabled={!newHabitTitle.trim()}
                  className={`w-full py-4 rounded-xl font-medium mt-4 disabled:opacity-50 ${theme.accent} ${theme.accentText}`}
                >
                  Add Habit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* End of Day Summary Modal */}
        <AnimatePresence>
          {showEndOfDay && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`${theme.card} w-full max-w-sm rounded-3xl p-8 shadow-2xl ${theme.text} text-center relative overflow-hidden`}
              >
                {/* Confetti Effect Background (Simplified) */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,${data.theme === 'light' ? '#000' : '#fff'}_1px,transparent_1px)] bg-[length:20px_20px]`} />
                </div>

                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${theme.accent} ${theme.accentText} shadow-lg`}>
                    <Trophy className="w-10 h-10" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Day Complete!</h2>
                  <p className="opacity-60 mb-8 text-sm">You've crushed all your habits for today.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`p-4 rounded-2xl ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'}`}>
                      <div className="text-xs font-bold uppercase opacity-40 mb-1">Points Earned</div>
                      <div className="text-2xl font-bold flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500" />
                        {data.points}
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/5'}`}>
                      <div className="text-xs font-bold uppercase opacity-40 mb-1">Current Streak</div>
                      <div className="text-2xl font-bold flex items-center justify-center gap-1">
                        <Flame className="w-5 h-5 text-orange-500" />
                        {currentStreak}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowEndOfDay(false)}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${theme.accent} ${theme.accentText}`}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* History/Journal Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              role="dialog"
              aria-labelledby="history-detail-title"
              className={`${theme.card} w-full max-w-sm rounded-3xl p-6 shadow-2xl ${theme.text} max-h-[80vh] flex flex-col`}
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 id="history-detail-title" className="text-lg font-bold">
                  {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <button 
                  onClick={() => setSelectedDate(null)} 
                  aria-label="Close modal"
                  className={`p-2 rounded-full ${data.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 space-y-6">
                {/* Completed Habits List */}
                <div>
                  <h4 className="text-xs font-bold uppercase opacity-40 mb-3">Completed Habits</h4>
                  <div className="space-y-2">
                    {data.history[selectedDate]?.length ? (
                      data.stacks.flatMap(s => s.habits).filter(h => data.history[selectedDate].includes(h.id)).map(habit => {
                        const Icon = ICONS[habit.iconName] || Circle;
                        return (
                          <div key={habit.id} className={`flex items-center gap-3 p-3 rounded-xl ${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'}`}>
                            <Icon className="w-5 h-5 opacity-60" />
                            <span className="font-medium">{habit.title}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center opacity-40 py-2 text-sm">No habits completed.</p>
                    )}
                  </div>
                </div>

                {/* Journal Entry */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase opacity-40 flex items-center gap-2">
                      <Book className="w-3 h-3" />
                      Daily Journal
                    </h4>
                    <button 
                      onClick={() => { setSelectedDate(null); setActiveTab('settings'); }}
                      className={`p-1.5 rounded-full transition-colors ${data.theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
                      title="Set Journal Reminder"
                    >
                      <Bell className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  </div>
                  
                  {/* Mood Selector */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
                    {['happy', 'neutral', 'sad', 'stressed', 'energetic', 'tired'].map(mood => (
                      <button
                        key={mood}
                        onClick={() => updateJournal(selectedDate, 'mood', mood)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                          (data.journal[selectedDate]?.mood || 'neutral') === mood
                            ? `${theme.accent} ${theme.accentText}`
                            : `${data.theme === 'light' ? 'bg-black/5' : 'bg-white/10'} opacity-60`
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={data.journal[selectedDate]?.text || ''}
                    onChange={(e) => updateJournal(selectedDate, 'text', e.target.value)}
                    placeholder="Write about your day..."
                    className={`w-full h-32 p-4 rounded-xl outline-none resize-none focus:ring-2 mb-4 ${data.theme === 'light' ? 'bg-black/5 focus:ring-black/10' : 'bg-white/10 focus:ring-white/10'}`}
                  />

                  {/* Highlights */}
                  <div>
                    <h5 className="text-[10px] font-bold uppercase opacity-40 mb-2">Highlights (Things I Liked)</h5>
                    <div className="space-y-2">
                      {(data.journal[selectedDate]?.highlights || []).map((highlight, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${theme.accent}`} />
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...(data.journal[selectedDate]?.highlights || [])];
                              newHighlights[idx] = e.target.value;
                              updateJournal(selectedDate, 'highlights', newHighlights);
                            }}
                            className={`w-full bg-transparent outline-none text-sm border-b ${theme.border} pb-1 focus:border-opacity-100`}
                          />
                          <button 
                            onClick={() => {
                              const newHighlights = (data.journal[selectedDate]?.highlights || []).filter((_, i) => i !== idx);
                              updateJournal(selectedDate, 'highlights', newHighlights);
                            }}
                            className="opacity-20 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newHighlights = [...(data.journal[selectedDate]?.highlights || []), ''];
                          updateJournal(selectedDate, 'highlights', newHighlights);
                        }}
                        className={`text-xs font-medium opacity-50 hover:opacity-100 flex items-center gap-1 mt-2`}
                      >
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${theme.accent} ${theme.accentText} rounded-full px-2 py-2 flex items-center gap-2 shadow-xl z-40`}>
        <button 
          onClick={() => setActiveTab('today')}
          aria-label="Today View"
          aria-current={activeTab === 'today' ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'today' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <ListTodo className="w-5 h-5" aria-hidden="true" />
          {activeTab === 'today' && <span className="text-sm font-medium">Today</span>}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          aria-label="History View"
          aria-current={activeTab === 'history' ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'history' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <CalendarIcon className="w-5 h-5" aria-hidden="true" />
          {activeTab === 'history' && <span className="text-sm font-medium">History</span>}
        </button>
        <button 
          onClick={() => setActiveTab('goals')}
          aria-label="Goals View"
          aria-current={activeTab === 'goals' ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'goals' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <Target className="w-5 h-5" aria-hidden="true" />
          {activeTab === 'goals' && <span className="text-sm font-medium">Goals</span>}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          aria-label="Settings View"
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'settings' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
          {activeTab === 'settings' && <span className="text-sm font-medium">Settings</span>}
        </button>
      </nav>

      {/* Completion Toast */}
      <AnimatePresence>
        {progress === 100 && activeTab === 'today' && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-0 right-0 px-6 z-30 pointer-events-none"
          >
            <div className={`max-w-md mx-auto p-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 ${theme.accent} ${theme.accentText}`}>
              <Star className="w-6 h-6 fill-current" />
              <p className="font-bold tracking-tight">Perfect Day Unlocked!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
