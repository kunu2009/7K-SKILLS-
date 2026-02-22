export type ExerciseDef = {
  id: string;
  name: string;
  category: 'Calisthenics' | 'Face' | 'Neck' | 'Core' | 'Stretching' | 'Upper Body' | 'Lower Body';
  target: string;
  howTo: string[];
  dos: string[];
  donts: string[];
};

export const EXERCISE_DB: ExerciseDef[] = [
  {
    id: 'l_sit',
    name: 'L-Sit',
    category: 'Calisthenics',
    target: 'Core, Hip Flexors, Triceps',
    howTo: [
      'Sit on the floor with your legs straight in front of you.',
      'Place your hands on the floor next to your hips.',
      'Push down through your hands, lock your elbows, and depress your shoulders.',
      'Lift your hips and legs off the floor, keeping your legs perfectly straight.',
      'Hold the position.'
    ],
    dos: ['Keep arms locked straight', 'Point your toes', 'Depress shoulders (push them down away from ears)'],
    donts: ["Don't bend your knees", "Don't shrug your shoulders", "Don't hold your breath"]
  },
  {
    id: 'dragon_flag',
    name: 'Dragon Flag',
    category: 'Core',
    target: 'Entire Core, Lats',
    howTo: [
      'Lie on a bench or the floor and grab a sturdy object behind your head.',
      'Engage your core and lift your legs, hips, and lower back off the surface.',
      'Point your body straight up towards the ceiling, resting only on your upper back/shoulders.',
      'Slowly lower your body down in a straight line without bending your hips.',
      'Stop just before touching the ground and repeat.'
    ],
    dos: ['Keep your body in a straight line', 'Squeeze your glutes and core', 'Control the descent (eccentric phase)'],
    donts: ["Don't bend at the hips (piking)", "Don't rely on momentum", "Don't rest your lower back on the ground between reps"]
  },
  {
    id: 'planche_lean',
    name: 'Planche Lean',
    category: 'Calisthenics',
    target: 'Shoulders, Core, Straight Arm Strength',
    howTo: [
      'Start in a push-up position with hands turned slightly outward.',
      'Lock your elbows completely straight.',
      'Protracted your scapula (round your upper back).',
      'Lean forward so your shoulders go past your wrists.',
      'Hold the forward lean position.'
    ],
    dos: ['Keep elbows locked (biceps pointing forward)', 'Protract scapula hard', 'Squeeze glutes and core'],
    donts: ["Don't bend your elbows", "Don't let your lower back sag", "Don't look straight down (look slightly forward)"]
  },
  {
    id: 'pull_up',
    name: 'Pull-Up',
    category: 'Upper Body',
    target: 'Lats, Biceps, Forearms (V-Taper)',
    howTo: [
      'Hang from a bar with an overhand grip, slightly wider than shoulder-width.',
      'Depress your shoulders and engage your core.',
      'Pull yourself up until your chin clears the bar.',
      'Lower yourself back down with control to a dead hang.'
    ],
    dos: ['Full range of motion', 'Control the negative', 'Engage lats first'],
    donts: ["Don't use momentum (kipping)", "Don't do half reps", "Don't shrug shoulders at the top"]
  },
  {
    id: 'chin_up',
    name: 'Chin-Up',
    category: 'Upper Body',
    target: 'Biceps, Lats',
    howTo: [
      'Hang from a bar with an underhand grip, shoulder-width apart.',
      'Pull yourself up until your chin is over the bar.',
      'Squeeze your biceps at the top.',
      'Lower yourself down slowly.'
    ],
    dos: ['Squeeze biceps at the top', 'Keep core tight', 'Full extension at the bottom'],
    donts: ["Don't swing", "Don't cut the range of motion short"]
  },
  {
    id: 'pike_push_up',
    name: 'Pike Push-Up',
    category: 'Upper Body',
    target: 'Shoulders, Triceps',
    howTo: [
      'Start in a downward dog position (hips high in the air, body forming an inverted V).',
      'Lower your head towards the ground, slightly in front of your hands.',
      'Push back up to the starting position.'
    ],
    dos: ['Keep legs straight', 'Look at your toes', 'Elbows tucked in slightly'],
    donts: ["Don't flare elbows out wide", "Don't let hips drop"]
  },
  {
    id: 'neck_curl',
    name: 'Neck Curl',
    category: 'Neck',
    target: 'Front Neck Muscles (Aesthetic Neck)',
    howTo: [
      'Lie flat on your back on a bench or bed with your head hanging off the edge.',
      'Place a light weight plate on your forehead (use a towel for padding).',
      'Slowly lower your head all the way down.',
      'Curl your head up until your chin touches your chest.'
    ],
    dos: ['Start with very light weight', 'Use slow, controlled movements', 'High reps (15-20+)'],
    donts: ["Don't use jerky movements", "Don't use heavy weight", "Don't push through sharp pain"]
  },
  {
    id: 'jawline_clench',
    name: 'Jawline Clench & Hold',
    category: 'Face',
    target: 'Masseter Muscle (Sharper Face)',
    howTo: [
      'Keep your head straight and lips closed.',
      'Clench your teeth together firmly but not painfully.',
      'Hold the clench for 10 seconds.',
      'Release and repeat.'
    ],
    dos: ['Breathe through your nose', 'Keep good posture'],
    donts: ["Don't grind your teeth", "Don't overdo it if you have TMJ issues"]
  },
  {
    id: 'mewing',
    name: 'Mewing (Proper Tongue Posture)',
    category: 'Face',
    target: 'Jawline, Facial Structure',
    howTo: [
      'Close your lips gently.',
      'Place the entire surface of your tongue against the roof of your mouth.',
      'Ensure the back of the tongue is engaged, not just the tip.',
      'Breathe through your nose.',
      'Maintain this posture throughout the day.'
    ],
    dos: ['Make it a subconscious habit', 'Keep teeth lightly touching or slightly apart'],
    donts: ["Don't push against your front teeth", "Don't mouth breathe"]
  },
  {
    id: 'dead_hang',
    name: 'Dead Hang',
    category: 'Stretching',
    target: 'Spine Decompression, Grip Strength (Taller Posture)',
    howTo: [
      'Grab a pull-up bar with an overhand grip.',
      'Let your body hang completely relaxed.',
      'Let your shoulders rise to your ears.',
      'Breathe deeply and hold.'
    ],
    dos: ['Relax your core and spine', 'Breathe deeply into your belly'],
    donts: ["Don't hold your breath", "Don't engage your lats (unless doing active hangs)"]
  },
  {
    id: 'hollow_body',
    name: 'Hollow Body Hold',
    category: 'Core',
    target: 'Deep Core',
    howTo: [
      'Lie on your back with arms extended overhead and legs straight.',
      'Press your lower back firmly into the floor.',
      'Lift your shoulders and legs a few inches off the ground.',
      'Hold the position, keeping your lower back glued to the floor.'
    ],
    dos: ['Keep lower back flat on the floor', 'Point toes', 'Squeeze abs hard'],
    donts: ["Don't let your lower back arch off the floor", "Don't hold your breath"]
  }
];
