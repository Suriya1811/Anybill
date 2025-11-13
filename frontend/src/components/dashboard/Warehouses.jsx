import React, { useState, useEffect } from "react";
import { warehouseService } from "../../services/apiService";

export default function Warehouses({ user }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: { street: "", city: "", state: "", pincode: "", country: "India" },
    contact: { phone: "", email: "", managerName: "" },
    isDefault: false
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getAll();
      if (res.data.success) {
        setWarehouses(res.data.warehouses);
      }
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await warehouseService.create(formData);
      setShowForm(false);
      setFormData({
        name: "",
        code: "",
        address: { street: "", city: "", state: "", pincode: "", country: "India" },
        contact: { phone: "", email: "", managerName: "" },
        isDefault: false
      });
      fetchWarehouses();
    } catch (err) {
      alert("Failed to create warehouse: " + err.response?.data?.message);
    }
  };

  const handleDelete = async (warehouseId) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await warehouseService.delete(warehouseId);
        fetchWarehouses();
      } catch (err) {
        alert('Failed to delete warehouse: ' + err.response?.data?.message);
      }
    }
  };

  const handleSetDefault = async (warehouseId) => {
    try {
      await warehouseService.setDefault(warehouseId);
      fetchWarehouses();
    } catch (err) {
      alert('Failed to set default warehouse: ' + err.response?.data?.message);
    }
  };

  const handleToggleStatus = async (warehouseId, currentStatus) => {
    try {
      await warehouseService.update(warehouseId, { isActive: !currentStatus });
      fetchWarehouses();
    } catch (err) {
      alert('Failed to update warehouse status: ' + err.response?.data?.message);
    }
  };


  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="warehouses-page">
      <div className="page-header">
        <h2>Warehouses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "+ Add Warehouse"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Add New Warehouse</h3>
          <div className="form-grid">
            <div>
              <label>Warehouse Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label>Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
              />
            </div>
            <div>
              <label>City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
              />
            </div>
            <div>
              <label>State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
              />
            </div>
            <div>
              <label>Pincode</label>
              <input
                type="text"
                value={formData.address.pincode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, pincode: e.target.value }
                })}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="text"
                value={formData.contact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                Set as Default
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Warehouse</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No warehouses found</td>
              </tr>
            ) : (
              warehouses.map((wh) => (
                <tr key={wh._id}>
                  <td>{wh.name}</td>
                  <td>{wh.code || "-"}</td>
                  <td>{wh.address?.city || "-"}, {wh.address?.state || "-"}</td>
                  <td>{wh.contact?.phone || "-"}</td>
                  <td>
                    {wh.isDefault && <span className="badge">Default</span>}
                    {wh.isActive ? <span className="badge success">Active</span> : <span className="badge">Inactive</span>}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-action danger" onClick={() => handleDelete(wh._id)}>
                        Delete
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

