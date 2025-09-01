// src/pages/ChatPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Chat from "@/components/Chat";
import { useGetAllOrdersQuery } from "@/features/api/order.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faUserCircle, faBars, faXmark } from "@fortawesome/free-solid-svg-icons"; // Added faBars, faXmark

export default function ChatPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { user } = useSelector((s) => s.auth);
  const currentUserId = user?._id; // Ensure user is not null
  const isFreelancer = user?.role === "freelancer"; // Ensure user is not null

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false); // New state for mobile sidebar visibility

  const { data: response, isLoading: isLoadingOrders } = useGetAllOrdersQuery({ page, limit });
  const orders = response?.data?.docs || [];
  console.log("Orders ",orders)
  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Build a unique list of chat partners (conversations)
const conversations = useMemo(() => {
  const uniqueConversations = new Map(); // Key: `${otherUserId}`

  orders.forEach((order) => {
    const otherUser = isFreelancer ? order.buyer : order.seller;

    if (otherUser && otherUser._id && otherUser._id !== currentUserId) {
      const conversationKey = `${otherUser._id}`;

      // Only store the first order found (or latest, depending on use case)
      if (!uniqueConversations.has(conversationKey)) {
        uniqueConversations.set(conversationKey, {
          id: otherUser._id,
          name: otherUser.name,
          profileImage: otherUser.profileImage,
          orderId: order._id,            // still useful to initiate a conversation
          gigTitle: order.gig?.title,
        });
      }
    }
  });

  return Array.from(uniqueConversations.values());
}, [orders, isFreelancer, currentUserId]);


  // When conversations data arrives, default-select the first one
useEffect(() => {
  if (!selectedUserId && conversations.length > 0) {
    setSelectedUserId(conversations[0].id);
    setOrderId(conversations[0].orderId);
  }
}, [conversations, selectedUserId]);


  // Close mobile sidebar when a conversation is selected
  useEffect(() => {
    if (selectedUserId) {
      setShowMobileSidebar(false);
    }
  }, [selectedUserId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4">Authenticating user...</p>
      </div>
    );
  }

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 font-sans overflow-hidden relative"> {/* Added relative for absolute positioning of sidebar */}
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden absolute top-4 left-4 z-30 p-2  bg-primary text-white shadow-lg"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        aria-label={showMobileSidebar ? "Close conversations" : "Open conversations"}
      >
        <FontAwesomeIcon icon={showMobileSidebar ? faXmark : faBars} size="lg" />
      </button>

      {/* Sidebar - Conversations List */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-80 bg-white border-r border-gray-200 shadow-md flex flex-col transition-transform duration-300 ease-in-out
                   md:relative md:translate-x-0 md:rounded-l-lg md:overflow-hidden
                   ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-200 bg-primary text-white flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <FontAwesomeIcon icon={faMessage} /> Conversations
          </h2>
          {/* Close button for mobile sidebar */}
          <button
            className="md:hidden text-white"
            onClick={() => setShowMobileSidebar(false)}
            aria-label="Close conversations"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <li className="px-6 py-4 text-gray-500 text-center">No conversations yet.</li>
          ) : (
            conversations.map((p) => (
              <li key={`${p.id}-${p.orderId}`}>
                <button
                  onClick={() => {
                    setOrderId(p.orderId);
                    setSelectedUserId(p.id);
                  }}
                  className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-colors duration-200
                    ${p.id === selectedUserId && p.orderId === orderId // Check both ID and OrderID for active state
                      ? "bg-blue-100 border-l-4 border-blue-600 text-blue-800"
                      : "hover:bg-gray-50 text-gray-800"
                    }`}
                >
                  {/* User Avatar/Initial */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {p.profileImage ? (
                      <img
                        src={p.profileImage}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg">
                        <FontAwesomeIcon icon={faUserCircle} />
                      </div>
                    )}
                  </div>
                  {/* User Name and Gig Title */}
                  <div>
                    <p className="font-semibold text-base">{p.name}</p>
                    {p.gigTitle && (
                      <p className="text-sm text-gray-500">{truncateText(p.gigTitle, 30)}</p>
                    )}
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Mobile Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col p-4 ${showMobileSidebar ? 'hidden md:flex' : ''}`}> {/* Hide chat area when sidebar is open on mobile */}
        {selectedUserId && orderId ? (
          <Chat currentUserId={currentUserId} selectedUserId={selectedUserId} orderId={orderId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-lg text-gray-500">
            <FontAwesomeIcon icon={faMessage} className="text-6xl text-blue-300 mb-4" />
            <p className="text-xl font-medium">Select a conversation to start chatting.</p>
            <p className="text-sm mt-2">Your messages will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}