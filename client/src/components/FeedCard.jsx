import { Github, Linkedin, Link, MapPin, Heart, X } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux"; // Re-enable in your actual project
import { removeFeed } from "../slices/feedSlice"; // Re-enable in your actual project
import { toast } from "react-toastify";
import API_URL from "../utils/const";

const FeedCard = ({ feedUser }) => {
  const dispatch = useDispatch(); // Re-enable in your actual project

  const handleConnection = async (id, status) => {
    try {
      const res = await axios.post(
        `${API_URL}/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      toast[status === "interested" ? "success" : "error"](res.data.message);
      dispatch(removeFeed(id)); // Re-enable in your actual project
    } catch (error) {
      console.error(error);
    }
  };

  if (!feedUser) return null;

  const {
    _id,
    name,
    age,
    location,
    bio,
    profileImage,
    github,
    linkedin,
    portfolio,
    techStack,
  } = feedUser;

  return (
    <div className="max-w-sm mx-auto relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 transition-transform duration-300 hover:shadow-xl">
      {/* Profile Image */}
      <div className="h-96 w-full relative">
        <img
          src={
            profileImage ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
          }
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {name} {age}
          </h2>
          {location && (
            <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {location}
            </p>
          )}
        </div>
      </div>
      {/* Bio Section */}
      {bio && (
        <div className="px-6 pt-4 pb-2 text-sm text-gray-700 bg-white">
          <p>{bio}</p>
        </div>
      )}
      {/* Tech Stack */}
      {techStack?.length > 0 && (
        <div className="px-6 pb-3 bg-white">
          <h4 className="text-sm text-gray-600 mb-1">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Social Links */}
      <div className="flex justify-center gap-3 pb-4 bg-white">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
          >
            <Github size={16} />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
          >
            <Linkedin size={16} />
          </a>
        )}
        {portfolio && (
          <a
            href={portfolio}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
          >
            <Link size={16} />
          </a>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex justify-center gap-10 pb-6 bg-white">
        <button
          onClick={() => handleConnection(_id, "ignored")}
          className="bg-gray-100 hover:bg-gray-200 p-4 rounded-full text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => handleConnection(_id, "interested")}
          className="bg-black hover:bg-gray-800 p-4 rounded-full text-white transition-colors"
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
