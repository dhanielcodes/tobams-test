"use client";

import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard, type TaskCardProps } from "./taskCard";
import { TaskCardSkeleton } from "./taskCardSkeleton";
import type { TaskStatus } from "../store/task-store";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: TaskCardProps[];
  showDropZone?: boolean;
  onAddTask?: () => void;
  isLoading?: boolean;
}

export function TaskColumn({
  id,
  title,
  count,
  tasks,
  showDropZone = false,
  onAddTask,
  isLoading = false,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col bg-background rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{title}</h3>
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            {count}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-4 flex-1 min-h-[200px] p-2 rounded-lg transition-colors overflow-y-auto ${
          isOver
            ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700"
            : ""
        }`}
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : tasks?.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} {...task} />)
        ) : (
          showDropZone && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center text-muted-foreground h-full flex items-center justify-center">
              <p>Drag your task here...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
