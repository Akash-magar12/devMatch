import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Users,
  UserPlus,
  LogOut,
  Home,
  BadgeCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import API_URL from "../utils/const";
import { removeUser } from "../slices/useSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold text-black">
          DevMatch
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/home"
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <Home size={18} />
            <span className="font-medium">Home</span>
          </Link>

          {user && (
            <span className="text-sm text-gray-500">Welcome {user.name}</span>
          )}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-full focus:outline-none"
            >
              <img
                src={
                  user?.profileImage ||
                  "https://geographyandyou.com/images/user-profile.png"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <ChevronDown size={18} className="text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <Link
                  to="/home/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Link>
                <Link
                  to="/home/connections"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Users size={18} className="mr-2" />
                  Connections
                </Link>
                <Link
                  to="/home/connectionReq"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserPlus size={18} className="mr-2" />
                  Requests
                </Link>
                <Link
                  to="/home/membership"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <BadgeCheck size={18} className="mr-2" />
                  Membership
                </Link>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:text-black"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-100 bg-white shadow-sm">
          <Link
            to="/home"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <Home size={18} />
            Home
          </Link>
          <Link
            to="/home/profile"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <User size={18} />
            Profile
          </Link>
          <Link
            to="/home/connections"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <Users size={18} />
            Connections
          </Link>
          <Link
            to="/home/connectionReq"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <UserPlus size={18} />
            Requests
          </Link>
          <Link
            to="/home/membership"
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <BadgeCheck size={18} />
            Membership
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 text-gray-700 hover:text-black"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
