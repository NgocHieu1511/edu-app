import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  console.log("AdminDashboard rendered");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
        console.log("Dashboard data:", res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Trang quản trị</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Tổng người dùng */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-center border border-gray-100">
          <h5 className="text-lg font-medium text-gray-500 mb-2">
            Tổng người dùng
          </h5>
          <h2 className="text-4xl font-extrabold text-blue-600">
            {stats.totalUsers}
          </h2>
        </div>

        {/* Card Tổng khóa học */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-center border border-gray-100">
          <h5 className="text-lg font-medium text-gray-500 mb-2">
            Tổng khóa học
          </h5>
          <h2 className="text-4xl font-extrabold text-green-600">
            {stats.totalCourses}
          </h2>
        </div>

        {/* Card Tổng lượt đăng ký */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-center border border-gray-100">
          <h5 className="text-lg font-medium text-gray-500 mb-2">
            Tổng lượt đăng ký
          </h5>
          <h2 className="text-4xl font-extrabold text-purple-600">
            {stats.totalEnrollments}
          </h2>
        </div>

        <Link
          to="/admin/courses"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Quản lý khóa học
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
