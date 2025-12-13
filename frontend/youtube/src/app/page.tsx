"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";

// Mock data for demonstration
const mockVideos = [
  {
    _id: "1",
    title: "Building a Modern YouTube Clone with Next.js and TypeScript",
    description: "Learn how to create a full-featured YouTube clone using modern web technologies.",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640",
    videoFile: "/sample-video.mp4",
    views: 125000,
    createdAt: "2024-01-15T10:30:00Z",
    duration: 1245,
    owner: {
      _id: "user1",
      username: "techcreator",
      fullName: "Tech Creator",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64"
    }
  },
  {
    _id: "2",
    title: "Advanced React Patterns You Should Know",
    description: "Deep dive into advanced React patterns and best practices for building scalable applications.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640",
    videoFile: "/sample-video2.mp4",
    views: 89000,
    createdAt: "2024-01-14T15:45:00Z",
    duration: 1832,
    owner: {
      _id: "user2",
      username: "reactguru",
      fullName: "React Guru",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64"
    }
  },
  {
    _id: "3",
    title: "TypeScript Best Practices for Large Applications",
    description: "Essential TypeScript patterns and practices for maintaining large-scale applications.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640",
    videoFile: "/sample-video3.mp4",
    views: 156000,
    createdAt: "2024-01-13T08:20:00Z",
    duration: 2156,
    owner: {
      _id: "user3",
      username: "tsexpert",
      fullName: "TypeScript Expert",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64"
    }
  },
  {
    _id: "4",
    title: "Building Scalable APIs with Node.js and Express",
    description: "Complete guide to building and scaling REST APIs with Node.js and Express framework.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640",
    videoFile: "/sample-video4.mp4",
    views: 67000,
    createdAt: "2024-01-12T12:10:00Z",
    duration: 1678,
    owner: {
      _id: "user4",
      username: "backenddev",
      fullName: "Backend Developer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64"
    }
  }
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        <Sidebar className="hidden lg:block" />
        
        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />
          
          {/* Video Grid Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Recommended Videos</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Load More Videos
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-64 bg-white z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
