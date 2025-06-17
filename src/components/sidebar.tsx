"use client";

import { Button } from "@/components/ui/button";
import { Plus, Sun, Moon, ChevronRight, ChevronDown } from "lucide-react";
import { useThemeStore } from "../store/theme-store";

interface SidebarItem {
  id: string;
  label: string;
  count?: number;
  isActive?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  level?: number;
  parentId?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  isExpanded?: boolean;
  hasAddButton?: boolean;
}

interface SidebarProps {
  sections: SidebarSection[];
  onItemClick?: (
    item: SidebarItem,
    sectionIndex: number,
    itemIndex: number
  ) => void;
  onAddClick?: (sectionIndex: number) => void;
  onToggleSection?: (sectionIndex: number) => void;
  onToggleItem?: (sectionIndex: number, itemIndex: number) => void;
}

export function Sidebar({
  sections,
  onItemClick,
  onAddClick,
  onToggleSection,
  onToggleItem,
}: SidebarProps) {
  const { theme, setTheme } = useThemeStore();

  const renderItem = (
    item: SidebarItem,
    sectionIndex: number,
    itemIndex: number
  ) => {
    const paddingLeft = (item.level || 0) * 16 + 16;

    return (
      <div
        key={`${sectionIndex}-${itemIndex}-${item.id}`}
        className={`flex items-center justify-between cursor-pointer py-2 px-4 rounded-full transition-colors ${
          item.isActive && !item.isExpandable
            ? "text-sidebar-accent-foreground bg-sidebar-accent"
            : item.isExpandable
            ? "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30"
            : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => {
          if (item.isExpandable && onToggleItem) {
            onToggleItem(sectionIndex, itemIndex);
          } else if (onItemClick) {
            onItemClick(item, sectionIndex, itemIndex);
          }
        }}
      >
        <span className="text-base">
          {item.label} {item.count !== undefined && `(${item.count})`}
        </span>
        {item.isExpandable &&
          (item.isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          ))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 flex justify-between">
        <h1 className="text-xl font-semibold text-sidebar-foreground">
          Projects
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="bg-accent rounded-full w-8 h-8"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.isExpanded !== false && (
              <div className="space-y-1">
                {section.items.map((item, itemIndex) =>
                  renderItem(item, sectionIndex, itemIndex)
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="bg-sidebar-accent/50 rounded-full p-1 flex items-center">
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              theme === "light"
                ? "bg-background text-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
            }`}
            onClick={() => setTheme("light")}
          >
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              theme === "dark"
                ? "bg-background text-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
            }`}
            onClick={() => setTheme("dark")}
          >
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export type { SidebarProps, SidebarSection, SidebarItem };
