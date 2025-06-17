"use client";

import type React from "react";

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
  MoreHorizontal,
  HardDrive,
  List,
  CalendarDays,
  LayoutGrid,
  Rows2,
} from "lucide-react";
import { TaskCard } from "@/components/taskCard";
import { TaskColumn } from "@/components/taskColumn";
import { NavigationBar } from "@/components/navigationBar";
import {
  Sidebar,
  type SidebarSection,
  type SidebarItem,
} from "@/components/sidebar";
import { ThemeProvider } from "@/components/themeProvider";
import { useTaskStore, type TaskStatus } from "@/store/task-store";
import { useTaskColumns } from "@/hooks/use-task-columns";

type ViewType = "board" | "list" | "calendar" | "timeline";

interface ViewOption {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Component() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("grid");
  const [activeView, setActiveView] = useState<ViewType>("board");
  const [showAddViewOptions, setShowAddViewOptions] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("all-tasks"); // Track active sidebar item

  const { moveTask, getTaskById, addTask, getTaskCount } = useTaskStore();

  const taskColumns = useTaskColumns();

  const viewOptions: ViewOption[] = [
    { id: "board", label: "Board view", icon: Rows2 },
    { id: "list", label: "List view", icon: List },
    { id: "calendar", label: "Calendar view", icon: CalendarDays },
    { id: "timeline", label: "Timeline view", icon: HardDrive },
  ];

  const getTaskStatus = (taskId: string): TaskStatus | null => {
    const task = getTaskById(taskId);
    if (!task) return null;

    for (const column of taskColumns) {
      if (column.tasks.some((t) => t.id === taskId)) {
        return column.id;
      }
    }
    return null;
  };

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

  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([
    {
      title: "Team",
      items: [
        {
          id: "team",
          label: "Team",
          level: 0,
        },
      ],
    },
    {
      title: "Projects",
      hasAddButton: true,
      items: [
        {
          id: "projects",
          label: "Projects",
          isExpandable: true,
          isExpanded: true,
          level: 0,
        },
        {
          id: "all-projects",
          label: "All projects",
          count: 3,
          level: 1,
          parentId: "projects",
        },
        {
          id: "design-system",
          label: "Design system",
          level: 1,
          parentId: "projects",
        },
        {
          id: "user-flow",
          label: "User flow",
          level: 1,
          parentId: "projects",
        },
        {
          id: "ux-research",
          label: "Ux research",
          level: 1,
          parentId: "projects",
        },
      ],
    },
    {
      title: "Tasks",
      items: [
        {
          id: "tasks",
          label: "Tasks",
          isExpandable: true,
          isExpanded: true,
          level: 0,
        },
        {
          id: "all-tasks",
          label: "All tasks",
          count:
            getTaskCount("todo") +
            getTaskCount("inprogress") +
            getTaskCount("done"),
          level: 1,
          parentId: "tasks",
          isActive: true,
        },
        {
          id: "todo-tasks",
          label: "To do",
          count: getTaskCount("todo"),
          level: 1,
          parentId: "tasks",
        },
        {
          id: "inprogress-tasks",
          label: "In progress",
          count: getTaskCount("inprogress"),
          level: 1,
          parentId: "tasks",
        },
        {
          id: "done-tasks",
          label: "Done",
          count: getTaskCount("done"),
          level: 1,
          parentId: "tasks",
        },
      ],
    },
    {
      title: "Reminders",
      items: [
        {
          id: "reminders",
          label: "Reminders",
          level: 0,
        },
      ],
    },
    {
      title: "Messengers",
      items: [
        {
          id: "messengers",
          label: "Messengers",
          level: 0,
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

    const currentStatus = getTaskStatus(taskId);
    const targetStatus = mapColumnIdToStatus(targetColumnId);

    if (!currentStatus || !targetStatus) return;

    if (currentStatus === targetStatus) return;

    moveTask(taskId, currentStatus, targetStatus);
  };

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
    console.log("Navigation item clicked:", item);
  };

  const handleViewChange = (viewType: ViewType) => {
    setActiveView(viewType);
    setShowAddViewOptions(false);
    console.log("View changed to:", viewType);
  };

  const handleAddViewClick = () => {
    setShowAddViewOptions(!showAddViewOptions);
  };

  const handleSidebarItemClick = (
    item: SidebarItem,
    sectionIndex: number,
    itemIndex: number
  ) => {
    if (!item.isExpandable) {
      setActiveSidebarItem(item.id);

      setSidebarSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          items: section.items.map((sectionItem) => ({
            ...sectionItem,
            isActive: sectionItem.id === item.id,
          })),
        }))
      );
    }

