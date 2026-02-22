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
  }
];
