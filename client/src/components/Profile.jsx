import React from "react";
import {
  User,
  Mail,
  MapPin,
  Code,
  Github,
  Linkedin,
  Globe,
  Calendar,
  Star,
  Activity,
  Pencil,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

// ...unchanged imports...

const Profile = () => {
  const user = useSelector((store) => store.user);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br max-w-6xl mx-auto  text-gray-900 relative overflow-hidden">
      {/* Neutral background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative dots with gray/black */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-500 rounded-full opacity-40 animate-ping" />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-35 animate-pulse" />
        <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-gray-600 rounded-full opacity-25 animate-ping" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PROFILE
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-800 to-gray-600 mt-2 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-lg">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700 font-medium">ONLINE</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Profile Image */}
            <div className="relative group w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl" />
              <div className="absolute inset-1 bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src={user?.profileImage || "https://geographyandyou.com/images/user-profile.png"}
                  alt={user?.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-gray-900">
                    {user?.name}
                  </h2>
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <Link
                  to="/home/complete-profile"
                  className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>

              <p className="text-gray-600 text-lg mb-6 uppercase tracking-wide font-medium">
                {user?.bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user?.location && <Info label="Location" value={user?.location} icon={<MapPin />} />}
                {user?.createdAt && <Info label="Joined" value={formatDate(user?.createdAt)} icon={<Calendar />} />}
                {user?.age && <Info label="Age" value={`${user?.age} YEARS`} icon={<User />} />}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Contact" icon={<Mail />} iconColor="bg-black">
            <Info label="Email" value={user?.email} icon={<Mail />} small />
            <Info label="Gender" value={user?.gender} icon={<User />} small />
          </Card>

          {user?.techStack?.[0] && (
            <Card title="Tech Stack" icon={<Code />} iconColor="bg-gray-700">
              <div className="flex flex-wrap gap-2">
                {user.techStack[0].split(" ").map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-300 transition-all duration-200"
                  >
                    {tech.toUpperCase()}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {(user?.github || user?.linkedin || user?.portfolio) && (
            <Card title="Links" icon={<Globe />} iconColor="bg-gray-800">
              {user?.github && <LinkItem icon={<Github />} label="GitHub" href={user.github} />}
              {user?.linkedin && <LinkItem icon={<Linkedin />} label="LinkedIn" href={user.linkedin} />}
              {user?.portfolio && <LinkItem icon={<Globe />} label="Portfolio" href={user.portfolio} />}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const Info = ({ label, value, icon, small }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-700">{icon}</div>
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className={`text-gray-900 ${small ? "text-sm" : "font-semibold"}`}>
        {value}
      </div>
    </div>
  </div>
);

const Card = ({ title, icon, children, iconColor = "bg-gray-500" }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center shadow-md`}
      >
        {React.cloneElement(icon, { className: "w-5 h-5 text-white" })}
      </div>
      <h3 className="text-xl font-bold uppercase tracking-wide text-gray-900">
        {title}
      </h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const LinkItem = ({ icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-gray-100 group"
  >
    {React.cloneElement(icon, {
      className:
        "w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors",
    })}
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className="text-gray-900 text-sm break-all font-medium group-hover:text-blue-600 transition-colors">
        {href}
      </div>
    </div>
  </a>
);

export default Profile;
