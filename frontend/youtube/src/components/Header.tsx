"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, Video, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex h-16 items-center px-4">
        {/* Left section - Logo and menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">YVideo</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1 px-4 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:border-blue-500"
            />
            <button className="px-6 py-2 bg-gray-100 border rounded-r-lg hover:bg-gray-200">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right section - User actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="h-5 w-5" />
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <Link href="/channel" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded">
                  <User className="h-4 w-4" />
                  <span>Your Channel</span>
                </Link>
                <Link href="/studio" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded">
                  <Video className="h-4 w-4" />
                  <span>YouTube Studio</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <Link href="/help" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Link>
                <hr className="my-2" />
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 bg-white border-b lg:hidden">
          <nav className="p-4">
            <Link href="/" className="block py-2 hover:text-blue-600">Home</Link>
            <Link href="/trending" className="block py-2 hover:text-blue-600">Trending</Link>
            <Link href="/subscriptions" className="block py-2 hover:text-blue-600">Subscriptions</Link>
            <Link href="/library" className="block py-2 hover:text-blue-600">Library</Link>
            <Link href="/history" className="block py-2 hover:text-blue-600">History</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
