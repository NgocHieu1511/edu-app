import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Star,
  Clock,
  ChevronRight,
  MoreVertical,
  Download,
  RefreshCw,
  Loader2,
  UserPlus,
  BookPlus,
  Award,
  BarChart3,
  Settings,
  Bell,
  Filter,
  Eye,
} from "lucide-react";
import api from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    averageRating: 0,
    newUsersThisMonth: 0,
    newCoursesThisMonth: 0,
    activeUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      const statsRes = await api.get(
        `/admin/dashboard/stats?range=${timeRange}`,
      );
      setStats(statsRes.data);

      // Fetch recent activities
      const activitiesRes = await api.get("/admin/dashboard/activities");
      setRecentActivities(activitiesRes.data);

      console.log("Dashboard data loaded");
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    const load = async () => {
      await fetchDashboardData();
    };

    load();
  }, [fetchDashboardData]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get color for activity type
  const getActivityColor = (type) => {
    const colors = {
      user: "blue",
      course: "emerald",
      enrollment: "purple",
      payment: "amber",
      review: "rose",
    };
    return colors[type] || "gray";
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    const icons = {
      user: UserPlus,
      course: BookPlus,
      enrollment: GraduationCap,
      payment: DollarSign,
      review: Star,
    };
    return icons[type] || Bell;
  };

  // Stat cards configuration
  const statCards = [
    {
      id: "users",
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient:
        "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      subText: `${stats.newUsersThisMonth || 0} người mới tháng này`,
    },
    {
      id: "courses",
      title: "Tổng khóa học",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient:
        "from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      subText: `${stats.newCoursesThisMonth || 0} khóa học mới tháng này`,
    },
    {
      id: "enrollments",
      title: "Tổng lượt đăng ký",
      value: stats.totalEnrollments,
      icon: GraduationCap,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient:
        "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      subText: "Lượt đăng ký khóa học",
    },
    {
      id: "revenue",
      title: "Doanh thu",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      bgGradient:
        "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      subText: "Tổng doanh thu từ khóa học",
    },
    {
      id: "rating",
      title: "Đánh giá trung bình",
      value: stats.averageRating || 4.5,
      icon: Star,
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
      bgGradient:
        "from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/30",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      subText: "Trên 5 sao",
      suffix: " ★",
    },
    {
      id: "active",
      title: "Người dùng hoạt động",
      value: stats.activeUsers || 0,
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient:
        "from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      subText: "Người dùng hoạt động hôm nay",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: UserPlus,
      label: "Thêm người dùng",
      link: "/admin/users/create",
      color: "blue",
    },
    {
      icon: BookOpen,
      label: "Quản lý khóa học",
      link: "/admin/courses",
      color: "emerald",
    },
    {
      icon: BookPlus,
      label: "Thêm khóa học",
      link: "/admin/courses/add",
      color: "emerald",
    },
    {
      icon: Award,
      label: "Quản lý danh mục",
      link: "/admin/categories",
      color: "purple",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      link: "/admin/settings",
      color: "gray",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-7xl mb-4">😅</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Tổng quan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý và theo dõi hoạt động của hệ thống
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>

            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <button className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 p-6`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/20 dark:text-${stat.color}-400`}
                  >
                    {stat.subText}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {typeof stat.value === "number" && stat.value % 1 === 0
                      ? stat.value.toLocaleString()
                      : stat.value}
                    {stat.suffix || ""}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.title}
                  </p>
                </div>
                <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500`}
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.link}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon
                    className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Hoạt động gần đây
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Chưa có hoạt động nào
                </p>
              </div>
            ) : (
              recentActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const color = getActivityColor(activity.type);
                return (
                  <div
                    key={index}
                    className="px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div
                      className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 mr-4`}
                    >
                      <Icon
                        className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {recentActivities.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
              <Link
                to="/admin/activities"
                className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center justify-center gap-1"
              >
                Xem tất cả hoạt động
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
