"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  History,
  Download,
  ChevronDown,
  ChevronRight,
  Film,
  Music,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Podcast,
  TrendingUp,
  Settings,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isActive }) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isActive 
          ? "bg-gray-100 text-gray-900 font-medium" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: PlaySquare, label: "Shorts", href: "/shorts" },
    { icon: PlaySquare, label: "Subscriptions", href: "/subscriptions" },
  ];

  const libraryItems = [
    { icon: History, label: "History", href: "/history" },
    { icon: PlaySquare, label: "Your videos", href: "/your-videos" },
    { icon: Clock, label: "Watch later", href: "/watch-later" },
    { icon: ThumbsUp, label: "Liked videos", href: "/liked-videos" },
    { icon: Download, label: "Downloads", href: "/downloads" },
  ];

  const exploreItems = [
    { icon: TrendingUp, label: "Trending", href: "/trending" },
    { icon: Music, label: "Music", href: "/music" },
    { icon: Film, label: "Movies", href: "/movies" },
    { icon: Radio, label: "Live", href: "/live" },
    { icon: Gamepad2, label: "Gaming", href: "/gaming" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: Trophy, label: "Sports", href: "/sports" },
    { icon: Lightbulb, label: "Learning", href: "/learning" },
    { icon: Shirt, label: "Fashion & Beauty", href: "/fashion" },
    { icon: Podcast, label: "Podcasts", href: "/podcasts" },
  ];

  const moreItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: MessageSquare, label: "Send feedback", href: "/feedback" },
  ];

  return (
    <aside className={cn("w-64 bg-white border-r h-screen overflow-y-auto hidden lg:block", className)}>
      <div className="p-3 space-y-6">
        {/* Main navigation */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Library section */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
            Library
          </h3>
          {libraryItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Explore section */}
        <div className="space-y-1">
          <button
            onClick={() => setIsExploreOpen(!isExploreOpen)}
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            {isExploreOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <span className="font-medium">Explore</span>
          </button>
          
          {isExploreOpen && (
            <div className="space-y-1 ml-6">
              {exploreItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          )}
        </div>

        {/* More section */}
        <div className="space-y-1">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            {isMoreOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <span className="font-medium">More</span>
          </button>
          
          {isMoreOpen && (
            <div className="space-y-1 ml-6">
              {moreItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t">
          <div className="px-3 py-2 text-xs text-gray-500">
            <div className="space-y-1">
              <div>About Press Copyright</div>
              <div>Contact us Creators</div>
              <div>Advertise Developers</div>
              <div>Terms Privacy Policy & Safety</div>
              <div>How YouTube works</div>
              <div>Test new features</div>
            </div>
            <div className="mt-2">© 2024 YVideo</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
