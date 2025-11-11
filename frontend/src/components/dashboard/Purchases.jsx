import React, { useState, useEffect } from "react";
import { purchaseService, supplierService } from "../../services/apiService";

export default function Purchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await purchaseService.getAll();
      if (res.data.success) {
        setPurchases(res.data.purchases);
      }
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierService.getAll();
      if (res.data.success) {
        setSuppliers(res.data.suppliers);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="purchases-page">
      <div className="page-header">
        <h2>Purchases</h2>
        <div className="header-actions">
          <button onClick={() => window.location.href = "/dashboard?tab=suppliers"} className="btn-secondary">
            Manage Suppliers
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Purchase"}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Purchase #</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No purchases found</td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{purchase.purchaseNumber}</td>
                  <td>{purchase.supplierDetails?.name || "N/A"}</td>
                  <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                  <td>₹{purchase.total?.toLocaleString()}</td>
                  <td>₹{purchase.paidAmount?.toLocaleString() || 0}</td>
                  <td>₹{purchase.balance?.toLocaleString() || 0}</td>
                  <td>
                    {purchase.status === "paid" && <span className="badge success">Paid</span>}
                    {purchase.status === "partial" && <span className="badge warning">Partial</span>}
                    {purchase.status === "draft" && <span className="badge">Draft</span>}
                  </td>
                  <td>
                    <button className="btn-sm">View</button>
                    <button className="btn-sm">Payment</button>
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

