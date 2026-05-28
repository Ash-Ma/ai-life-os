import type { Availability, DailyCheckIn, RiskLevel, Task, TaskRisk } from "@/types";

function getRiskLevel(score: number): RiskLevel {
  if (score >= 9) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function getPriorityScore(priority: Task["priority"]): number {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

function getDaysUntilDeadline(dueDate: string): number {
  const today = new Date();
  const deadline = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getAvailableHoursBeforeDeadline(
  dueDate: string,
  availability: Availability[]
): number {
  const deadline = new Date(dueDate);
  deadline.setHours(23, 59, 59, 999);

  return availability.reduce((total, item) => {
    const date = new Date(item.date);

    if (date <= deadline) {
      return total + item.availableHours;
    }

    return total;
  }, 0);
}

export function calculateTaskRisk(
  task: Task,
  availability: Availability[]
): TaskRisk {
  const remainingHours = Math.max(
    task.estimatedHours - task.completedHours,
    0
  );

  const daysUntilDeadline = getDaysUntilDeadline(task.dueDate);
  const availableHours = getAvailableHoursBeforeDeadline(
    task.dueDate,
    availability
  );

  const capacityGap = remainingHours - availableHours;
  const urgencyScore = Math.max(0, 10 - daysUntilDeadline);
  const priorityScore = getPriorityScore(task.priority);

  const score = Math.max(
    0,
    Math.round(urgencyScore + capacityGap + priorityScore)
  );

  return {
    taskId: task.id,
    score,
    level: getRiskLevel(score),
    remainingHours,
    daysUntilDeadline,
  };
}

export function calculateBurnoutRisk(
  checkIns: DailyCheckIn[],
  highRiskTaskCount: number
): {
  score: number;
  level: RiskLevel;
} {
  if (checkIns.length === 0) {
    return {
      score: 0,
      level: "Low",
    };
  }

  const avgStress =
    checkIns.reduce((sum, item) => sum + item.stressLevel, 0) /
    checkIns.length;

  const avgEnergy =
    checkIns.reduce((sum, item) => sum + item.energyLevel, 0) /
    checkIns.length;

  const avgSleep =
    checkIns.reduce((sum, item) => sum + (item.sleepHours ?? 7), 0) /
    checkIns.length;

  const sleepPenalty = avgSleep < 6 ? 2 : 0;

  const score = Math.max(
    0,
    Math.round(avgStress + highRiskTaskCount - avgEnergy + sleepPenalty)
  );

  return {
    score,
    level: getRiskLevel(score),
  };
}