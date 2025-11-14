import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/dashboard.css";
import { FiSun, FiMoon } from "react-icons/fi";
import DashboardHome from "../components/dashboard/DashboardHome";
import Invoices from "../components/dashboard/Invoices";
import Customers from "../components/dashboard/Customers";
import Products from "../components/dashboard/Products";
import Warehouses from "../components/dashboard/Warehouses";
import Inventory from "../components/dashboard/Inventory";
import Recurring from "../components/dashboard/Recurring";
import Purchases from "../components/dashboard/Purchases";
import Reports from "../components/dashboard/Reports";
import GST from "../components/dashboard/GST";
import Marketing from "../components/dashboard/Marketing";
import Loyalty from "../components/dashboard/Loyalty";
import Settings from "../components/dashboard/Settings";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout: authLogout, user: authUser, checkAuth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (!userData.isProfileComplete) {
      navigate("/complete-profile");
      return;
    }

    setUser(userData);
    setLoading(false);
    
    // Fetch updated user data
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const logout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authLogout(); // Use AuthContext logout
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>MyBillPro</h2>
          <p className="business-name">{user.businessName}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "invoices" ? "active" : ""}`}
            onClick={() => setActiveTab("invoices")}
          >
            📄 Invoices
          </button>
          <button
            className={`nav-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            👥 Customers
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </button>
          <button
            className={`nav-item ${activeTab === "warehouses" ? "active" : ""}`}
            onClick={() => setActiveTab("warehouses")}
          >
            🏢 Warehouses
          </button>
          <button
            className={`nav-item ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            📊 Inventory
          </button>
          <button
            className={`nav-item ${activeTab === "recurring" ? "active" : ""}`}
            onClick={() => setActiveTab("recurring")}
          >
            🔄 Recurring
          </button>
          <button
            className={`nav-item ${activeTab === "purchases" ? "active" : ""}`}
            onClick={() => setActiveTab("purchases")}
          >
            🛒 Purchases
          </button>
          <button
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            📈 Reports
          </button>
          <button
            className={`nav-item ${activeTab === "gst" ? "active" : ""}`}
            onClick={() => setActiveTab("gst")}
          >
            🧾 GST
          </button>
          <button
            className={`nav-item ${activeTab === "marketing" ? "active" : ""}`}
            onClick={() => setActiveTab("marketing")}
          >
            📢 Marketing
          </button>
          <button
            className={`nav-item ${activeTab === "loyalty" ? "active" : ""}`}
            onClick={() => setActiveTab("loyalty")}
          >
            🎁 Loyalty
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle" title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            <span className="theme-toggle-icon">
              {theme === "light" ? <FiMoon/> : <FiSun/>}
            </span>
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-phone">{user.phone}</p>
          </div>
          <button onClick={logout} className="logout-btn-sidebar">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>
            {activeTab === "home" && "Dashboard"}
            {activeTab === "invoices" && "Invoices"}
            {activeTab === "customers" && "Customers"}
            {activeTab === "products" && "Products"}
            {activeTab === "warehouses" && "Warehouses"}
            {activeTab === "inventory" && "Inventory"}
            {activeTab === "recurring" && "Recurring Invoices"}
            {activeTab === "purchases" && "Purchases"}
            {activeTab === "reports" && "Reports"}
            {activeTab === "gst" && "GST Compliance"}
            {activeTab === "marketing" && "Marketing"}
            {activeTab === "loyalty" && "Loyalty Program"}
            {activeTab === "settings" && "Settings"}
          </h1>
        </header>

        <div className="dashboard-content">
          {activeTab === "home" && <DashboardHome user={user} onNavigate={setActiveTab} />}
          {activeTab === "invoices" && <Invoices user={user} />}
          {activeTab === "customers" && <Customers user={user} />}
          {activeTab === "products" && <Products user={user} />}
          {activeTab === "warehouses" && <Warehouses user={user} />}
          {activeTab === "inventory" && <Inventory user={user} />}
          {activeTab === "recurring" && <Recurring user={user} />}
          {activeTab === "purchases" && <Purchases user={user} />}
          {activeTab === "reports" && <Reports user={user} />}
          {activeTab === "gst" && <GST user={user} />}
          {activeTab === "marketing" && <Marketing user={user} />}
          {activeTab === "loyalty" && <Loyalty user={user} />}
          {activeTab === "settings" && <Settings user={user} onUpdate={fetchUserData} />}
        </div>
      </main>
    </div>
  );
}
