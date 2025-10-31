import React from "react";
import {
  FaUsers,
  FaBox,
  FaEye,
  FaList,
  FaStar,
  FaBuilding,
  FaClipboardList,
  FaComments,
  FaChartLine,
  FaChartBar,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user || user.role !== "super_admin") return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: "#ffffff" }}>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add User Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/user-management")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#d4af37" }}
              >
                <FaPlus />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                Add New User
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#d4af37" }}>
              <FaUsers />
            </div>
          </div>
        </div>

        {/* See Products Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/products")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#b8860b" }}
              >
                <FaEye />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                View Products
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#b8860b" }}>
              <FaBox />
            </div>
          </div>
        </div>

        {/* See Reviews Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/reviews")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#ffd700" }}
              >
                <FaList />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                View Reviews
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#ffd700" }}>
              <FaStar />
            </div>
          </div>
        </div>

        {/* See Stores Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/store-analytics")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#daa520" }}
              >
                <FaEye />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                View Stores
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#daa520" }}>
              <FaBuilding />
            </div>
          </div>
        </div>

        {/* See Comments Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/comments")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#ff8c00" }}
              >
                <FaClipboardList />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                View Comments
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#ff8c00" }}>
              <FaComments />
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div
          className="shadow rounded-lg p-6 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: "#1d1d1d" }}
          onClick={() => navigate("/super-admin-dashboard/analytics")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#f4e4bc" }}
              >
                <FaChartLine />
              </div>
              <div className="text-sm" style={{ color: "#cccccc" }}>
                View Analytics
              </div>
            </div>
            <div className="text-4xl" style={{ color: "#f4e4bc" }}>
              <FaChartBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
