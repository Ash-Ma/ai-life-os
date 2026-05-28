import type {
  Availability,
  DailyCheckIn,
  Task,
} from "@/types";

export const tasks: Task[] = [
  {
    id: "1",
    title: "ML Assignment",
    dueDate: "2026-06-02",
    estimatedHours: 8,
    completedHours: 2,
    priority: "high",
  },
  {
    id: "2",
    title: "DSA Practice",
    dueDate: "2026-06-06",
    estimatedHours: 5,
    completedHours: 1,
    priority: "medium",
  },
];

export const availability: Availability[] = [
  {
    date: "2026-05-30",
    availableHours: 1,
  },
  {
    date: "2026-05-31",
    availableHours: 2,
  },
  {
    date: "2026-06-01",
    availableHours: 2,
  },
];

export const checkIns: DailyCheckIn[] = [
  {
    date: "2026-05-29",
    energyLevel: 4,
    stressLevel: 7,
    sleepHours: 5,
  },
];