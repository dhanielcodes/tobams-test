"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Calendar,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  CheckSquare,
} from "lucide-react";
import { TaskCard } from "@/components/task-card";
import { TaskColumn } from "@/components/task-column";
import {
  Sidebar,
  type SidebarSection,
  type SidebarItem,
} from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { useTaskStore, type TaskStatus } from "@/store/task-store";
import { useTaskColumns } from "@/hooks/use-task-columns";

export default function Component() {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Zustand store
  const { moveTask, getTaskById, addTask, getTaskCount } = useTaskStore();

  // Get task columns data from the custom hook
  const taskColumns = useTaskColumns();

  // Helper function to determine task status from column ID
  const getTaskStatus = (taskId: string): TaskStatus | null => {
    const task = getTaskById(taskId);
    if (!task) return null;

    // Find which column contains this task
    for (const column of taskColumns) {
      if (column.tasks.some((t) => t.id === taskId)) {
        return column.id;
      }
    }
    return null;
  };

  // Helper function to map column ID to TaskStatus
  const mapColumnIdToStatus = (columnId: string): TaskStatus | null => {
    switch (columnId) {
      case "todo":
        return "todo";
      case "inprogress":
        return "inprogress";
      case "done":
        return "done";
      default:
        return null;
    }
  };

  // Update sidebar sections with dynamic task counts
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([
    {
      title: "Projects",
      hasAddButton: true,
      items: [
        {
          label: "Team",
          hasChildren: false,
        },
        {
          label: "Projects",
          hasChildren: true,
          isExpanded: true,
          children: [
            { label: "All projects", count: 3 },
            { label: "Design system" },
            { label: "User flow" },
            { label: "Ux research" },
          ],
        },
      ],
    },
    {
      title: "Tasks",
      items: [
        {
          label: "Tasks",
          hasChildren: true,
          isExpanded: true,
          isActive: true,
          children: [
            {
              label: "All tasks",
              count:
                getTaskCount("todo") +
                getTaskCount("inprogress") +
                getTaskCount("done"),
            },
            { label: "To do", count: getTaskCount("todo") },
            { label: "In progress", count: getTaskCount("inprogress") },
            { label: "Done", count: getTaskCount("done") },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          label: "Reminders",
          hasChildren: false,
        },
        {
          label: "Messengers",
          hasChildren: false,
        },
      ],
    },
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetColumnId = over.id as string;

    // Get current task status
    const currentStatus = getTaskStatus(taskId);
    const targetStatus = mapColumnIdToStatus(targetColumnId);

    if (!currentStatus || !targetStatus) return;

    // If moving to the same column, do nothing
    if (currentStatus === targetStatus) return;

    // Use Zustand to move the task
    moveTask(taskId, currentStatus, targetStatus);
  };

  // Sidebar event handlers
  const handleSidebarItemClick = (
    item: SidebarItem,
    sectionIndex: number,
    itemIndex: number
  ) => {
    console.log("Sidebar item clicked:", item, sectionIndex, itemIndex);
    // Handle navigation or filtering based on the clicked item
  };

  const handleSidebarAddClick = (sectionIndex: number) => {
    console.log("Add button clicked for section:", sectionIndex);
    // Handle adding new items to the section
  };

  const handleSidebarToggleSection = (sectionIndex: number) => {
    setSidebarSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleSidebarToggleItem = (sectionIndex: number, itemIndex: number) => {
    setSidebarSections((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, iIndex) =>
                iIndex === itemIndex
                  ? { ...item, isExpanded: !item.isExpanded }
                  : item
              ),
            }
          : section
      )
    );
  };

  const handleAddTask = (status: TaskStatus) => {
    // Generate a new task ID
    const newTaskId = `task-${Date.now()}`;

    // Create a new task with default values
    const newTask = {
      id: newTaskId,
      title: "New Task",
      description: "Task description",
      progress: 0,
      progressText: "0/10",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      comments: 0,
      attachments: 0,
      avatars: [],
      color: "orange" as const,
    };

    // Add the task using Zustand
    addTask(newTask, status);
  };

  // Find the active task for the drag overlay
  const activeTask = activeId ? getTaskById(activeId) : null;

  return (
    <ThemeProvider>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <Sidebar
            sections={sidebarSections}
            onItemClick={handleSidebarItemClick}
            onAddClick={handleSidebarAddClick}
            onToggleSection={handleSidebarToggleSection}
            onToggleItem={handleSidebarToggleItem}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden overflow-y-scroll">
            {/* Header */}
            <div className="bg-background border-b border-border px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">
                  Welcome back, Vincent 👋
                </h1>
                <div className="flex items-center gap-4">
                  <Search className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                  <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">19 May 2022</span>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Board Header */}
            <div className="bg-background border-b border-border px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    <span className="font-medium">Board view</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add view
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    New template
                  </Button>
                </div>
              </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 p-8 bg-muted/30">
              <div className="grid grid-cols-3 gap-6 h-full">
                {taskColumns.map((column) => (
                  <TaskColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    count={column.count}
                    tasks={column.tasks}
                    showDropZone={
                      column.id === "done" && column.tasks.length === 0
                    }
                    onAddTask={() => handleAddTask(column.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <TaskCard {...activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ThemeProvider>
  );
}
