// src/components/UserProfile.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useSelector((s) => s.auth);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse delay-75"></div>
          <div className="w-4 h-4 bg-pink-600 rounded-full animate-pulse delay-150"></div>
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    role,
    profileImage,
    phone,
    location,
    about,
    skills = [],
    hourlyRate,
    gigs = [],
    completedProjects = [],
    postedJobs = [],
    hiredFreelancers = [],
    orders = [],
  } = user;

  const MetricCard = ({ value, label, icon, gradient }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${gradient} transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-sm opacity-90">{label}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white/30 ring-offset-4 ring-offset-transparent transition-all duration-500 group-hover:ring-white/50 group-hover:scale-105">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-6xl font-bold backdrop-blur-sm">
                    {name?.charAt(0)}
                  </div>
                )}
              </div>
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4`}
              >
                <span className="text-white text-sm font-medium">
                  Edit Photo
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {name}
              </h1>
              <p className="text-xl opacity-90 mb-6">{email}</p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                {location && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-xl">📍</span>
                    <span>{location}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-xl">📞</span>
                    <span>{phone}</span>
                  </div>
                )}
              </div>

              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-colors duration-300 text-lg px-6 py-2 capitalize">
                ✨ {role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {about || "No bio provided."}
          </p>
        </div>

        {/* Role-specific Content */}
        {role === "freelancer" && (
          <div className="space-y-8">
            {/* Skills & Rate */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>

              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-6 py-3">
                  <span className="text-2xl">💰</span>
                  <span className="font-semibold text-lg">
                    {hourlyRate ? `$${hourlyRate}/hr` : "Rate not set"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <Badge
                      key={skill}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-lg">No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Performance Dashboard
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  value={gigs.length}
                  label="Active Gigs"
                  icon="🚀"
                  gradient="from-blue-500 to-indigo-600"
                />
                <MetricCard
                  value={completedProjects.length}
                  label="Completed Projects"
                  icon="✅"
                  gradient="from-green-500 to-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {role === "client" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Activity Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                value={postedJobs.length}
                label="Jobs Posted"
                icon="📝"
                gradient="from-purple-500 to-pink-600"
              />
              <MetricCard
                value={hiredFreelancers.length}
                label="Freelancers Hired"
                icon="👥"
                gradient="from-orange-500 to-red-600"
              />
              <MetricCard
                value={orders.length}
                label="Orders Placed"
                icon="📦"
                gradient="from-teal-500 to-cyan-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}