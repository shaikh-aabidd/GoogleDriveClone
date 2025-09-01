// src/pages/OrdersDashboard.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation
} from "@/features/api/order.api";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSpinner,
  faExclamationCircle,
  faClipboardList,
  faCheckCircle,
  faHourglassHalf,
  faTimesCircle,
  faEye,
  faPlayCircle,
  faCheckSquare,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns"; // For date formatting

export default function OrdersDashboard() {
  const { user } = useSelector((s) => s.auth);
  const role = user?.role; // "buyer" | "freelancer" | "admin"
  const [status, setStatus] = useState("all");

  // Fetch orders + refetch
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetAllOrdersQuery(
    {
      page: 1,
      limit: 50,
      status: status !== "all" ? status : undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Single mutation for ANY status update
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const handleAccept = async (orderId) => {
    try {
      await updateStatus({ orderId, status: "In Progress" }).unwrap();
      refetch(); // Refetch to update the list
    } catch (err) {
      console.error("Failed to accept order:", err);
      // Optionally show a toast notification for error
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await updateStatus({ orderId, status: "Completed" }).unwrap();
      refetch(); // Refetch to update the list
    } catch (err) {
      console.error("Failed to complete order:", err);
      // Optionally show a toast notification for error
    }
  };

  // Determine badge variant based on status
  const getStatusBadgeVariant = (orderStatus) => {
    switch (orderStatus) {
      case "Pending":
        return "secondary"; // Using your secondary color for pending
      case "In Progress":
        return "default"; // Using your primary/default color
      case "Completed":
        return "success"; // Assuming you have a 'success' variant in your Badge component
      case "Cancelled":
        return "destructive"; // Using your destructive color for cancelled
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-4" />
        <p className="text-xl font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600">
        <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="mb-4" />
        <p className="text-xl font-medium">Failed to load orders.</p>
        <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  const orders = data?.data?.docs || [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FontAwesomeIcon icon={faClipboardList} className="text-primary" /> My Orders
        </h1>
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-11 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-500">
          <FontAwesomeIcon icon={faInfoCircle} size="3x" className="mb-4 text-blue-300" />
          <p className="text-xl font-medium">No orders found.</p>
          <p className="text-sm mt-2">Start exploring gigs to place your first order!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gig Title</th>
                {role === "admin" && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer</th>}
                {role === "admin" && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Freelancer</th>}
                {role === "buyer" && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Freelancer</th>}
                {role === "freelancer" && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer</th>}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created On</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{o._id.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                    <Link to={`/gigs/${o.gig._id}`}>{o.gig.title}</Link>
                  </td>
                  {role === "admin" && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.buyer.name}</td>}
                  {role === "admin" && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.freelancer.name}</td>}
                  {role === "buyer" && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.freelancer.name}</td>}
                  {role === "freelancer" && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.buyer.name}</td>}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.packageType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">${o.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge variant={getStatusBadgeVariant(o.status)}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(o.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* View Link */}
                    {/* <Link
                      to={`/orders/${o._id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" /> View
                    </Link> */}

                    {/* Freelancer actions */}
                    {role === "freelancer" && o.status === "Pending" && (
                      <Button
                        onClick={() => handleAccept(o._id)}
                        disabled={updating}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1.5 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faPlayCircle} className="mr-1" />
                        {updating ? "Accepting…" : "Accept"}
                      </Button>
                    )}
                    {role === "freelancer" && o.status === "In Progress" && (
                      <Button
                        onClick={() => handleComplete(o._id)}
                        disabled={updating}
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md px-3 py-1.5 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faCheckSquare} className="mr-1" />
                        {updating ? "Completing…" : "Mark Completed"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}