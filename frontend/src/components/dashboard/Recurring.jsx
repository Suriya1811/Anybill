import React, { useState, useEffect } from "react";
import { recurringService, customerService } from "../../services/apiService";

export default function Recurring({ user }) {
  const [recurring, setRecurring] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRecurring();
    fetchCustomers();
  }, []);

  const fetchRecurring = async () => {
    try {
      const res = await recurringService.getAll();
      if (res.data.success) {
        setRecurring(res.data.recurring);
      }
    } catch (err) {
      console.error("Failed to fetch recurring invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAll();
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "pause") await recurringService.pause(id);
      else if (action === "resume") await recurringService.resume(id);
      else if (action === "cancel") await recurringService.cancel(id);
      else if (action === "generate") await recurringService.generate(id);
      fetchRecurring();
    } catch (err) {
      alert("Failed to perform action: " + err.response?.data?.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="recurring-page">
      <div className="page-header">
        <h2>Recurring Invoices</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "+ Create Recurring"}
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Customer</th>
              <th>Frequency</th>
              <th>Next Run</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurring.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No recurring invoices found</td>
              </tr>
            ) : (
              recurring.map((rec) => (
                <tr key={rec._id}>
                  <td>{rec.name}</td>
                  <td>{rec.customerId?.name || "N/A"}</td>
                  <td>{rec.frequency} ({rec.interval})</td>
                  <td>{new Date(rec.nextRunDate).toLocaleDateString()}</td>
                  <td>
                    {rec.status === "active" && <span className="badge success">Active</span>}
                    {rec.status === "paused" && <span className="badge warning">Paused</span>}
                    {rec.status === "cancelled" && <span className="badge">Cancelled</span>}
                  </td>
                  <td>
                    {rec.status === "active" && (
                      <>
                        <button onClick={() => handleAction(rec._id, "pause")} className="btn-sm">Pause</button>
                        <button onClick={() => handleAction(rec._id, "generate")} className="btn-sm">Generate</button>
                      </>
                    )}
                    {rec.status === "paused" && (
                      <button onClick={() => handleAction(rec._id, "resume")} className="btn-sm">Resume</button>
                    )}
                    <button onClick={() => handleAction(rec._id, "cancel")} className="btn-sm danger">Cancel</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

