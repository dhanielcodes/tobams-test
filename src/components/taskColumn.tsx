"use client";

import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard, type TaskCardProps } from "./taskCard";
import type { TaskStatus } from "../store/task-store";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  count: number;
  tasks: TaskCardProps[];
  showDropZone?: boolean;
  onAddTask?: () => void;
}

export function TaskColumn({
  id,
  title,
  count,
  tasks,
  showDropZone = false,
  onAddTask,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full p-4 rounded-xl border-dashed border-2 border-accent">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-card-foreground">
          {title} ({count})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#888da7]"
          onClick={onAddTask}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new task
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-4 flex-1 min-h-[200px] p-2 rounded-lg transition-colors ${
          isOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}

        {showDropZone && tasks.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-[#888da7]">
            Drag your task here...
          </div>
        )}
      </div>
    </div>
  );
}
