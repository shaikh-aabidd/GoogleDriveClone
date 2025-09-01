import { useGetEarningsQuery } from "@/features/api/earning.api";
import { useGetMyGigsQuery } from "@/features/api/gig.api";
import { useGetAllOrdersQuery } from "@/features/api/order.api";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Individual Page Components
const MyGigsPage = ({ gigs }) => {
  const navigate = useNavigate();

  const handleCreateGig = () => {
    navigate("/createGig");
  };

  const handleEdit = (id) => {
    toast("This feature will be implemented soon");
  };
  const handleView = (id) => {
    navigate(`/gigs/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        <button
          onClick={handleCreateGig}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
        >
          + Create New Gig
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig, index) => (
          <div
            key={gig._id || index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="w-full h-40 overflow-hidden rounded-t-xl">
              <img
                src={gig.images[0].url}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Wrapper */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Header: title + status */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {gig.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    gig.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {gig.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 flex-grow">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">
                    ${gig.price}
                  </span>
                </div>
                {/* add more details here if needed */}
              </div>

              {/* Footer buttons */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(gig._id)}
                    className="flex-1 py-2 px-3 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleView(gig._id)}
                    className="flex-1 py-2 px-3 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MyOrdersPage = ({ orders }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {order?.buyer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {order.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${order.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const EarningsPage = ({ earnings }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">
                ${earnings.totalEarnings?.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("gigs");
  const {
    data: earningsResp,
    isLoading: earningsLoading,
    error: earningsError,
  } = useGetEarningsQuery();
  const earnings = earningsResp || [];

  const {
    data: ordersResp,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetAllOrdersQuery();
  console.log(ordersResp);
  const orders = ordersResp?.data?.docs ?? [];

  const {
    data: gigsResp,
    isLoading: gigsLoading,
    error: gigsError,
  } = useGetMyGigsQuery();
  const gigs = gigsResp?.data ?? [];

  if (gigsLoading || ordersLoading || earningsLoading)
    return <div>Loading...</div>;
  if (gigsError || ordersError || earningsError)
    return <div>Error loading data.</div>;

  const sidebarItems = [
    {
      id: "gigs",
      label: "My Gigs",
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
            d="M19 11H5m14-7H5m14 14H5"
          />
        </svg>
      ),
      count: gigs.length,
      component: () => <MyGigsPage gigs={gigs} />,
    },
    {
      id: "orders",
      label: "Orders",
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
      count: orders.length,
      component: () => <MyOrdersPage orders={orders} />,
    },
    {
      id: "earnings",
      label: "Earnings",
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      count: `$${earnings.totalEarnings?.toFixed(0)}`,
      component: () => <EarningsPage earnings={earnings} />,
    },
  ];

  const ActiveComponent =
    sidebarItems.find((item) => item.id === activeTab)?.component || MyGigsPage;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Freelancer</h2>
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
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={
                      activeTab === item.id ? "text-blue-600" : "text-gray-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
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
