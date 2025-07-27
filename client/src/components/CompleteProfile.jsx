import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Code,
  Github,
  Linkedin,
  Globe,
  Camera,
  Save,
} from "lucide-react";
import InputWrapper from "./InputWrapper";
import axios from "axios";
import API_URL from "../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/useSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const CompleteProfile = () => {
  const user = useSelector((store) => store.user);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    bio: "",
    location: "",
    profileImage: "",
    techStack: "",
    github: "",
    linkedin: "",
    portfolio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        gender: user.gender || "",
        age: user.age || "",
        bio: user.bio || "",
        location: user.location || "",
        profileImage: user.profileImage || "",
        techStack: user.techStack || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        portfolio: user.portfolio || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("gender", formData.gender);
    form.append("age", formData.age);
    form.append("bio", formData.bio);
    form.append("location", formData.location);
    form.append("techStack", formData.techStack);
    form.append("github", formData.github);
    form.append("linkedin", formData.linkedin);
    form.append("portfolio", formData.portfolio);
    if (file) form.append("profile", file);
    try {
      const res = await axios.patch(`${API_URL}/profile/edit`, form, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch(addUser(res.data.data));
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const completedFields = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-5xl shadow-md space-y-10"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-500 text-base sm:text-lg">
            Build your developer presence
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center border-b border-gray-300 pb-2">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              Personal Information
            </h3>

            <InputWrapper Icon={User} label="Full Name">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
              />
            </InputWrapper>

            <InputWrapper Icon={User} label="Gender">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 outline-none text-base sm:text-lg cursor-pointer"
              >
                <option value="" className="bg-white text-gray-700">
                  Select Gender
                </option>
                <option value="Male" className="bg-white text-gray-700">
                  👨 Male
                </option>
                <option value="Female" className="bg-white text-gray-700">
                  👩 Female
                </option>
                <option value="Other" className="bg-white text-gray-700">
                  🏳️‍🌈 Other
                </option>
              </select>
            </InputWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputWrapper Icon={User} label="Age">
                <input
                  type="text"
                  name="age"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
                />
              </InputWrapper>

              <InputWrapper Icon={MapPin} label="Location">
                <input
                  type="text"
                  name="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
                />
              </InputWrapper>
            </div>

            <InputWrapper Icon={User} label="Bio">
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg resize-none"
              />
            </InputWrapper>

            <InputWrapper Icon={Camera} label="Profile Picture">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    const imageUrl = URL.createObjectURL(selectedFile);
                    setFormData((prev) => ({
                      ...prev,
                      profileImage: imageUrl,
                    }));
                  }
                }}
                className="w-full text-sm text-gray-800"
              />
              {file && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected Image Preview:
                  </p>
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </InputWrapper>
          </div>

          {/* Professional Info */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center border-b border-gray-300 pb-2">
              <Code className="w-5 h-5 mr-2 text-gray-400" />
              Professional Information
            </h3>

            <InputWrapper Icon={Code} label="Tech Stack">
              <input
                type="text"
                name="techStack"
                placeholder="React, Node.js, Python..."
                value={formData.techStack}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
              />
            </InputWrapper>

            <InputWrapper Icon={Github} label="GitHub Profile">
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
              />
            </InputWrapper>

            <InputWrapper Icon={Linkedin} label="LinkedIn Profile">
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
              />
            </InputWrapper>

            <InputWrapper Icon={Globe} label="Portfolio Website">
              <input
                type="url"
                name="portfolio"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base sm:text-lg"
              />
            </InputWrapper>

            {/* Progress */}
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 mt-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Profile Completion
              </h4>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedFields / totalFields) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-right text-gray-500">
                {completedFields}/{totalFields} fields completed
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200">
          <button
            disabled={loading}
            type="submit"
            className="group w-full py-3 sm:py-4 bg-black text-white rounded-xl font-semibold text-lg sm:text-xl shadow-md hover:scale-[1.02] transition-transform duration-300 hover:bg-gray-900"
          >
            <span className="flex justify-center items-center">
              <Save className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              {loading ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
