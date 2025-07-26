import React, { useState } from "react";
import { Eye, EyeOff, Heart, Code, Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../slices/useSlice";
import API_URL from "../utils/const";

const Login = ({ signup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
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
      const res = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      toast.success(res.data.message);
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="text-center pt-8 pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-gray-900 animate-pulse" />
            <Code className="h-7 w-7 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back to <span className="text-gray-700">Devmatch</span>
          </h2>
          <p className="text-gray-600 mt-1 text-sm italic">
            Let's reconnect through code.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Mail className="inline-block h-4 w-4 mr-1 text-gray-700" />
                Developer Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="developer@awesome.dev"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Lock className="inline-block h-4 w-4 mr-1 text-gray-700" />
                Secret Code
              </label>
              <div className="relative">
                <input
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 pr-10 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 cursor-pointer top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="h-10 w-full bg-black text-white cursor-pointer font-semibold rounded-md shadow-md hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5 animate-pulse" />
              <span>Start Matching</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Haven’t committed yet?{" "}
              <button
                onClick={signup}
                className="text-gray-800 cursor-pointer hover:underline font-medium"
              >
                git init signup
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
