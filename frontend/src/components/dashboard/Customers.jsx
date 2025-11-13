import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Customers({ user }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    creditLimit: 0,
    notes: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/billing/customers");
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/billing/customers", formData);
      if (res.data.success) {
        alert("Customer created successfully!");
        setShowForm(false);
        fetchCustomers();
        setFormData({
          name: "",
          phone: "",
          email: "",
          gstin: "",
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          },
          creditLimit: 0,
          notes: "",
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create customer");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/billing/customers/${customerId}`);
      if (res.data.success) {
        alert('Customer deleted successfully!');
        fetchCustomers(); // Refresh the list
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Customers</h3>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Customer"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">GSTIN</label>
                <input
                  type="text"
                  className="form-input"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  maxLength="15"
                  placeholder="Enter GSTIN (15 characters)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street Address"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px" }}>
                <input
                  type="text"
                  className="form-input"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <input
                  type="text"
                  className="form-input"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
                <input
                  type="text"
                  className="form-input"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Credit Limit</label>
              <input
                type="number"
                className="form-input"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Create Customer
            </button>
          </form>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Balance</th>
              <th>GSTIN</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  No customers found. Add your first customer!
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email || "N/A"}</td>
                  <td>₹{customer.balance?.toLocaleString("en-IN") || 0}</td>
                  <td>{customer.gstin || "N/A"}</td>
                  <td>{customer.address?.city || "N/A"}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="btn-action danger"
                        title="Delete Customer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
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

