"use client";

import { TaskStatus, useTaskStore, TaskState } from "@/store/task-store";
import { useMemo } from "react";

export interface TaskColumnInfo {
  id: TaskStatus;
  title: string;
  tasks: TaskState["todoTasks"];
  count: number;
}

export function useTaskColumns(): TaskColumnInfo[] {
  const { todoTasks, inProgressTasks, doneTasks, getTaskCount } =
    useTaskStore();

  return useMemo(
    () => [
      {
        id: "todo" as TaskStatus,
        title: "To do",
        tasks: todoTasks,
        count: getTaskCount("todo"),
      },
      {
        id: "inprogress" as TaskStatus,
        title: "In progress",
        tasks: inProgressTasks,
        count: getTaskCount("inprogress"),
      },
      {
        id: "done" as TaskStatus,
        title: "Done",
        tasks: doneTasks,
        count: getTaskCount("done"),
      },
    ],
    [todoTasks, inProgressTasks, doneTasks, getTaskCount]
  );
}
