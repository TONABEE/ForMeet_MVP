/**
 * タスク管理のカスタムフック
 */

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

// モックデータ
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'メール返信',
    description: '顧客からの問い合わせに回答',
    status: 'pending',
    priority: 'high',
    type: 'work',
    scheduledStart: new Date(2025, 10, 8, 9, 0),
    scheduledEnd: new Date(2025, 10, 8, 9, 30),
    estimatedDuration: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '企画書作成',
    description: 'Chapter2の図版差し替え',
    status: 'pending',
    priority: 'high',
    type: 'work',
    scheduledStart: new Date(2025, 10, 8, 10, 0),
    scheduledEnd: new Date(2025, 10, 8, 12, 0),
    estimatedDuration: 120,
    firstStep: '前回レビューで指摘された章を開いて、修正メモを確認しましょう',
    notes: ['Chapter2の図版差し替え', 'メイントーンを青に統一'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'ランチ',
    status: 'pending',
    priority: 'medium',
    type: 'routine',
    scheduledStart: new Date(2025, 10, 8, 12, 0),
    scheduledEnd: new Date(2025, 10, 8, 13, 0),
    estimatedDuration: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: '移動',
    status: 'pending',
    priority: 'medium',
    type: 'travel',
    scheduledStart: new Date(2025, 10, 8, 13, 30),
    scheduledEnd: new Date(2025, 10, 8, 14, 0),
    estimatedDuration: 30,
    location: 'オフィス',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: '会議',
    description: 'プロジェクト進捗報告',
    status: 'pending',
    priority: 'high',
    type: 'meeting',
    scheduledStart: new Date(2025, 10, 8, 14, 0),
    scheduledEnd: new Date(2025, 10, 8, 15, 0),
    estimatedDuration: 60,
    location: '会議室A',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [loading, setLoading] = useState(false);

  const todayTasks = tasks.filter((task) => {
    if (!task.scheduledStart) return false;
    const today = new Date();
    const taskDate = task.scheduledStart;
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  const unscheduledTasks = tasks.filter((task) => !task.scheduledStart);

  const completedCount = todayTasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, task]);
  };

  return {
    tasks,
    todayTasks,
    unscheduledTasks,
    completedCount,
    loading,
    toggleTaskComplete,
    updateTask,
    addTask,
  };
}
