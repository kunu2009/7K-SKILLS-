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
  },
  {
    id: 'navy_seal_pushup',
    name: 'Navy Seal Push-Up',
    category: 'Upper Body',
    target: 'Chest, Shoulders, Triceps, Core',
    howTo: [
      'Start in a standard push-up position.',
      'Lower your body until your chest touches the floor.',
      'Push back up, then bring one knee to the same side elbow (Spider-Man style).',
      'Return the leg, do another push-up, and bring the other knee to the elbow.'
    ],
    dos: ['Keep core tight', 'Full range of motion', 'Control the knee drive'],
    donts: ["Don't let hips sag", "Don't rush the movement"]
  },
  {
    id: 'handstand_wall',
    name: 'Wall Handstand Hold',
    category: 'Calisthenics',
    target: 'Shoulders, Core, Balance',
    howTo: [
      'Place your hands on the floor about a foot away from a wall.',
      'Kick your legs up so your heels rest against the wall.',
      'Push the floor away actively, locking your elbows.',
      'Hold the position, keeping your body as straight as possible.'
    ],
    dos: ['Push tall through shoulders', 'Squeeze glutes and core', 'Look between your hands'],
    donts: ["Don't bend your elbows", "Don't arch your lower back excessively"]
  },
  {
    id: 'wrist_curls_towel',
    name: 'Towel Wrist Curls',
    category: 'Upper Body',
    target: 'Forearms (Veiny & Bigger)',
    howTo: [
      'Roll up a thick towel tightly.',
      'Grip the towel with both hands in front of you.',
      'Twist the towel in opposite directions as hard as you can (like wringing out water).',
      'Hold the maximum tension for a few seconds, then reverse the twist.'
    ],
    dos: ['Squeeze as hard as possible', 'Keep elbows slightly bent', 'Focus on the forearm contraction'],
    donts: ["Don't use your shoulders to twist", "Don't hold your breath"]
  },
  {
    id: 'fingertip_pushup',
    name: 'Fingertip Push-Up Hold',
    category: 'Upper Body',
    target: 'Forearms, Finger Strength',
    howTo: [
      'Get into a push-up position but support your weight entirely on your fingertips.',
      'Keep your fingers spread wide and slightly arched.',
      'Hold this top position for time. If too hard, do it on your knees.'
    ],
    dos: ['Keep fingers slightly bent (spider grip)', 'Engage core'],
    donts: ["Don't let your fingers collapse flat", "Don't drop your hips"]
  },
  {
    id: 'side_plank_dips',
    name: 'Side Plank Dips',
    category: 'Core',
    target: 'Obliques',
    howTo: [
      'Get into a side plank position on your forearm.',
      'Lower your hips towards the floor until they almost touch.',
      'Push your hips back up as high as you can, squeezing your obliques.',
      'Repeat for reps, then switch sides.'
    ],
    dos: ['Keep your body in a straight line', 'Squeeze obliques at the top'],
    donts: ["Don't let your chest rotate towards the floor", "Don't use momentum"]
  },
  {
    id: 'russian_twists',
    name: 'Russian Twists',
    category: 'Core',
    target: 'Obliques, Core',
    howTo: [
      'Sit on the floor with your knees bent and feet lifted slightly off the ground.',
      'Lean back slightly to engage your core.',
      'Clasp your hands together and twist your torso to the right, touching the floor.',
      'Twist to the left and touch the floor. Repeat.'
    ],
    dos: ['Twist your shoulders, not just your arms', 'Keep your core braced'],
    donts: ["Don't round your lower back", "Don't swing wildly"]
  },
  {
    id: 'cheek_lifter',
    name: 'Cheek Lifter',
    category: 'Face',
    target: 'Cheek Muscles (Higher Cheekbones)',
    howTo: [
      'Open your mouth to form an "O" shape, hiding your teeth with your lips.',
      'Smile widely while keeping your teeth hidden.',
      'Place your index fingers lightly on your cheek muscles.',
      'Relax and repeat the smile, feeling the muscles lift under your fingers.'
    ],
    dos: ['Focus on the muscle contraction', 'Keep forehead relaxed'],
    donts: ["Don't squint your eyes", "Don't create wrinkles around your mouth"]
  }
];
