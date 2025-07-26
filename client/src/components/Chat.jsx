import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import API_URL from "../utils/const";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const userId = user?._id;
  const navigate = useNavigate();
  const fetchMessage = async () => {
    try {
      let chat = await axios.get(`${API_URL}/chat/getChats/${targetUserId}`, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          userName: senderId?.name,
          text,
          userId: senderId?._id,
        };
      });
      setMessages(chatMessages);

      if (chatMessages.length > 0) {
        const targetUserMsg = chatMessages.find((msg) => msg.userId !== userId);
        if (targetUserMsg) {
          setTargetUser({ name: targetUserMsg.userName });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, userName: user.name, targetUserId });
    socket.on("messageRecieved", ({ userName, newMessage }) => {
      setMessages((prev) => [...prev, { userName, text: newMessage }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchMessage();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      userName: user.name,
      userId,
      targetUserId,
      newMessage,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {targetUser?.name?.charAt(0) || "D"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {targetUser?.name || "Developer"}
              </h2>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Start Your Conversation
            </h3>
            <p className="text-gray-500 max-w-md">
              Send a message to begin your chat with this developer.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.userName === user.name;
            const showAvatar =
              index === 0 || messages[index - 1]?.userName !== msg.userName;

            return (
              <div
                key={index}
                className={`flex items-end gap-3 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && showAvatar && (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {msg.userName?.charAt(0)}
                  </div>
                )}
                {!isCurrentUser && !showAvatar && (
                  <div className="w-8 h-8 flex-shrink-0" />
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 text-sm break-words rounded-2xl shadow ${
                    isCurrentUser
                      ? "bg-black text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                {isCurrentUser && showAvatar && (
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {user.name?.charAt(0)}
                  </div>
                )}
                {isCurrentUser && !showAvatar && (
                  <div className="w-8 h-8 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-300 p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              type="text"
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-2xl px-6 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-2xl shadow hover:shadow-md transition-all ${
              newMessage.trim()
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
