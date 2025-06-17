"use client";

import {
  Calendar,
  LayoutDashboard,
  User2,
  Map,
  Settings2,
  UploadCloud,
  Grid3x3,
  LogOut,
  MoreHorizontal,
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
    { id: "map", icon: Map, label: "Map" },
    { id: "settings", icon: Settings2, label: "Settings" },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
    onItemClick?.("logout");
  };

  return (
    <div className="w-16 bg-[#1C1D22] flex flex-col items-center py-6">
      <div className="mb-6">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-white/70"
          title="More options"
        >
          <MoreHorizontal className="w-8 h-8" />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <Image src={"/logo.svg"} alt="Logo" width={18} height={18} />
      </div>

      <div className="flex flex-col gap-4 flex-1">
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
                  : "text-white/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
