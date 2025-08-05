import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Re-enable in your actual project
import { addFeed } from "../slices/feedSlice"; // Re-enable in your actual project
import FeedCard from "./FeedCard";
import API_URL from "../utils/const";

const Feed = () => {
  const feedUsers = useSelector((store) => store.feed); // Re-enable in your actual project
  const dispatch = useDispatch(); // Re-enable in your actual project

  const fetchUsers = async () => {
    try {
      // Replace with your actual API_URL if it's not imported
      const res = await axios.get(`${API_URL}/user/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="  py-8">
      <div className="max-w-md mx-auto px-4">
        {feedUsers.length === 0 && (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No users found
            </h1>
            <p className="text-gray-600">
              Check back later for new developer profiles!
            </p>
          </div>
        )}
        {feedUsers.length > 0 && <FeedCard feedUser={feedUsers[0]} />}
      </div>
    </div>
  );
};

export default Feed;
