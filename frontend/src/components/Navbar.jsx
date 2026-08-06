import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Calendar,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import logo from "../assets/img/logo.png";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: Home },
    { to: "/courses", label: "Khóa học", icon: BookOpen },
    { to: "/my-courses", label: "Khóa học của tôi", icon: GraduationCap },
    { to: "/schedule", label: "Lịch học", icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={logo}
                alt="NNH Academy Logo"
                className="w-11 h-11 object-contain"
              />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NHH Academy
                </span>
              </span>
              <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">
                Học tập không giới hạn
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive(link.to)
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50/80"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive(link.to)
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  />
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className={`group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive("/admin/dashboard")
                    ? "text-purple-600 bg-purple-50/80"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50/80"
                }`}
              >
                <LayoutDashboard
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive("/admin/dashboard")
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-purple-600"
                  }`}
                />
                Admin
                {isActive("/admin/dashboard") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-purple-600 rounded-full"></span>
                )}
              </Link>
            )}

            {/* User Section */}
            <div className="ml-4 pl-4 border-l border-gray-200/60">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user.role || "Học viên"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100/80 py-2 animate-slideDown">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100/80 hover:text-blue-600 transition-all duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-200/60 space-y-1 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50/80"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive(link.to) ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive("/admin/dashboard")
                    ? "text-purple-600 bg-purple-50/80"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50/80"
                }`}
              >
                <LayoutDashboard
                  className={`w-5 h-5 ${
                    isActive("/admin/dashboard")
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                />
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 mt-2 border-t border-gray-200/60">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