    console.log("Sidebar item clicked:", item, sectionIndex, itemIndex);
  };

  const handleSidebarAddClick = (sectionIndex: number) => {
    console.log("Add button clicked for section:", sectionIndex);
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
      prevSections.map((section, sIndex) => {
        if (sIndex !== sectionIndex) return section;

        return {
          ...section,
          items: section.items.map((item, iIndex) => {
            if (iIndex === itemIndex && item.isExpandable) {
              return { ...item, isExpanded: !item.isExpanded };
            }
            return item;
          }),
        };
      })
    );
  };

  const handleAddTask = (status: TaskStatus) => {
    const newTaskId = `task-${Date.now()}`;

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

    addTask(newTask, status);
  };

  const getFilteredSections = () => {
    return sidebarSections.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.level === 0) return true;

        if (item.level === 1 && item.parentId) {
          const parentItem = section.items.find(
            (parentItem) =>
              parentItem.id === item.parentId && parentItem.level === 0
          );
          return parentItem?.isExpanded === true;
        }

        return true;
      }),
    }));
  };

  const activeTask = activeId ? getTaskById(activeId) : null;

  const currentViewOption = viewOptions.find(
    (option) => option.id === activeView
  );

  return (
    <ThemeProvider>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex h-screen bg-background">
          <NavigationBar
            activeItem={activeNavItem}
            onItemClick={handleNavItemClick}
          />

          <Sidebar
            sections={getFilteredSections()}
            onItemClick={handleSidebarItemClick}
            onAddClick={handleSidebarAddClick}
            onToggleSection={handleSidebarToggleSection}
            onToggleItem={handleSidebarToggleItem}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-muted/30 px-8 py-4">
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

            <div className="bg-muted/30 px-8 pt-4 relative">
              <div className="flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-6 relative">
                  <button
                    onClick={() => handleViewChange(activeView)}
                    className="text-foreground text-base flex items-center space-x-2 pb-4 hover:text-foreground/80 transition-colors relative border-b-2 border-primary"
                  >
                    {currentViewOption && (
                      <currentViewOption.icon className="w-4 h-4" />
                    )}
                    <div>{currentViewOption?.label}</div>
                  </button>

                  <div className="relative">
                    <button
                      onClick={handleAddViewClick}
                      className="text-muted-foreground hover:text-foreground text-base flex items-center space-x-2 pb-4 transition-colors"
                    >
                      <div className="border-accent border-2 rounded-full w-6 h-6 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>Add view</div>
                    </button>

                    {showAddViewOptions && (
                      <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg py-2 z-50 min-w-[160px]">
                        {viewOptions
                          .filter((option) => option.id !== activeView)
                          .map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.id}
                                onClick={() => handleViewChange(option.id)}
                                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3 text-sm transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {option.label}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4">
                  <Button variant="ghost" size="sm">
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm">
                    Sort
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full w-8 h-8"
                    size="sm"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    className="bg-primary dark:bg-[#4B69FF] dark:text-white rounded-full hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    New template
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 bg-muted/30 overflow-y-auto">
              {activeView === "board" && (
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
              )}

              {activeView === "list" && (
                <div className="bg-background rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">List View</h2>
                  <p className="text-muted-foreground">
                    List view implementation coming soon...
                  </p>
                </div>
              )}

              {activeView === "calendar" && (
                <div className="bg-background rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
                  <p className="text-muted-foreground">
                    Calendar view implementation coming soon...
                  </p>
                </div>
              )}

              {activeView === "timeline" && (
                <div className="bg-background rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Timeline View</h2>
                  <p className="text-muted-foreground">
                    Timeline view implementation coming soon...
                  </p>
                </div>
              )}
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
