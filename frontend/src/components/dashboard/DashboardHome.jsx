import React, { useState, useEffect } from "react";
import { statsService } from "../../services/apiService";
import "../../styles/dashboard.css";

export default function DashboardHome({ user, onNavigate }) {
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
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split("T")[0];
          break;
        case "month":
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().split("T")[0];
          break;
        case "year":
          const yearAgo = new Date();
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          startDate = yearAgo.toISOString().split("T")[0];
          break;
        default:
          const defaultMonthAgo = new Date();
          defaultMonthAgo.setMonth(defaultMonthAgo.getMonth() - 1);
          startDate = defaultMonthAgo.toISOString().split("T")[0];
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
        <div className="quick-actions-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => onNavigate && onNavigate('invoices')}>
            <span className="action-icon">➕</span>
            <span>Create Invoice</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate && onNavigate('customers')}>
            <span className="action-icon">👤</span>
            <span>Add Customer</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate && onNavigate('products')}>
            <span className="action-icon">📦</span>
            <span>Add Product</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate && onNavigate('reports')}>
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Alerts & Notifications */}
      {stats?.lowStockAlerts?.length > 0 && (
        <div className="alerts-section">
          <h2>⚠️ Low Stock Alerts</h2>
          <div className="alerts-grid">
            {stats.lowStockAlerts.map((alert, idx) => (
              <div key={idx} className="alert-card warning">
                <h4>{alert.name}</h4>
                <p>
                  Current Stock: <strong>{alert.currentStock} {alert.unit}</strong>
                </p>
                <p className="text-sm">
                  Alert Level: {alert.lowStockAlert} {alert.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Reminders */}
      {stats?.paymentReminders?.length > 0 && (
        <div className="alerts-section">
          <h2>💰 Payment Reminders (Overdue)</h2>
          <div className="reminders-list">
            {stats.paymentReminders.map((reminder, idx) => (
              <div key={reminder.invoiceId || idx} className="reminder-card overdue">
                <div className="reminder-header">
                  <h4>Invoice #{reminder.invoiceNumber || 'N/A'}</h4>
                  <span className="days-overdue">{reminder.daysOverdue || 0} days overdue</span>
                </div>
                <div className="reminder-details">
                  <p><strong>{reminder.customer?.name || 'Unknown Customer'}</strong></p>
                  <p>{reminder.customer?.phone || 'N/A'}</p>
                  <p>Amount Due: ₹{(reminder.balance || 0).toLocaleString()}</p>
                  <p className="text-sm">
                    Due Date: {reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Customers & Products */}
      <div className="insights-grid">
        {stats?.topCustomers?.length > 0 && (
          <div className="insight-section">
            <h2>🏆 Top Customers</h2>
            <div className="top-list">
              {stats.topCustomers.slice(0, 5).map((customer, idx) => (
                <div key={customer.customerId || idx} className="top-item">
                  <div className="rank">{idx + 1}</div>
                  <div className="top-details">
                    <h4>{customer.name || 'Unknown'}</h4>
                    <p>Total Purchases: ₹{(customer.totalPurchases || 0).toLocaleString()}</p>
                    <p className="text-sm">{customer.invoiceCount || 0} invoices</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats?.topProducts?.length > 0 && (
          <div className="insight-section">
            <h2>⭐ Top Selling Products</h2>
            <div className="top-list">
              {stats.topProducts.slice(0, 5).map((product, idx) => (
                <div key={product.productId || idx} className="top-item">
                  <div className="rank">{idx + 1}</div>
                  <div className="top-details">
                    <h4>{product.name || 'Unknown Product'}</h4>
                    <p>Revenue: ₹{(product.revenue || 0).toLocaleString()}</p>
                    <p className="text-sm">{product.quantitySold || 0} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      {stats?.summary && (
        <div className="summary-section">
          <h2>📊 Summary Insights</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Avg Invoice Value</h4>
              <p className="summary-value">₹{stats.summary.avgInvoiceValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="summary-card">
              <h4>Avg Payment Time</h4>
              <p className="summary-value">{stats.summary.avgPaymentTime} days</p>
            </div>
            <div className="summary-card">
              <h4>Collection Rate</h4>
              <p className="summary-value">{stats.summary.collectionRate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
