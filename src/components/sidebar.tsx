"use client";

import { Button } from "@/components/ui/button";
import { Plus, Sun, Moon, ChevronRight, ChevronDown } from "lucide-react";
import { useThemeStore } from "../store/theme-store";

interface SidebarItem {
  label: string;
  count?: number;
  isActive?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  children?: SidebarItem[];
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
    itemIndex: number,
    depth = 0
  ) => {
    const paddingLeft = depth * 16 + (depth > 0 ? 16 : 0);

    return (
      <div key={`${sectionIndex}-${itemIndex}-${depth}`}>
        <div
          className={`flex items-center justify-between cursor-pointer py-2 hover:text-sidebar-accent-foreground transition-colors ${
            item.isActive
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70"
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (item.hasChildren && onToggleItem) {
              onToggleItem(sectionIndex, itemIndex);
            } else if (onItemClick) {
              onItemClick(item, sectionIndex, itemIndex);
            }
          }}
        >
          <span>
            {item.label} {item.count !== undefined && `(${item.count})`}
          </span>
          {item.hasChildren &&
            (item.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </div>

        {item.hasChildren && item.isExpanded && item.children && (
          <div>
            {item.children.map((childItem, childIndex) =>
              renderItem(childItem, sectionIndex, childIndex, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-sidebar text-sidebar-foreground p-6 flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-sidebar-accent-foreground rounded-sm"></div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-6 flex-1">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-semibold cursor-pointer ${
                  section.isExpanded !== false
                    ? "text-sidebar-foreground"
                    : "text-sidebar-foreground/70"
                }`}
                onClick={() => onToggleSection?.(sectionIndex)}
              >
                {section.title}
              </h2>
              {section.hasAddButton && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  onClick={() => onAddClick?.(sectionIndex)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {section.isExpanded !== false && (
              <div className="space-y-2">
                {section.items.map((item, itemIndex) =>
                  renderItem(item, sectionIndex, itemIndex)
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="flex justify-between items-center gap-2 p-3 bg-accent rounded-full w-full">
        <div
          className={`flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            theme === "light"
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
          }`}
          onClick={() => setTheme("light")}
        >
          <Sun className="w-4 h-4" />
          <span className="text-sm">Light</span>
        </div>
        <div
          className={`flex items-center justify-center gap-2 cursor-pointer ml-4 transition-colors ${
            theme === "dark"
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
          }`}
          onClick={() => setTheme("dark")}
        >
          <Moon className="w-4 h-4" />
          <span className="text-sm">Dark</span>
        </div>
      </div>
    </div>
  );
}

// Export types for external use
export type { SidebarProps, SidebarSection, SidebarItem };
