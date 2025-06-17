"use client";

import { TaskStatus, useTaskStore, TaskState } from "@/store/task-store";
import { useMemo } from "react";

export interface TaskColumnInfo {
  id: TaskStatus;
  title: string;
  tasks: TaskState["todoTasks"];
  count: number;
  isLoading: boolean;
}

export function useTaskColumns(): TaskColumnInfo[] {
  const { todoTasks, inProgressTasks, doneTasks, getTaskCount, isLoading } =
    useTaskStore();

  return useMemo(
    () => [
      {
        id: "todo" as TaskStatus,
        title: "To do",
        tasks: todoTasks,
        count: getTaskCount("todo"),
        isLoading: isLoading.todo,
      },
      {
        id: "inprogress" as TaskStatus,
        title: "In progress",
        tasks: inProgressTasks,
        count: getTaskCount("inprogress"),
        isLoading: isLoading.inprogress,
      },
      {
        id: "done" as TaskStatus,
        title: "Done",
        tasks: doneTasks,
        count: getTaskCount("done"),
        isLoading: isLoading.done,
      },
    ],
    [todoTasks, inProgressTasks, doneTasks, getTaskCount, isLoading]
  );
}
