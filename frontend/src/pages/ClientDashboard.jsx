import React, { useState } from 'react';
import { Star, MessageSquare, Calendar, Clock, Download, Eye, Users, DollarSign } from 'lucide-react';
import { useGetMyReviewsQuery } from '@/features/api/review.api';
import { useGetAllOrdersQuery } from '@/features/api/order.api';
import { useNavigate } from 'react-router-dom';

// Individual Page Components
const PurchasedGigsPage = ({ gigs }) => {

    const navigate = useNavigate();
  const handleViewDetails = (id) => {
    console.log(`View details for gig ${id}`);
  };

  const handleDownloadFiles = (id) => {
    console.log(`Download files for gig ${id}`);
  };

  const handleLeaveReview = (id) => {
    navigate(`/gigs/${id}`)
  };

  const handleContactSeller = (id) => {
    console.log(`Contact seller for gig ${id}`);
  };

  console.log(gigs)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Purchased Gigs</h1>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Total Orders: {gigs.length}</span>
          <span>•</span>
          <span>Total Spent: ${gigs.reduce((sum, gig) => sum + gig.price, 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gigs.map((gig,index) => (
          <div
            key={gig.id || index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header with image and basic info */}
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={gig.images[0].url}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {gig.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                        gig.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : gig.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : gig.status === "Delivered"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    
                    <span className="text-sm text-gray-600">{gig.seller}</span>
                    {gig.hasReview && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{gig.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{gig.description}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">${gig.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Ordered:</span>
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Delivery:</span>
                  <span>{new Date(new Date(gig.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Files:</span>
                  <span>{gig.images.length}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(gig.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                
                {gig.status === "Completed" && (
                  <button
                    onClick={() => handleDownloadFiles(gig.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                
                {(gig.status === "Completed" || gig.status === "Delivered") && !gig.hasReview && (
                  <button
                    onClick={() => handleLeaveReview(gig._id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Leave Review
                  </button>
                )}
                
                <button
                  onClick={() => handleContactSeller(gig.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewsPage = ({ reviews }) => {
  const handleEditReview = (id) => {
    console.log(`Edit review ${id}`);
  };

  const handleMarkHelpful = (id) => {
    console.log(`Mark review ${id} as helpful`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        <div className="text-sm text-gray-600">
          {reviews.length} reviews written
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review,index) => (
          <div
            key={review.id || index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex gap-4">
              {/* Gig thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={review.gig?.images[0].url}
                  alt={review.comment}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Review content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {review.comment}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review?.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {review.rating}/5
                  </span>
                </div>

                {/* Review text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.reviewText}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEditReview(review.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit Review
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{review.helpful} found this helpful</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Reviews you write for completed gigs will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

// Main Client Dashboard Component
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("purchased");
  const {
      data: ordersResp,
      isLoading: ordersLoading,
      error: ordersError,
    } = useGetAllOrdersQuery();
    const PurchasedGigs = ordersResp?.data?.docs?.map(order => ({
  ...order.gig,
  createdAt: order.createdAt,
  status: order.status
})) ?? [];
    console.log(ordersResp)
  const {
      data: reviewsResp,
      isLoading: reviewsLoading,
      error: reviewsError,
    } = useGetMyReviewsQuery();


if (ordersLoading || reviewsLoading) return <div>Loading...</div>;
    
  if (ordersError || reviewsError)
    return <div>Error loading data.</div>;


  const sidebarItems = [
    {
      id: "purchased",
      label: "Purchased Gigs",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 6H6L5 9z"
          />
        </svg>
      ),
      count: PurchasedGigs.length,
      component: () => <PurchasedGigsPage gigs={PurchasedGigs} />,
    },
    {
      id: "reviews",
      label: "My Reviews",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      count: reviewsResp.length,
      component: () => <ReviewsPage reviews={reviewsResp} />,
    },
  ];

  const ActiveComponent =
    sidebarItems.find((item) => item.id === activeTab)?.component || PurchasedGigsPage;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Client</h2>
              <p className="text-sm text-gray-600">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={
                      activeTab === item.id ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === item.id
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}