// src/pages/GigListPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllGigsQuery } from "@/features/api/gig.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faSpinner, faExclamationCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { GigCard } from ".";

// Assuming GigCard is a component that takes a 'gig' prop and 'onClick'
// Example placeholder for GigCard styling (you'd apply this inside your actual GigCard component)
/*
const GigCard = ({ gig, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
    onClick={onClick}
  >
    <img
      src={gig.coverImage || "https://placehold.co/400x250/E0E7FF/4338CA?text=Gig+Image"}
      alt={gig.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{gig.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gig.description || "No description provided."}</p>
      <div className="flex justify-between items-center text-sm text-gray-700">
        <span className="font-medium">Starting at: ${gig.price}</span>
        <span className="text-blue-600 font-medium">{gig.category}</span>
      </div>
    </div>
  </div>
);
*/

export default function GigListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const role = user?.role;

  // Local state for hero search input
  const [heroSearchTerm, setHeroSearchTerm] = useState(searchParams.get("tag") || "");

  // 1️⃣ Read URL params
  const urlCat = searchParams.get("category") || "all";
  const urlKeyword = searchParams.get("tag") || "";

  // 2️⃣ Scroll to top when params change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [urlCat, urlKeyword]);

  // 3️⃣ Build your query args
  const queryArgs = {
    page: 1,
    limit: 12,
    category: urlCat !== "all" ? urlCat : undefined,
    tags: urlKeyword ? [urlKeyword] : undefined,
  };

  // 4️⃣ Fetch via RTK Query
  const { data, isLoading, isError } = useGetAllGigsQuery(
    queryArgs,
    { refetchOnMountOrArgChange: true }
  );

  // Handler for Create Gig
  const handleCreateGig = () => {
    navigate("/createGig");
  };

  // Handle search from the hero section
  const handleHeroSearch = (e) => {
    if (e.key === "Enter" && heroSearchTerm.trim()) {
      navigate(`/gigs?tag=${encodeURIComponent(heroSearchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-dark to-primary-light text-white py-20 px-4 text-center overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10">
          {/* Background pattern or subtle texture */}
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 leading-tight">
            Find the Perfect <span className="text-accent-light">Freelance Services</span> for Your Business
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Explore a world of creative and professional talent to get your projects done.
          </p>
          
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top bar: heading + create button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            {urlKeyword
              ? `Results for “${urlKeyword}”`
              : urlCat === "all"
                ? "All Gigs"
                : urlCat.replace(/-/g, " ")
            }
          </h2>

          {/* Show Create Gig button for freelancers */}
          {isAuthenticated && role === "freelancer" && (
            <button
              onClick={handleCreateGig}
              className="bg-secondary text-white px-6 py-3 rounded-full shadow-md hover:bg-secondary-dark transition-all duration-300 flex items-center gap-2 text-lg font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create New Gig
            </button>
          )}
        </div>

        {/* Loading / Error / No Gigs Found */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
            <p className="text-xl font-medium">Loading amazing gigs...</p>
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-600">
            <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="mb-4" />
            <p className="text-xl font-medium">Oops! Failed to load gigs.</p>
            <p className="text-gray-500 mt-2">Please try again later.</p>
          </div>
        )}
        {!isLoading && !isError && data?.docs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FontAwesomeIcon icon={faInfoCircle} size="3x" className="mb-4" />
            <p className="text-xl font-medium">No gigs found for this search.</p>
            <p className="text-sm mt-2">Try a different keyword or category.</p>
          </div>
        )}

        {/* Gig Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Ensure your GigCard component has good internal styling for this grid */}
          {data?.docs.map((gig) => (
            <GigCard
              key={gig._id}
              gig={gig}
              onClick={() => navigate(`/gigs/${gig._id}`)}
            />
          ))}
        </div>

        {/* Pagination (Placeholder for now) */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            {/* You'd implement actual pagination buttons here */}
            <button className="px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700">
              Page {data.page} of {data.totalPages}
            </span>
            <button className="px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}