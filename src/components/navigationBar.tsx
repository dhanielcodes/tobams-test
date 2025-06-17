"use client";

import {
  Calendar,
  MessageSquare,
  LayoutDashboard,
  User2,
  Map,
  Settings2,
  UploadCloud,
  Grid3x3,
} from "lucide-react";
import Image from "next/image";

interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export function NavigationBar({
  activeItem = "home",
  onItemClick,
}: NavigationBarProps) {
  const navigationItems = [
    { id: "home", icon: LayoutDashboard, label: "Home", isActive: true },
    { id: "users", icon: User2, label: "Team" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "messages", icon: Grid3x3, label: "Messages" },
    { id: "upload", icon: UploadCloud, label: "Upload" },
    { id: "map", icon: Map, label: "map" },
    { id: "settings", icon: Settings2, label: "Settings" },
  ];

  return (
    <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
          <Image src={"/logo.svg"} alt="Logo" width={16} height={16} />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
