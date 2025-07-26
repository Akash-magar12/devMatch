import axios from "axios";
import React, { useEffect } from "react";
import API_URL from "../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { addUserConnection, removeConnection } from "../slices/ConnectionSlice";
import { Mail, MapPin, User, MessageCircle, UserMinus, Users, UserX } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connectedUsers || connectedUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                MY CONNECTIONS
              </h1>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserX className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Connections Yet
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Start connecting with people to build your network. 
                Your connections will appear here once you accept requests!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MY CONNECTIONS
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            {connectedUsers.length} connection{connectedUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {connectedUsers.map((user) => {
            return (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden group"
              >
                {/* Profile Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Profile Image */}
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl" />
                      <div className="absolute inset-1 bg-white rounded-lg overflow-hidden">
                        <img
                          src={
                            user.profileImage ||
                            "https://geographyandyou.com/images/user-profile.png"
                          }
                          alt={user.name}
                          className="w-14 h-14 object-cover transition-all duration-300"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-2.5 h-2.5 text-blue-700" />
                        </div>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    {user.gender && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-emerald-700" />
                        </div>
                        <span>{user.gender}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-2.5 h-2.5 text-purple-700" />
                        </div>
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <Link 
                      to={`chat/${user._id}`}
                      className="flex-1"
                    >
                      <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(user.connectionReqId)}
                      className="bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                      title="Remove connection"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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