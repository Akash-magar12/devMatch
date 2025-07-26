import React, { useEffect } from "react";
import API_URL from "../utils/const";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnectionReq, removeRequest } from "../slices/ConnectionSlice";
import { User, Mail, MapPin, Heart, X, Users, Inbox } from "lucide-react";
import { toast } from "react-toastify";

const ConnectionRequest = () => {
  const dispatch = useDispatch();
  const connectionReq = useSelector((store) => store.connection);

  const UserConnectionRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/request/recieved`, {
        withCredentials: true,
      });
      dispatch(addConnectionReq(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    UserConnectionRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connectionReq || connectionReq.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                CONNECTION REQUESTS
              </h1>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Connection Requests
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You don't have any pending connection requests at the moment.
                Check back later to see who wants to connect with you!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleReview = async (id, status) => {
    try {
      let res = await axios.post(
        `${API_URL}/request/review/${status}/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (status === "accepted") {
        toast.success(res.data.message || "Request accepted");
      } else if (status === "rejected") {
        toast.error(res.data.message || "Request rejected");
      }
      dispatch(removeRequest(id)); // immediate UI update
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              CONNECTION REQUESTS
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            {connectionReq.length} pending request
            {connectionReq.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {connectionReq.map((req) => {
            const sender = req.senderId;
            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Profile Image */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl" />
                        <div className="absolute inset-1 bg-white rounded-xl overflow-hidden">
                          <img
                            src={
                              sender?.profileImage ||
                              "https://geographyandyou.com/images/user-profile.png"
                            }
                            alt={sender?.name}
                            className="w-16 h-16 object-cover transition-all duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {sender?.name}
                        </h3>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                              <Mail className="w-3 h-3 text-blue-700" />
                            </div>
                            <span className="truncate">{sender?.email}</span>
                          </div>

                          {sender?.gender && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-emerald-700" />
                              </div>
                              <span>{sender?.gender}</span>
                            </div>
                          )}

                          {sender?.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-3 h-3 text-purple-700" />
                              </div>
                              <span>{sender?.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 md:flex-col lg:flex-row">
                      <button
                        onClick={() => handleReview(req._id, "accepted")}
                        className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReview(req._id, "rejected")}
                        className="flex-1 md:flex-none bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-gray-500 text-sm">
            Review carefully before accepting connection requests
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequest;
