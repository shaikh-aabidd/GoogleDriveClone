// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  useGetConversationQuery,
  useSendMessageMutation,
} from "@/features/api/message.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"; // Import send icon

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function Chat({ currentUserId, selectedUserId, orderId }) {
  // 1️⃣ Load existing messages
  const { data: resp, isLoading } = useGetConversationQuery(selectedUserId);
  const initialMessages = resp?.data || [];

  // 2️⃣ Local state
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // 3️⃣ Initialize socket once
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    // 1️⃣ When we connect:
    socket.on("connect", () => {
      console.log("🔌 Socket connected, id =", socket.id);
      console.log("📝 Emitting join for", currentUserId);
      // emit join right after connect
      socket.emit("join", { userId: currentUserId });
    });

    // 2️⃣ Listen for incoming messages
    socket.on("receive-message", (msg) => {
      console.log("Got message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect_error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  // 4️⃣ Join the room whenever currentUserId or orderId changes
  // This part was commented out in your original code, keeping it commented.
  // useEffect(() => {
  //   if (!socketRef.current || !orderId) return;
  //   socketRef.current.emit("join", { userId: currentUserId, orderId });
  // }, [currentUserId, orderId]);

  // 5️⃣ Sync REST-loaded messages on conversation switch
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, selectedUserId, orderId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 6️⃣ Mutation for REST save
  const [sendMessage] = useSendMessageMutation();

  // 7️⃣ Send handler
  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content) return;

    const payload = {
      receiverId: selectedUserId,
      content,
      orderId,
    };

    // a) Persist to DB
    try {
      const saved = await sendMessage(payload).unwrap();
      // Only add if not already added by socket (to prevent duplicates if socket echoes)
      // A more robust solution might involve unique message IDs from backend
      setMessages((prev) => {
        if (!prev.some(msg => msg._id === saved.data._id)) {
          return [...prev, saved.data];
        }
        return prev;
      });
    } catch (err) {
      console.error("Save failed:", err);
    }

    // b) Emit real-time
    socketRef.current.emit("send-message", {
      toUserId: selectedUserId,
      content,
      orderId,
    });

    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 text-gray-600">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation!</p>
          </div>
        )}
        {messages.map((m, idx) => (
          <div
            key={m._id ?? idx}
            className={`flex ${
              m.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                m.sender === currentUserId
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white flex items-center gap-3">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center w-12 h-12"
          aria-label="Send message"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
        </button>
      </div>
    </div>
  );
}