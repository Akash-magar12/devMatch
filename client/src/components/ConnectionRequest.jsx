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
  }, []);

  if (!connectionReq || connectionReq.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-black">
                CONNECTION REQUESTS
              </h1>
            </div>
            <div className="w-32 h-1 bg-black mx-auto rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Connection Requests
              </h2>
              <p className="text-gray-600">
                You don't have any pending connection requests at the moment.
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
      toast[status === "accepted" ? "success" : "error"](res.data.message);
      dispatch(removeRequest(id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-black">
              CONNECTION REQUESTS
            </h1>
          </div>
          <div className="w-32 h-1 bg-black mx-auto rounded-full"></div>
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
                className="bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Profile Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={
                          sender?.profileImage ||
                          "https://geographyandyou.com/images/user-profile.png"
                        }
                        alt={sender?.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-300"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {sender?.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {sender?.email}
                          </p>
                          {sender?.gender && (
                            <p className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {sender?.gender}
                            </p>
                          )}
                          {sender?.location && (
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {sender?.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 md:flex-col lg:flex-row">
                      <button
                        onClick={() => handleReview(req._id, "accepted")}
                        className="bg-black text-white px-6 py-3 rounded-xl font-medium transition hover:opacity-90"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Accept
                        </div>
                      </button>
                      <button
                        onClick={() => handleReview(req._id, "rejected")}
                        className="bg-white border border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-300 px-6 py-3 rounded-xl font-medium transition"
                      >
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Ignore
                        </div>
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
