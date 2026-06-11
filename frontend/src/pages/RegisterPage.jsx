import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await register(formData);

      alert(res.data.message || "Đăng ký thành công");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Đăng ký</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-3 rounded w-full"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
