import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchLessons as searchLessonsApi } from "../api/lessonApi";
import { searchBlogs } from "../api/blogApi";
import {
  Home,
  BookOpen,
  Newspaper,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Search,
  Loader2,
  Bell,
  Gift,
  MoreHorizontal,
  Clapperboard,
  CalendarCheck,
} from "lucide-react";
import logo from "../assets/img/logo.png";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isReminderPanelOpen, setIsReminderPanelOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [reminders, setReminders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const readReminders = () => {
    try {
      const data = JSON.parse(localStorage.getItem("studyReminders") || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      return undefined;
    }

    let isCurrentRequest = true;
    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        const [lessonResponse, blogResponse] = await Promise.all([
          searchLessonsApi(query),
          searchBlogs(query),
        ]);
        if (isCurrentRequest) {
          setSearchResults([
            ...(lessonResponse.data.lessons || []).map((lesson) => ({
              ...lesson,
              resultType: "lesson",
            })),
            ...(blogResponse.data.blogs || []).map((blog) => ({
              ...blog,
              resultType: "blog",
            })),
          ]);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setSearchResults([]);
        }
        console.error("Error searching lessons:", error);
      } finally {
        if (isCurrentRequest) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    const syncReminders = () => setReminders(readReminders());
    syncReminders();
    window.addEventListener("study-reminders-updated", syncReminders);

    return () => {
      window.removeEventListener("study-reminders-updated", syncReminders);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const formatReminderDate = (value) => {
    if (!value) return "Chưa cập nhật";

    const parsedDate = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Chưa cập nhật";
    }

    return parsedDate.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const reminderCount = reminders.length;

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: Home },
    { to: "/roadmap", label: "Lộ trình", icon: BookOpen },
  ];

  const moreLinks = [
    { to: "/my-courses", label: "Lời nhắc", icon: GraduationCap },
    { to: "/rewards", label: "Phần thưởng", icon: Gift },
    { to: "/attendance", label: "Chấm công", icon: CalendarCheck },
    { to: "/shorts", label: "Shorts", icon: Clapperboard },
    { to: "/blog", label: "Blog", icon: Newspaper },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tìm kiếm...
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500">
          Không tìm thấy bài học phù hợp.
        </div>
      );
    }

    return searchResults.map((result) => (
      <button
        key={`${result.resultType}-${result._id}`}
        type="button"
        onClick={() => {
          setSearchQuery("");
          setSearchResults([]);
          setIsSearchOpen(false);
          setIsMobileMenuOpen(false);
          navigate(
            result.resultType === "blog"
              ? `/blog/${result._id}`
              : `/learn/${result.courseId?._id}/${result._id}`,
          );
        }}
        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
      >
        <p className="font-semibold text-gray-800 truncate">{result.title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {result.resultType === "blog"
            ? "Blog"
            : result.courseId?.title || "Khóa học"}
        </p>
      </button>
    ));
  };

  return (
    <nav
      className={`site-nav sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7">
        <div className="flex items-center justify-between gap-3 h-16 md:h-20">
          <Link
            to="/"
            className="flex min-w-0 flex-shrink-0 items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <img src={logo} alt="NNH Academy Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-lg font-extrabold tracking-tight site-logo-name sm:text-xl">
                NNH Academy
              </span>
              <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500 sm:block">
                Học tập không giới hạn
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive(link.to)
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-600"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}

              <div className="more-menu-wrap">
                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                  className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    moreLinks.some((link) => isActive(link.to))
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <MoreHorizontal
                    className={`h-4 w-4 ${
                      moreLinks.some((link) => isActive(link.to))
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  />
                  Xem thêm
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isMoreMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMoreMenuOpen && (
                  <div className="more-menu-panel">
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`more-menu-item ${isActive(link.to) ? "active" : ""}`}
                          onClick={() => setIsMoreMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive("/admin/dashboard")
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                  }`}
                >
                  <LayoutDashboard
                    className={`h-4 w-4 ${
                      isActive("/admin/dashboard")
                        ? "text-purple-600"
                        : "text-gray-400 group-hover:text-purple-600"
                    }`}
                  />
                  Admin
                </Link>
              )}

              <div className="relative ml-2 w-52 xl:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Tìm bài học..."
                  aria-label="Tìm bài học"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                {isSearchOpen && searchQuery.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl bg-white shadow-xl border border-gray-100 z-50">
                    {renderSearchResults()}
                  </div>
                )}
              </div>

              <div className="ml-2 flex items-center gap-2 border-l border-gray-200/80 pl-2">
                <div
                  className="reminder-bell-wrap"
                  onMouseEnter={() => setIsReminderPanelOpen(true)}
                  onMouseLeave={() => setIsReminderPanelOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsReminderPanelOpen((prev) => !prev)}
                    className="reminder-bell-button"
                    aria-label="Danh sách lời nhắc"
                  >
                    <Bell className="h-4 w-4" />
                    {reminderCount > 0 && (
                      <span className="reminder-bell-count">{reminderCount}</span>
                    )}
                  </button>

                  {isReminderPanelOpen && (
                    <div className="reminder-panel">
                      <div className="reminder-panel-header">
                        <span>Lời nhắc</span>
                        <strong>{reminderCount}</strong>
                      </div>

                      {reminders.length === 0 ? (
                        <div className="reminder-panel-empty">Không có lời nhắc nào.</div>
                      ) : (
                        <div className="reminder-panel-list">
                          {reminders.map((item) => (
                            <div key={item.id} className="reminder-panel-item">
                              <p>{item.lessonName}</p>
                              <small>{formatReminderDate(item.dueDate)}</small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 transition-all duration-200 hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="hidden min-w-0 flex-col items-start xl:flex">
                        <span className="truncate text-sm font-semibold text-gray-700">
                          {user.name}
                        </span>
                        <span className="text-[10px] capitalize text-gray-500">
                          {user.role || "Học viên"}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl animate-slideDown">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <UserPlus className="h-4 w-4" />
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link to="/roadmap" className="site-nav-cta hidden sm:inline-flex">
            Xem lộ trình <span>→</span>
          </Link>

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
            <div className="relative px-1 pb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Tìm nhanh bài học..."
                aria-label="Tìm nhanh bài học"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
              {isSearchOpen && searchQuery.trim() && (
                <div className="mt-2 overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
                  {renderSearchResults()}
                </div>
              )}
            </div>
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

            {moreLinks.map((link) => {
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
                  <Icon className={`w-5 h-5 ${isActive(link.to) ? "text-blue-600" : "text-gray-400"}`} />
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

      <style>{`
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
        .more-menu-wrap {
          position: relative;
        }
        .more-menu-panel {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 220px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          padding: 8px;
          z-index: 60;
        }
        .more-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .more-menu-item:hover,
        .more-menu-item.active {
          background: #eef2ff;
          color: #1d4ed8;
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
