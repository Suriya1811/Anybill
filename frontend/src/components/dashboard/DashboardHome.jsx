import React, { useState, useEffect } from "react";
import { statsService } from "../../services/apiService";
import "../../styles/dashboard.css";

export default function DashboardHome({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const today = new Date();
      let startDate, endDate = today.toISOString().split("T")[0];

      switch (dateRange) {
        case "today":
          startDate = today.toISOString().split("T")[0];
          break;
        case "week":
          startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];
          break;
        case "month":
          startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split("T")[0];
          break;
        case "year":
          startDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split("T")[0];
          break;
        default:
          startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split("T")[0];
      }

      const res = await statsService.getStats({ startDate, endDate });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-home">
      {/* Date Range Selector */}
      <div className="date-range-selector">
        <button
          className={dateRange === "today" ? "active" : ""}
          onClick={() => setDateRange("today")}
        >
          Today
        </button>
        <button
          className={dateRange === "week" ? "active" : ""}
          onClick={() => setDateRange("week")}
        >
          This Week
        </button>
        <button
          className={dateRange === "month" ? "active" : ""}
          onClick={() => setDateRange("month")}
        >
          This Month
        </button>
        <button
          className={dateRange === "year" ? "active" : ""}
          onClick={() => setDateRange("year")}
        >
          This Year
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
            <span className="stat-label">Total sales</span>
          </div>
        </div>

        <div className="stat-card invoices">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Total Invoices</h3>
            <p className="stat-value">{stats?.totalInvoices || 0}</p>
            <span className="stat-label">
              {stats?.paidInvoices || 0} paid, {stats?.pendingInvoices || 0} pending
            </span>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats?.totalCustomers || 0}</p>
            <span className="stat-label">Active customers</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Amount</h3>
            <p className="stat-value">₹{stats?.totalPending?.toLocaleString() || 0}</p>
            <span className="stat-label">Outstanding receivables</span>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats?.totalProducts || 0}</p>
            <span className="stat-label">In catalog</span>
          </div>
        </div>

        <div className="stat-card sales">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">₹{stats?.totalSales?.toLocaleString() || 0}</p>
            <span className="stat-label">All time</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = "/dashboard?tab=invoices&action=create"}>
            <span className="action-icon">➕</span>
            <span>Create Invoice</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = "/dashboard?tab=customers&action=create"}>
            <span className="action-icon">👤</span>
            <span>Add Customer</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = "/dashboard?tab=products&action=create"}>
            <span className="action-icon">📦</span>
            <span>Add Product</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = "/dashboard?tab=reports"}>
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Invoices</h2>
        <div className="activity-list">
          <p className="empty-state">Recent invoices will appear here</p>
        </div>
      </div>
    </div>
  );
}
