import axios from "axios";
import React, { useEffect } from "react";
import API_URL from "../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { addUserConnection, removeConnection } from "../slices/ConnectionSlice";
import {
  Mail,
  MapPin,
  User,
  MessageCircle,
  UserMinus,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router";

const Connections = () => {
  const dispatch = useDispatch();
  const connectedUsers = useSelector((store) => store.connection);

  const UserConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/connection`, {
        withCredentials: true,
      });
      dispatch(addUserConnection(res.data.connectedUsers));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    UserConnection();
  }, []);

  const handleDelete = async (id) => {
    try {
      let res = await axios.delete(
        `http://localhost:7000/api/user/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      dispatch(removeConnection(id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 justify-center">
            <Users className="w-6 h-6" />
            <h1 className="text-4xl font-bold">MY CONNECTIONS</h1>
          </div>
          <div className="w-32 h-1 bg-black mx-auto rounded-full"></div>
          <p className="text-gray-700 mt-4 text-lg">
            {connectedUsers.length} connection
            {connectedUsers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty State */}
        {(!connectedUsers || connectedUsers.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-300 p-12 max-w-lg mx-auto">
              <UserX className="w-10 h-10 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">No Connections Yet</h2>
              <p className="text-gray-600">
                Start connecting with people to build your network. Your
                connections will appear here once you accept requests!
              </p>
            </div>
          </div>
        )}

        {/* Connections Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {connectedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-md transition"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    user.profileImage ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                {user.gender && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user.gender}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link to={`chat/${user._id}`} className="flex-1">
                  <button className="w-full bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </div>
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(user.connectionReqId)}
                  className="px-3 py-2 border border-gray-400 text-gray-700 rounded-md hover:text-red-600 hover:border-red-400"
                  title="Remove connection"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-gray-500 text-sm">
            Stay connected with your network and keep building relationships
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connections;
