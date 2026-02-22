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

export type MasteryPath = {
  id: string;
  title: string;
  iconName: string;
  status: 'available' | 'coming_soon';
  description: string;
  levels?: MasteryLevel[];
  dailyPractices?: string[];
  resources?: MasteryResource[];
};

export const MASTERY_PATHS: MasteryPath[] = [
  {
    id: 'chess',
    title: 'Chess Mastery',
    iconName: 'Gamepad2',
    status: 'available',
    description: 'From absolute beginner to advanced tactician. Master the board.',
    levels: [
      {
        level: 1,
        title: 'The Basics',
        description: 'Learn how the pieces move and the rules of the game.',
        tasks: [
          'Learn piece movements (Pawn, Knight, Bishop, Rook, Queen, King)',
          'Understand special moves (Castling, En Passant, Promotion)',
          'Learn the value of pieces (P=1, N=3, B=3, R=5, Q=9)',
          'Play 10 games focusing on not blundering pieces'
        ]
      },
      {
        level: 2,
        title: 'Basic Tactics',
        description: 'Spotting simple patterns to win material.',
        tasks: [
          'Learn Forks (Knight forks, Pawn forks)',
          'Learn Pins (Absolute vs Relative)',
          'Learn Skewers and Discovered Attacks',
          'Solve 50 basic tactical puzzles'
        ]
      },
      {
        level: 3,
        title: 'Opening Principles',
        description: 'How to start the game properly.',
        tasks: [
          'Control the center (e4/d4)',
          'Develop minor pieces (Knights before Bishops)',
          'Castle early for King safety',
          'Learn one basic opening for White (e.g., Italian Game)'
        ]
      },
      {
        level: 4,
        title: 'Endgame Fundamentals',
        description: 'Converting an advantage into a win.',
        tasks: [
          'King and Queen vs King checkmate',
          'King and Rook vs King checkmate',
          'Basic Pawn endgames (The Rule of the Square)',
          'Opposition concept'
        ]
      }
    ],
    dailyPractices: [
      'Solve 5 tactical puzzles',
      'Play 1 Rapid game (10+0 or 15+10)',
      'Analyze 1 lost game to find the critical mistake'
    ],
    resources: [
      {
        title: 'Opening Principles',
        type: 'article',
        content: '1. Control the center with pawns. 2. Develop knights before bishops. 3. Don\'t move the same piece twice in the opening. 4. Castle early. 5. Don\'t bring the queen out too early.'
      },
      {
        title: 'Basic Checkmates',
        type: 'article',
        content: 'Ladder Mate: Use two rooks or a rook and queen to walk the enemy king to the edge of the board. King and Queen Mate: Box the king in, bring your king to help deliver the final blow.'
      }
    ]
  },
  {
    id: 'coding_web',
    title: 'Web Dev (HTML/CSS/JS)',
    iconName: 'Code',
    status: 'available',
    description: 'Build modern, responsive websites from scratch.',
    levels: [
      {
        level: 1,
        title: 'HTML Fundamentals',
        description: 'The skeleton of the web.',
        tasks: [
          'Understand basic tags (div, p, h1-h6, a, img)',
          'Create a basic structured document',
          'Learn about forms and inputs',
          'Build a simple personal bio page (HTML only)'
        ]
      },
      {
        level: 2,
        title: 'CSS Styling',
        description: 'Making things look good.',
        tasks: [
          'Understand selectors, classes, and IDs',
          'Learn the Box Model (margin, border, padding, content)',
          'Flexbox basics (display: flex, justify-content, align-items)',
          'Style your personal bio page'
        ]
      },
      {
        level: 3,
        title: 'JavaScript Basics',
        description: 'Adding interactivity.',
        tasks: [
          'Variables (let, const) and Data Types',
          'Functions and Arrow Functions',
          'DOM Manipulation (document.querySelector)',
          'Add a dark mode toggle to your bio page'
        ]
      },
      {
        level: 4,
        title: 'Advanced Frontend',
        description: 'Modern web development.',
        tasks: [
          'Learn Promises and Fetch API',
          'Fetch data from a public API (e.g., weather or quotes)',
          'Learn basic React concepts (Components, State, Props)',
          'Build a simple To-Do list app in React'
        ]
      }
    ],
    dailyPractices: [
      'Write code for at least 30 minutes',
      'Read one technical article or documentation page',
      'Review and refactor an old piece of code'
    ],
    resources: [
      {
        title: 'HTML/CSS Cheatsheet',
        type: 'article',
        content: 'Flexbox: display: flex; justify-content: center; align-items: center; Grid: display: grid; grid-template-columns: repeat(3, 1fr);'
      },
      {
        title: 'JS Array Methods',
        type: 'article',
        content: '.map() transforms elements. .filter() keeps matching elements. .reduce() accumulates a value. .forEach() iterates without returning.'
      }
    ]
  },
  {
    id: 'flute',
    title: 'Flute',
    iconName: 'Music',
    status: 'coming_soon',
    description: 'Learn to play the flute beautifully.'
  },
  {
    id: 'rubiks_cube',
    title: "Rubik's Cube",
    iconName: 'Box',
    status: 'coming_soon',
    description: 'Solve the cube in under 60 seconds.'
  },
  {
    id: 'guitar',
    title: 'Guitar',
    iconName: 'Music',
    status: 'coming_soon',
    description: 'Master chords, scales, and your favorite songs.'
  },
  {
    id: 'coding_kotlin',
    title: 'Kotlin Native Apps',
    iconName: 'Smartphone',
    status: 'coming_soon',
    description: 'Build native Android apps with Kotlin.'
  },
  {
    id: 'coding_launcher',
    title: 'Android Launcher',
    iconName: 'Layout',
    status: 'coming_soon',
    description: 'Create your own custom Android launcher.'
  },
  {
    id: 'ai_ml',
    title: 'AI & Machine Learning',
    iconName: 'Brain',
    status: 'coming_soon',
    description: 'Dive into neural networks and AI models.'
  },
  {
    id: 'content_creation',
    title: 'Insta/YT Content',
    iconName: 'Video',
    status: 'coming_soon',
    description: 'Master algorithms, editing, and audience growth.'
  }
];
