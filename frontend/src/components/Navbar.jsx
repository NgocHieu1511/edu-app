import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
          >
            <span className="text-blue-600">📘</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Trang chủ
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Khóa học
            </Link>
            <Link
              to="/my-courses"
              className="text-gray-700 hover:text-blue-600"
            >
              Khóa học của tôi
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center gap-3 ml-4">
              {user ? (
                <>
                  <span className="font-medium text-gray-700">
                    Xin chào, {user.name}
                  </span>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.reload();
                    }}
                    className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-200/60 space-y-3 animate-fadeIn">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-2 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
            >
              Trang chủ
            </Link>
            <Link
              to="/courses"
              onClick={closeMobileMenu}
              className="block py-2 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
            >
              Khóa học
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="text-center py-2 font-medium text-gray-700">
                    Xin chào, {user.name}
                  </div>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.reload();
                    }}
                    className="block text-center px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block text-center px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block text-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm hover:shadow transition"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Thêm animation cho mobile menu */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
