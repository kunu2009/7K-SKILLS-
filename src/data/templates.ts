import { WorkoutExercise } from './types';

export type WorkoutTemplate = {
  id: string;
  title: string;
  duration: string;
  iconName: string;
  description: string;
  exercises: WorkoutExercise[];
};

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'aesthetic_v_taper',
    title: 'V-Taper & Big Biceps',
    duration: '45 Min',
    iconName: 'Dumbbell',
    description: 'Focuses on lats for width and biceps for size. Perfect for the skinny-fat to aesthetic transition.',
    exercises: [
      { exerciseId: 'pull_up', targetReps: '3 sets of 8-12 reps' },
      { exerciseId: 'chin_up', targetReps: '3 sets of 8-12 reps' },
      { exerciseId: 'pike_push_up', targetReps: '3 sets of 10-15 reps' },
      { exerciseId: 'hollow_body', targetReps: '3 sets of 45 secs' }
    ]
  },
  {
    id: 'calisthenics_skills',
    title: 'Cool Calisthenics Skills',
    duration: '30 Min',
    iconName: 'Zap',
    description: 'Progressions for gravity-defying moves like the Planche, L-Sit, and Dragon Flag.',
    exercises: [
      { exerciseId: 'planche_lean', targetReps: '4 sets of 15-20 secs' },
      { exerciseId: 'l_sit', targetReps: '4 sets of 10-15 secs' },
      { exerciseId: 'dragon_flag', targetReps: '3 sets of 5-8 reps (or negatives)' }
    ]
  },
  {
    id: 'face_neck_aesthetics',
    title: 'Sharper Face & Thick Neck',
    duration: '15 Min',
    iconName: 'Smile',
    description: 'Targeted exercises to define the jawline and build a masculine neck.',
    exercises: [
      { exerciseId: 'mewing', targetReps: 'Constant reminder (Hold 5 mins active)' },
      { exerciseId: 'jawline_clench', targetReps: '3 sets of 10 secs hold' },
      { exerciseId: 'neck_curl', targetReps: '3 sets of 20 reps (Light weight)' }
    ]
  },
  {
    id: 'posture_height',
    title: 'Posture & Decompression',
    duration: '10 Min',
    iconName: 'Sunrise',
    description: 'Stretches to fix skinny-fat posture, decompress the spine, and maximize natural height.',
    exercises: [
      { exerciseId: 'dead_hang', targetReps: '3 sets of 60 secs' },
      { exerciseId: 'hollow_body', targetReps: '2 sets of 60 secs' }
    ]
  },
  {
    id: 'navy_seal_core',
    title: 'Navy Seal Core & Chest',
    duration: '20 Min',
    iconName: 'Flame',
    description: 'Intense upper body and core workout inspired by military training.',
    exercises: [
      { exerciseId: 'navy_seal_pushup', targetReps: '4 sets of 10-15 reps' },
      { exerciseId: 'russian_twists', targetReps: '3 sets of 20 reps (each side)' },
      { exerciseId: 'side_plank_dips', targetReps: '3 sets of 15 reps (each side)' }
    ]
  },
  {
    id: 'veiny_forearms',
    title: 'Veiny & Bigger Forearms',
    duration: '15 Min',
    iconName: 'Zap',
    description: 'Targeted forearm and grip strength routine for vascularity.',
    exercises: [
      { exerciseId: 'wrist_curls_towel', targetReps: '4 sets to failure' },
      { exerciseId: 'fingertip_pushup', targetReps: '3 sets of 30 secs hold' },
      { exerciseId: 'dead_hang', targetReps: '3 sets to failure' }
    ]
  },
  {
    id: 'handstand_prep',
    title: 'Handstand Mastery',
    duration: '25 Min',
    iconName: 'Star',
    description: 'Build the shoulder strength and balance required for a freestanding handstand.',
    exercises: [
      { exerciseId: 'pike_push_up', targetReps: '4 sets of 8-12 reps' },
      { exerciseId: 'handstand_wall', targetReps: '4 sets of 30-60 secs hold' },
      { exerciseId: 'hollow_body', targetReps: '3 sets of 45 secs' }
    ]
  },
  {
    id: 'model_face',
    title: 'Model Face Routine',
    duration: '10 Min',
    iconName: 'Smile',
    description: 'Advanced facial exercises for higher cheekbones and a sharper jawline.',
    exercises: [
      { exerciseId: 'mewing', targetReps: 'Constant reminder' },
      { exerciseId: 'jawline_clench', targetReps: '4 sets of 15 secs hold' },
      { exerciseId: 'cheek_lifter', targetReps: '3 sets of 20 reps' }
    ]
  }
];
