import { useState } from "react";
import { Eye, EyeOff, Heart, Code, Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router"; // React Router
import API_URL from "../utils/const";

const Signup = ({ login }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // React Router navigation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      navigate("/home/complete-profile"); // React Router redirect
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="text-center pt-8 pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-gray-900" />
            <Code className="h-7 w-7 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create your <span className="text-gray-700">Devmatch</span> Account
          </h2>
          <p className="text-gray-600 mt-1 text-sm italic">
            Connect through code.
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <User className="inline-block h-4 w-4 mr-1 text-gray-700" />
                Developer Name
              </label>
              <input
                value={formData.name}
                name="name"
                onChange={handleChange}
                type="text"
                id="name"
                placeholder="const yourName = ''"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Mail className="inline-block h-4 w-4 mr-1 text-gray-700" />
                Developer Email
              </label>
              <input
                value={formData.email}
                name="email"
                onChange={handleChange}
                type="email"
                id="email"
                placeholder="developer@awesome.dev"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Lock className="inline-block h-4 w-4 mr-1 text-gray-700" />
                Create Password
              </label>
              <div className="relative">
                <input
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="process.env.SIGNUP_KEY"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="h-10 w-full bg-black cursor-pointer text-white font-semibold rounded-md shadow-md hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Code className="h-5  w-5" />
              <span>Join Devmatch</span>
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already committed?{" "}
              <button
                onClick={login}
                className="text-gray-800 cursor-pointer hover:underline font-medium"
              >
                git checkout login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
