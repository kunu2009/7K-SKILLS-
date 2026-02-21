import { useState, useEffect, ElementType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Droplets, Dumbbell, BookOpen, Brain, Smile, Gamepad2, 
  CheckCircle2, Circle, Sunrise, Flame, Star, Zap, Footprints,
  Calendar as CalendarIcon, ListTodo, Bell, Trophy
} from 'lucide-react';

const ICONS: Record<string, ElementType> = {
  Sunrise, Sun, Smile, Droplets, Brain, Dumbbell, BookOpen, Gamepad2,
  Flame, Star, Zap, Footprints, Trophy
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
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('7k-skills-v2');
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
      lastDate: today
    };
  });

  const [activeTab, setActiveTab] = useState<'today' | 'progress'>('today');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('7k-skills-v2', JSON.stringify(data));
  }, [data]);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Reminder Check
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      data.stacks.forEach(stack => {
        stack.habits.forEach(habit => {
          if (!habit.completed && habit.time === currentTime) {
            const notifiedKey = `notified-${getTodayStr()}-${habit.id}`;
            if (!localStorage.getItem(notifiedKey)) {
              new Notification("7K Skills", {
                body: `Time for: ${habit.title}`,
              });
              localStorage.setItem(notifiedKey, 'true');
            }
          }
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [data.stacks]);

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
        <div 
          key={dateStr} 
          className={`aspect-square rounded-md ${intensityClass} transition-all`}
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
          </div>
          <div className="flex items-center gap-4">
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
      <main className="max-w-md mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <motion.div 
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              {data.stacks.map((stack) => (
                <section key={stack.id} className="relative">
                  <div className="flex items-center gap-4 mb-5">
                    <h2 className="text-lg font-semibold tracking-tight">{stack.title}</h2>
                    <div className="flex-1 h-px bg-black/10"></div>
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
                              <div className="flex items-center gap-2 mt-2">
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
            </motion.div>
          ) : (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {renderCalendar()}

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
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white rounded-full px-2 py-2 flex items-center gap-2 shadow-xl z-50">
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
      </nav>

      {/* Completion Toast */}
      <AnimatePresence>
        {progress === 100 && activeTab === 'today' && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-0 right-0 px-6 z-40 pointer-events-none"
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
