import { useState, useEffect, ElementType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Droplets, Dumbbell, BookOpen, Brain, Smile, Gamepad2, 
  CheckCircle2, Circle, Sunrise, Flame, Star, Zap, Footprints,
  Calendar as CalendarIcon, ListTodo, Bell, Trophy, Plus, Moon,
  Clock, X, Timer, Download, ChevronRight
} from 'lucide-react';

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
  { id: 'streak_3', title: '3 Day Streak', description: 'Maintain a 3-day streak', iconName: 'Flame' },
  { id: 'streak_7', title: '7 Day Streak', description: 'Maintain a 7-day streak', iconName: 'Zap' },
];

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

type AppData = {
  stacks: Stack[];
  history: Record<string, string[]>; // date -> array of completed habit ids
  points: number;
  badges: string[];
  lastDate: string;
  sleepTime: string; // "22:00"
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('7k-skills-v3');
    const today = getTodayStr();
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        if (parsed.lastDate !== today) {
          // New day reset
          return {
            ...parsed,
            stacks: parsed.stacks.map(s => ({
              ...s,
              habits: s.habits.map(h => ({ ...h, completed: false }))
            })),
            lastDate: today
          };
        }
        // Ensure sleepTime exists for older versions
        if (!parsed.sleepTime) parsed.sleepTime = "22:00";
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    
    return {
      stacks: INITIAL_STACKS,
      history: {},
      points: 0,
      badges: [],
      lastDate: today,
      sleepTime: "22:00"
    };
  });

  const [activeTab, setActiveTab] = useState<'today' | 'progress' | 'focus'>('today');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  
  // New Habit State
  const [addingToStack, setAddingToStack] = useState<string | null>(null);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('12:00');
  const [newHabitIcon, setNewHabitIcon] = useState('Circle');

  // Sleep Countdown State
  const [timeLeftToSleep, setTimeLeftToSleep] = useState<string>('');

  // PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Selected Date for History View
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('7k-skills-v3', JSON.stringify(data));
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
      }

      // Sleep Countdown Calculation
      const [sleepH, sleepM] = data.sleepTime.split(':').map(Number);
      const sleepDate = new Date();
      sleepDate.setHours(sleepH, sleepM, 0, 0);
      
      if (now > sleepDate) {
        // If passed sleep time, count down to tomorrow's sleep time
        sleepDate.setDate(sleepDate.getDate() + 1);
      }
      
      const diff = sleepDate.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeftToSleep(`${hoursLeft}h ${minutesLeft}m`);

    }, 1000); // Check every second for smoother countdown

    return () => clearInterval(interval);
  }, [data.stacks, data.sleepTime, data.lastDate]);

  const calculateStreak = (history: Record<string, string[]>) => {
    let streak = 0;
    let d = new Date();
    
    // Check if today has any completions, if not, start checking from yesterday
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
      const today = getTodayStr();
      let newPoints = prev.points;
      const newBadges = new Set(prev.badges);
      
      const newStacks = prev.stacks.map(stack => {
        if (stack.id !== stackId) return stack;
        return {
          ...stack,
          habits: stack.habits.map(habit => {
            if (habit.id !== habitId) return habit;
            
            const isCompleting = !habit.completed;
            if (isCompleting) {
              newPoints += 10;
              newBadges.add('first_step');
            } else {
              newPoints = Math.max(0, newPoints - 10);
            }
            
            return { ...habit, completed: isCompleting };
          })
        };
      });

      // Update history
      const completedToday = newStacks.flatMap(s => s.habits).filter(h => h.completed).map(h => h.id);
      const newHistory = { ...prev.history, [today]: completedToday };

      // Check perfect day
      const totalHabits = newStacks.reduce((acc, s) => acc + s.habits.length, 0);
      if (completedToday.length === totalHabits && totalHabits > 0) {
        newBadges.add('perfect_day');
        newPoints += 50; // Bonus
      }

      // Check streaks
      const currentStreak = calculateStreak(newHistory);
      if (currentStreak >= 3) newBadges.add('streak_3');
      if (currentStreak >= 7) newBadges.add('streak_7');

      return {
        ...prev,
        stacks: newStacks,
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
      completed: false
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
  };

  const totalHabits = data.stacks.reduce((acc, stack) => acc + stack.habits.length, 0);
  const completedHabits = data.stacks.reduce((acc, stack) => acc + stack.habits.filter(h => h.completed).length, 0);
  const progress = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const currentStreak = calculateStreak(data.history);

  const renderCalendar = () => {
    const days = [];
    const today = new Date();
    
    // Day labels
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
      <div key={`label-${i}`} className="text-center text-[10px] font-bold text-black/30 mb-1">
        {day}
      </div>
    ));

    // Calculate start date to align with Sunday
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 27);
    const startDayOfWeek = startDay.getDay();
    
    // Add empty slots for alignment
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const completedCount = data.history[dateStr]?.length || 0;
      let intensityClass = "bg-black/5";
      if (completedCount > 0) intensityClass = "bg-black/20";
      if (completedCount > 3) intensityClass = "bg-black/40";
      if (completedCount > 6) intensityClass = "bg-black/70";
      if (completedCount >= totalHabits && totalHabits > 0) intensityClass = "bg-black";

      days.push(
        <button 
          key={dateStr} 
          onClick={() => setSelectedDate(dateStr)}
          className={`aspect-square rounded-md ${intensityClass} transition-all hover:ring-2 hover:ring-black/20 focus:outline-none focus:ring-2 focus:ring-black`}
          title={`${dateStr}: ${completedCount} completed`}
        />
      );
    }

    return (
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-black/50 mb-4">Activity (Last 28 Days)</h3>
        <div className="grid grid-cols-7 gap-x-2 gap-y-1">
          {dayLabels}
          {days}
        </div>
      </div>
    );
  };

  const renderSkillProgress = () => {
    // Calculate completion rate for each skill over the last 28 days
    const today = new Date();
    const last28Days: string[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last28Days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    }

    const allHabits = data.stacks.flatMap(s => s.habits);
    
    return (
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-black/50 mb-4">Skill Consistency</h3>
        <div className="space-y-4">
          {allHabits.map(habit => {
            let completedDays = 0;
            last28Days.forEach(dateStr => {
              if (data.history[dateStr]?.includes(habit.id)) {
                completedDays++;
              }
            });
            const percentage = Math.round((completedDays / 28) * 100);
            const Icon = ICONS[habit.iconName] || Circle;

            return (
              <div key={habit.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-black/40" />
                    <span className="font-medium">{habit.title}</span>
                  </div>
                  <span className="text-black/50 font-semibold text-xs">{percentage}%</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans pb-24 selection:bg-black selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#f5f5f5]/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">7K Skills</h1>
            <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {installPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/80 transition-colors"
              >
                <Download className="w-3 h-3" />
                Install
              </button>
            )}
            <div className="flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full">
              <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-500' : 'text-black/30'}`} />
              <span className="font-semibold text-sm">{currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-sm">{data.points}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {activeTab === 'today' && (
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-xs font-medium text-black/50 mb-1.5 uppercase tracking-wider">
              <span>Daily Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black"
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
              <div className="bg-black text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Sleep Countdown</div>
                  <div className="text-3xl font-light tracking-tighter">{timeLeftToSleep}</div>
                </div>
                <Moon className="w-8 h-8 text-white/20" />
              </div>

              {data.stacks.map((stack) => (
                <section key={stack.id} className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4 flex-1">
                      <h2 className="text-lg font-semibold tracking-tight">{stack.title}</h2>
                      <div className="flex-1 h-px bg-black/10"></div>
                    </div>
                    <button 
                      onClick={() => setAddingToStack(stack.id)}
                      className="ml-4 p-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-black/60" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {stack.habits.map((habit) => {
                      const Icon = ICONS[habit.iconName] || Circle;
                      const isEditing = editingHabit === habit.id;

                      return (
                        <motion.div
                          key={habit.id}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                            ${habit.completed 
                              ? 'bg-black/5 border-transparent opacity-60' 
                              : 'bg-white border-black/10 shadow-sm hover:border-black/30'
                            }
                          `}
                          layout
                        >
                          <button 
                            onClick={() => toggleHabit(stack.id, habit.id)}
                            className={`shrink-0 transition-colors duration-300 ${habit.completed ? 'text-black/50' : 'text-black'}`}
                          >
                            {habit.completed ? (
                              <CheckCircle2 className="w-7 h-7" />
                            ) : (
                              <Circle className="w-7 h-7" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0 flex flex-col items-start">
                            <button 
                              onClick={() => toggleHabit(stack.id, habit.id)}
                              className={`font-medium text-left truncate transition-all duration-300 ${habit.completed ? 'line-through text-black/50' : 'text-black'}`}
                            >
                              {habit.title}
                            </button>
                            
                            {isEditing ? (
                              <div className="flex items-center gap-2 mt-2 w-full">
                                <input 
                                  type="time" 
                                  defaultValue={habit.time}
                                  className="text-xs font-medium bg-black/5 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-black"
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
                                className="flex items-center gap-1.5 mt-1 text-black/40 hover:text-black transition-colors"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wider">{formatTimeDisplay(habit.time)}</span>
                              </button>
                            )}
                          </div>
                          
                          <div className="shrink-0 text-black/20">
                            <Icon className="w-5 h-5" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* 7K Ecosystem Branding */}
              <div className="pt-12 pb-6 text-center space-y-6 border-t border-black/5 mt-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-2">Made by</p>
                  <h3 className="text-lg font-bold tracking-tight">7K Ecosystem</h3>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kunal (Founder)</p>
                  <div className="flex justify-center gap-4 text-xs text-black/50">
                    <a href="https://7kc.me" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Portfolio</a>
                    <span>•</span>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a>
                    <span>•</span>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a>
                  </div>
                  <a href="mailto:kunal@7kc.me" className="text-xs text-black/40 hover:text-black transition-colors block mt-1">kunal@7kc.me</a>
                </div>

                <p className="text-[10px] text-black/30 uppercase tracking-widest">© 2025 7K Ecosystem. All rights reserved.</p>
              </div>
            </motion.div>
          ) : activeTab === 'progress' ? (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {renderCalendar()}
              {renderSkillProgress()}

              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-black/50 mb-4">Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {BADGES.map(badge => {
                    const unlocked = data.badges.includes(badge.id);
                    const Icon = ICONS[badge.iconName] || Trophy;
                    return (
                      <div 
                        key={badge.id} 
                        className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all
                          ${unlocked ? 'bg-black text-white border-black' : 'bg-black/5 border-transparent text-black/40 opacity-60'}
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
          ) : (
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-black/50 mb-6">Sleep Schedule</h3>
                <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-black/60" />
                    <span className="font-medium">Sleep Time</span>
                  </div>
                  <input 
                    type="time" 
                    value={data.sleepTime}
                    onChange={(e) => setData(prev => ({ ...prev, sleepTime: e.target.value }))}
                    className="bg-transparent font-mono text-lg outline-none cursor-pointer hover:bg-black/5 rounded px-2 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm text-center py-12">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-black/40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mindful Moment</h3>
                <p className="text-black/60 text-sm max-w-[200px] mx-auto">
                  Take a deep breath. Focus on the present. You are doing enough.
                </p>
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
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Add New Habit</h3>
                <button onClick={() => setAddingToStack(null)} className="p-2 hover:bg-black/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-black/40 mb-1 block">Title</label>
                  <input 
                    type="text" 
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="e.g. Meditate"
                    className="w-full p-3 bg-black/5 rounded-xl outline-none focus:ring-2 focus:ring-black/10"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase text-black/40 mb-1 block">Time</label>
                  <input 
                    type="time" 
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    className="w-full p-3 bg-black/5 rounded-xl outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-black/40 mb-2 block">Icon</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {Object.keys(ICONS).slice(0, 8).map(iconName => {
                      const Icon = ICONS[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => setNewHabitIcon(iconName)}
                          className={`p-3 rounded-xl shrink-0 transition-all ${newHabitIcon === iconName ? 'bg-black text-white' : 'bg-black/5 text-black/60'}`}
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
                  className="w-full bg-black text-white py-4 rounded-xl font-medium mt-4 disabled:opacity-50"
                >
                  Add Habit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">
                  {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-black/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {data.history[selectedDate]?.length ? (
                  data.stacks.flatMap(s => s.habits).filter(h => data.history[selectedDate].includes(h.id)).map(habit => {
                    const Icon = ICONS[habit.iconName] || Circle;
                    return (
                      <div key={habit.id} className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                        <Icon className="w-5 h-5 text-black/60" />
                        <span className="font-medium">{habit.title}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-black/40 py-4">No habits completed this day.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white rounded-full px-2 py-2 flex items-center gap-2 shadow-xl z-40">
        <button 
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'today' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <ListTodo className="w-5 h-5" />
          {activeTab === 'today' && <span className="text-sm font-medium">Today</span>}
        </button>
        <button 
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'progress' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <CalendarIcon className="w-5 h-5" />
          {activeTab === 'progress' && <span className="text-sm font-medium">Progress</span>}
        </button>
        <button 
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === 'focus' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <Timer className="w-5 h-5" />
          {activeTab === 'focus' && <span className="text-sm font-medium">Focus</span>}
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
            <div className="max-w-md mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3">
              <Star className="w-6 h-6 fill-black" />
              <p className="font-bold tracking-tight">Perfect Day Unlocked!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
