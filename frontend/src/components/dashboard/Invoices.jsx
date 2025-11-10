import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Invoices({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [{ name: "", quantity: 1, price: 0, taxRate: 18, taxType: "GST" }],
    discount: 0,
    discountType: "fixed",
    notes: "",
    terms: "",
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/api/billing/invoices");
      if (res.data.success) {
        setInvoices(res.data.invoices);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/billing/customers");
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/billing/products");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // If product selected, auto-fill details
    if (field === "productId" && value) {
      const product = products.find(p => p._id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          name: product.name,
          price: product.price,
          taxRate: product.taxRate,
          taxType: product.taxType,
          hsn: product.hsn,
          sac: product.sac,
          unit: product.unit,
        };
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0, taxRate: 18, taxType: "GST" }],
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/billing/invoices", formData);
      if (res.data.success) {
        alert("Invoice created successfully!");
        setShowForm(false);
        fetchInvoices();
        setFormData({
          customerId: "",
          invoiceDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          items: [{ name: "", quantity: 1, price: 0, taxRate: 18, taxType: "GST" }],
          discount: 0,
          discountType: "fixed",
          notes: "",
          terms: "",
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create invoice");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: "#00c27a",
      partial: "#ffa500",
      sent: "#3ad6ff",
      draft: "#94a3b8",
      overdue: "#ff5959",
      cancelled: "#666",
    };
    return colors[status] || "var(--text-tertiary)";
  };

  if (loading) {
    return <div style={{ color: "var(--text-primary)", padding: "20px" }}>Loading invoices...</div>;
  }

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Invoices</h3>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Create Invoice"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                className="form-select"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Invoice Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Items *</label>
              {formData.items.map((item, index) => (
                <div key={index} style={{ marginBottom: "16px", padding: "16px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: "12px", marginBottom: "12px" }}>
                    <select
                      className="form-select"
                      value={item.productId || ""}
                      onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                      style={{ fontSize: "0.9rem" }}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                      min="0.01"
                      step="0.01"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Tax %"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, "taxRate", parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      style={{ fontSize: "0.9rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{ background: "var(--error-color)", color: "white", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <select
                      className="form-select"
                      value={item.taxType}
                      onChange={(e) => handleItemChange(index, "taxType", e.target.value)}
                      style={{ fontSize: "0.9rem" }}
                    >
                      <option value="GST">GST</option>
                      <option value="IGST">IGST</option>
                      <option value="None">None</option>
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="HSN/SAC"
                      value={item.hsn || item.sac || ""}
                      onChange={(e) => handleItemChange(index, item.taxType === "GST" ? "hsn" : "sac", e.target.value)}
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={addItem}>
                Add Item
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Discount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <select
                  className="form-select"
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Create Invoice
            </button>
          </form>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                  No invoices found. Create your first invoice!
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerDetails?.name || "N/A"}</td>
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>₹{invoice.total?.toLocaleString("en-IN")}</td>
                  <td>₹{invoice.paidAmount?.toLocaleString("en-IN") || 0}</td>
                  <td>₹{invoice.balance?.toLocaleString("en-IN") || 0}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: getStatusColor(invoice.status) + "20",
                        color: getStatusColor(invoice.status),
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      {invoice.status?.toUpperCase()}
                    </span>
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

