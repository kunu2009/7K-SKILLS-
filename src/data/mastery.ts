export type MasteryLevel = {
  level: number;
  title: string;
  description: string;
  tasks: string[];
};

export type MasteryResource = {
  title: string;
  type: 'video' | 'article' | 'tool';
  url?: string;
  content?: string;
};

export type OutputTrackerDef = {
  id: string;
  label: string;
  unit: string;
};

export type MasteryCategory = 
  | 'Mental Dominance'
  | 'Physical Power'
  | 'Technical Empire'
  | 'Creative Weapons'
  | 'Social & Communication';

export type MasteryPath = {
  id: string;
  category: MasteryCategory;
  title: string;
  iconName: string;
  status: 'available' | 'coming_soon';
  description: string;
  identity?: {
    why: string;
    who: string;
  };
  outputTrackers?: OutputTrackerDef[];
  proofLabel?: string;
  levels?: MasteryLevel[];
  dailyPractices?: string[];
  resources?: MasteryResource[];
};

export const MASTERY_PATHS: MasteryPath[] = [
  // --- MENTAL DOMINANCE ---
  {
    id: 'chess',
    category: 'Mental Dominance',
    title: 'Chess Mastery',
    iconName: 'Gamepad2',
    status: 'available',
    description: 'From absolute beginner to advanced tactician. Master the board.',
    identity: {
      why: 'To sharpen the mind, improve calculation, and learn to think multiple steps ahead.',
      who: 'I am becoming a calm, strategic thinker who calculates before acting.'
    },
    outputTrackers: [
      { id: 'puzzles', label: 'Puzzles Solved', unit: 'puzzles' },
      { id: 'games', label: 'Rated Games Played', unit: 'games' },
      { id: 'peak_rating', label: 'Peak Rating', unit: 'elo' }
    ],
    proofLabel: 'Screenshot of Rating Milestone',
    levels: [
      {
        level: 1,
        title: 'Foundation',
        description: 'Opening principles, basic mates, and blunder reduction.',
        tasks: [
          'Learn piece movements and values',
          'Master Opening Principles (Center, Develop, Castle)',
          'Learn basic checkmates (Ladder, K+Q vs K)',
          'Play 10 games with < 2 blunders each'
        ]
      },
      {
        level: 2,
        title: 'Calculation',
        description: '2-move tactics, candidate move method, endgame basics.',
        tasks: [
          'Master Forks, Pins, and Skewers',
          'Apply Candidate Move Method in 5 games',
          'Learn King and Pawn vs King endgame',
          'Solve 50 tactical puzzles'
        ]
      },
      {
        level: 3,
        title: 'Strategy',
        description: 'Pawn structures, weak squares, planning.',
        tasks: [
          'Identify and exploit weak squares in 3 games',
          'Understand basic pawn structures (Isolated, Doubled)',
          'Formulate a mid-game plan in 5 games',
          'Analyze 5 grandmaster games'
        ]
      },
      {
        level: 4,
        title: 'Competitive',
        description: 'Opening repertoire, game analysis journal, tournament play.',
        tasks: [
          'Build a basic opening repertoire (White & Black)',
          'Maintain a game analysis journal for 10 games',
          'Participate in an online tournament',
          'Achieve a 60%+ accuracy rate over 10 games'
        ]
      }
    ],
    dailyPractices: [
      'Solve 5 tactical puzzles',
      'Play 1 Rapid game (10+0 or 15+10)',
      'Analyze 1 lost game to find the critical mistake'
    ]
  },
  {
    id: 'rubiks_cube',
    category: 'Mental Dominance',
    title: "Rubik's Cube",
    iconName: 'Box',
    status: 'coming_soon',
    description: 'Solve the cube in under 60 seconds.'
  },
  {
    id: 'deep_reading',
    category: 'Mental Dominance',
    title: 'Deep Reading',
    iconName: 'BookOpen',
    status: 'coming_soon',
    description: 'Read complex texts with full comprehension and retention.'
  },
  {
    id: 'logic_training',
    category: 'Mental Dominance',
    title: 'Logic Training',
    iconName: 'Brain',
    status: 'coming_soon',
    description: 'Master logical fallacies, mental models, and critical thinking.'
  },
  {
    id: 'focus_meditation',
    category: 'Mental Dominance',
    title: 'Focus & Meditation',
    iconName: 'Sun',
    status: 'coming_soon',
    description: 'Build an unbreakable attention span.'
  },

  // --- PHYSICAL POWER ---
  {
    id: 'full_body_strength',
    category: 'Physical Power',
    title: 'Full Body Strength',
    iconName: 'Dumbbell',
    status: 'available',
    description: 'Build functional strength, muscle mass, and raw power.',
    identity: {
      why: 'To build a resilient, capable, and aesthetic physical vessel.',
      who: 'I am becoming a disciplined athlete who pushes past perceived limits.'
    },
    outputTrackers: [
      { id: 'workouts', label: 'Total Workouts', unit: 'sessions' },
      { id: 'pushups', label: 'Max Pushups', unit: 'reps' },
      { id: 'pullups', label: 'Max Pullups', unit: 'reps' }
    ],
    proofLabel: 'Workout Log / Physique Update',
    levels: [
      {
        level: 1,
        title: 'Foundation',
        description: 'Mastering bodyweight basics and form.',
        tasks: [
          'Perform 20 perfect form pushups',
          'Hold a plank for 60 seconds',
          'Perform 30 bodyweight squats',
          'Complete 10 workouts'
        ]
      },
      {
        level: 2,
        title: 'Hypertrophy',
        description: 'Building muscle mass and increasing volume.',
        tasks: [
          'Perform 10 strict pullups',
          'Perform 50 pushups in one set',
          'Complete a 4-week hypertrophy program',
          'Track protein intake for 14 days'
        ]
      },
      {
        level: 3,
        title: 'Advanced Calisthenics',
        description: 'Unlocking gravity-defying skills.',
        tasks: [
          'Hold an L-sit for 15 seconds',
          'Perform 5 handstand pushups against a wall',
          'Perform 10 pistol squats per leg',
          'Hold a tuck planche for 10 seconds'
        ]
      },
      {
        level: 4,
        title: 'Elite Power',
        description: 'Mastering the body and external loads.',
        tasks: [
          'Perform a muscle-up',
          'Hold a freestanding handstand for 10 seconds',
          'Deadlift 2x bodyweight (or equivalent calisthenics feat)',
          'Complete a 12-week advanced strength cycle'
        ]
      }
    ],
    dailyPractices: [
      '15 minutes of mobility/stretching',
      '1 intense workout session (or active recovery)',
      'Hit daily protein target'
    ]
  },
  {
    id: 'abs_core',
    category: 'Physical Power',
    title: 'Abs & Core',
    iconName: 'Flame',
    status: 'coming_soon',
    description: 'Build a bulletproof core and visible abs.'
  },
  {
    id: 'grip_strength',
    category: 'Physical Power',
    title: 'Grip Strength',
    iconName: 'Zap',
    status: 'coming_soon',
    description: 'Develop crushing grip strength and massive forearms.'
  },
  {
    id: 'flexibility',
    category: 'Physical Power',
    title: 'Flexibility',
    iconName: 'Sunrise',
    status: 'coming_soon',
    description: 'Achieve full splits and total body mobility.'
  },
  {
    id: 'athleticism',
    category: 'Physical Power',
    title: 'Athleticism',
    iconName: 'Target',
    status: 'coming_soon',
    description: 'Improve speed, agility, and vertical jump.'
  },

  // --- TECHNICAL EMPIRE ---
  {
    id: 'coding_web',
    category: 'Technical Empire',
    title: 'Web Dev Coding',
    iconName: 'Code',
    status: 'available',
    description: 'Build modern, responsive websites and web applications from scratch.',
    identity: {
      why: 'To have the power to build any idea into a real, accessible product.',
      who: 'I am becoming a creator who turns logic and code into digital empires.'
    },
    outputTrackers: [
      { id: 'projects', label: 'Projects Built', unit: 'apps' },
      { id: 'hours', label: 'Coding Hours', unit: 'hrs' },
      { id: 'commits', label: 'GitHub Commits', unit: 'commits' }
    ],
    proofLabel: 'Hosted Project Link (Vercel/Netlify)',
    levels: [
      {
        level: 1,
        title: 'Static Builder',
        description: 'HTML page, CSS layout, Responsive design.',
        tasks: [
          'Build a semantic HTML structure',
          'Style a page using CSS Flexbox and Grid',
          'Make a page fully responsive (mobile-first)',
          'Deploy a static portfolio site'
        ]
      },
      {
        level: 2,
        title: 'Interactive',
        description: 'JS DOM manipulation, Forms, Local storage.',
        tasks: [
          'Build a dynamic To-Do list with vanilla JS',
          'Implement form validation',
          'Save and retrieve data using LocalStorage',
          'Build a weather app using a public API'
        ]
      },
      {
        level: 3,
        title: 'App Builder',
        description: 'Full mini project, Deploy on Netlify/Vercel, GitHub repo.',
        tasks: [
          'Learn React fundamentals (Components, State, Props)',
          'Manage complex state (Context or Redux)',
          'Build a multi-page app using React Router',
          'Deploy a React app to Vercel/Netlify'
        ]
      },
      {
        level: 4,
        title: 'System Builder',
        description: 'Authentication, Backend integration, API usage.',
        tasks: [
          'Implement user authentication (Firebase/Supabase)',
          'Build a full-stack app with a database',
          'Create and consume a custom REST or GraphQL API',
          'Launch a complete SaaS MVP'
        ]
      }
    ],
    dailyPractices: [
      'Write code for at least 60 minutes',
      'Push at least 1 meaningful commit to GitHub',
      'Read documentation or a technical article'
    ]
  },
  {
    id: 'coding_kotlin',
    category: 'Technical Empire',
    title: 'Kotlin Native Apps',
    iconName: 'Smartphone',
    status: 'coming_soon',
    description: 'Build native Android apps with Kotlin.',
    levels: [
      { level: 1, title: 'Kotlin Basics', description: 'Syntax, variables, functions.', tasks: [] },
      { level: 2, title: 'Android Lifecycle', description: 'Activities, Fragments, Intents.', tasks: [] },
      { level: 3, title: 'Custom UI', description: 'Views, Layouts, Jetpack Compose.', tasks: [] },
      { level: 4, title: 'Publish Beta', description: 'Play Store deployment.', tasks: [] }
    ]
  },
  {
    id: 'coding_launcher',
    category: 'Technical Empire',
    title: 'Android Launcher',
    iconName: 'Layout',
    status: 'coming_soon',
    description: 'Create your own custom Android launcher.',
    levels: [
      { level: 1, title: 'Launcher Basics', description: 'Intents, Manifest setup.', tasks: [] },
      { level: 2, title: 'App Drawer', description: 'Fetching and displaying installed apps.', tasks: [] },
      { level: 3, title: 'Home Screen', description: 'Widgets, drag and drop.', tasks: [] },
      { level: 4, title: 'Customization', description: 'Themes, icon packs.', tasks: [] }
    ]
  },
  {
    id: 'ai_ml',
    category: 'Technical Empire',
    title: 'AI & ML',
    iconName: 'Brain',
    status: 'coming_soon',
    description: 'Dive into neural networks and AI models.',
    levels: [
      { level: 1, title: 'Python Basics', description: 'Syntax, data structures.', tasks: [] },
      { level: 2, title: 'Data Science', description: 'Numpy, Pandas, Matplotlib.', tasks: [] },
      { level: 3, title: 'Model Training', description: 'Scikit-learn, basic neural nets.', tasks: [] },
      { level: 4, title: 'Deploy ML App', description: 'TensorFlow/PyTorch, API deployment.', tasks: [] }
    ]
  },
  {
    id: 'system_design',
    category: 'Technical Empire',
    title: 'System Design',
    iconName: 'Box',
    status: 'coming_soon',
    description: 'Architect scalable, high-performance systems.'
  },

  // --- CREATIVE WEAPONS ---
  {
    id: 'guitar',
    category: 'Creative Weapons',
    title: 'Guitar',
    iconName: 'Music',
    status: 'coming_soon',
    description: 'Master chords, scales, and your favorite songs.',
    levels: [
      { level: 1, title: 'Chords', description: 'Basic open chords and transitions.', tasks: [] },
      { level: 2, title: 'Strumming', description: 'Rhythm patterns and timing.', tasks: [] },
      { level: 3, title: 'Full Song', description: 'Play a complete song smoothly.', tasks: [] },
      { level: 4, title: 'Performance', description: 'Fingerpicking, solos, and live performance.', tasks: [] }
    ]
  },
  {
    id: 'flute',
    category: 'Creative Weapons',
    title: 'Flute',
    iconName: 'Music',
    status: 'coming_soon',
    description: 'Learn to play the flute beautifully.',
    levels: [
      { level: 1, title: 'Breath Control', description: 'Producing a clear tone.', tasks: [] },
      { level: 2, title: 'Scale Practice', description: 'Major and minor scales.', tasks: [] },
      { level: 3, title: 'Simple Songs', description: 'Playing basic melodies.', tasks: [] },
      { level: 4, title: 'Performance', description: 'Vibrato, advanced techniques, full pieces.', tasks: [] }
    ]
  },
  {
    id: 'content_creation',
    category: 'Creative Weapons',
    title: 'Insta/YT Content',
    iconName: 'Video',
    status: 'coming_soon',
    description: 'Master algorithms, editing, and audience growth.'
  },
  {
    id: 'audio_editing',
    category: 'Creative Weapons',
    title: 'Audio Editing',
    iconName: 'Play',
    status: 'coming_soon',
    description: 'Produce professional podcasts and music tracks.'
  },
  {
    id: 'design_skills',
    category: 'Creative Weapons',
    title: 'Design Skills',
    iconName: 'Palette',
    status: 'coming_soon',
    description: 'Master Figma, UI/UX, and graphic design.'
  },

  // --- SOCIAL & COMMUNICATION ---
  {
    id: 'public_speaking',
    category: 'Social & Communication',
    title: 'Public Speaking',
    iconName: 'Mic',
    status: 'coming_soon',
    description: 'Command a room and speak with absolute confidence.'
  },
  {
    id: 'articulation',
    category: 'Social & Communication',
    title: 'Articulation',
    iconName: 'MessageSquare',
    status: 'coming_soon',
    description: 'Express complex ideas clearly and concisely.'
  },
  {
    id: 'social_intelligence',
    category: 'Social & Communication',
    title: 'Social Intelligence',
    iconName: 'Users',
    status: 'coming_soon',
    description: 'Read the room, build rapport, and network effectively.'
  },
  {
    id: 'debate_skills',
    category: 'Social & Communication',
    title: 'Debate Skills',
    iconName: 'Swords',
    status: 'coming_soon',
    description: 'Deconstruct arguments and defend your positions.'
  },
  {
    id: 'persuasion',
    category: 'Social & Communication',
    title: 'Persuasion',
    iconName: 'TrendingUp',
    status: 'coming_soon',
    description: 'Influence decisions and negotiate successfully.'
  }
];
