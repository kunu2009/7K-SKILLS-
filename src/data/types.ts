export type WorkoutExercise = {
  exerciseId: string;
  targetReps: string;
};

export type WorkoutLogExercise = {
  exerciseId: string;
  targetReps: string;
  actualReps: string;
};

export type WorkoutLog = {
  id: string;
  templateId: string | 'custom';
  title: string;
  date: string;
  completedAt: string;
  exercises: WorkoutLogExercise[];
};
