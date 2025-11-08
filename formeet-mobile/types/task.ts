/**
 * タスク関連の型定義
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'paused';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskType = 'meeting' | 'work' | 'routine' | 'travel';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  location?: string;
  notes?: string[];
  firstStep?: string; // AI推奨の最初の一歩
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export interface DaySchedule {
  date: Date;
  tasks: Task[];
  totalDuration: number;
  completedCount: number;
}
