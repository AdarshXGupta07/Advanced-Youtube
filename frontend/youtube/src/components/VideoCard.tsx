"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ThumbsUp, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoFile: string;
    views: number;
    createdAt: string;
    owner: {
      _id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
    duration?: number;
  };
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className }) => {
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/video/${video._id}`} className={cn("group cursor-pointer", className)}>
      <div className="space-y-2">
        {/* Thumbnail container */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="flex gap-3">
          {/* Channel avatar */}
          <div className="flex-shrink-0">
            <Image
              src={video.owner.avatar}
              alt={video.owner.fullName}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>

          {/* Video details */}
          <div className="flex-1 space-y-1">
            {/* Title */}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {video.title}
            </h3>

            {/* Channel name and views */}
            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{video.owner.fullName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(video.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
