import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Reports({ user }) {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      const [statsRes, invoicesRes] = await Promise.all([
        api.get("/api/billing/stats", {
          params: dateRange,
        }),
        api.get("/api/billing/invoices", {
          params: dateRange,
        }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (invoicesRes.data.success) {
        setInvoices(invoicesRes.data.invoices);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Reports & Analytics</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Sales</p>
          <p className="stat-value">₹{stats?.totalSales?.toLocaleString("en-IN") || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Amount</p>
          <p className="stat-value">₹{stats?.totalPending?.toLocaleString("en-IN") || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Paid Invoices</p>
          <p className="stat-value">{stats?.paidInvoices || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Invoices</p>
          <p className="stat-value">{stats?.pendingInvoices || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Invoices</p>
          <p className="stat-value">{stats?.totalInvoices || 0}</p>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="card-title" style={{ marginBottom: "20px" }}>Recent Invoices</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 10).map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerDetails?.name || "N/A"}</td>
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td>₹{invoice.total?.toLocaleString("en-IN")}</td>
                  <td>{invoice.status?.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

