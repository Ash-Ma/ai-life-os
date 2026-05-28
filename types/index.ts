export type Priority = "low" | "medium" | "high";

export type RiskLevel = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  priority: Priority;
};

export type DailyCheckIn = {
  date: string;
  energyLevel: number;
  stressLevel: number;
  sleepHours?: number;
};

export type Availability = {
  date: string;
  availableHours: number;
};

export type TaskRisk = {
  taskId: string;
  score: number;
  level: RiskLevel;
  remainingHours: number;
  daysUntilDeadline: number;
};