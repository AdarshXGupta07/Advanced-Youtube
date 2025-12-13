"use client";

import React from "react";
import Link from "next/link";
import { Play, Upload, TrendingUp, Users, Clock, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const features = [
    {
      icon: Play,
      title: "Watch Videos",
      description: "Discover and watch amazing content from creators around the world",
      href: "/videos"
    },
    {
      icon: Upload,
      title: "Upload Content",
      description: "Share your creativity and build your audience",
      href: "/upload"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with creators and subscribers",
      href: "/community"
    }
  ];

  const stats = [
    { icon: TrendingUp, label: "Trending Videos", value: "10K+" },
    { icon: Users, label: "Active Creators", value: "5K+" },
    { icon: Clock, label: "Watch Hours", value: "1M+" },
    { icon: ThumbsUp, label: "Total Likes", value: "50M+" }
  ];

  return (
    <section className={cn("relative bg-gradient-to-br from-red-50 to-blue-50 py-20", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Welcome to
              <span className="text-red-600"> YVideo</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              The next generation video platform where creators thrive and viewers discover amazing content
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Play className="h-5 w-5" />
              Start Watching
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Upload className="h-5 w-5" />
              Create Account
            </Link>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    <stat.icon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features section */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                    <feature.icon className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="mt-16 p-8 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of creators and viewers on YVideo. Upload your first video or discover amazing content today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
