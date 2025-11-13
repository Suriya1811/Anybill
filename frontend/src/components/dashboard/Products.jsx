import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "Uncategorized",
    hsn: "",
    sac: "",
    price: 0,
    cost: 0,
    taxRate: 18,
    taxType: "GST",
    unit: "Piece",
    stock: {
      quantity: 0,
      lowStockAlert: 10,
      trackInventory: false,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/billing/products");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("stock.")) {
      const stockField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        stock: {
          ...prev.stock,
          [stockField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/billing/products", formData);
      if (res.data.success) {
        alert("Product created successfully!");
        setShowForm(false);
        fetchProducts();
        setFormData({
          name: "",
          sku: "",
          description: "",
          category: "Uncategorized",
          hsn: "",
          sac: "",
          price: 0,
          cost: 0,
          taxRate: 18,
          taxType: "GST",
          unit: "Piece",
          stock: {
            quantity: 0,
            lowStockAlert: 10,
            trackInventory: false,
          },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/billing/products/${productId}`);
      if (res.data.success) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Products</h3>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
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
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-input"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  className="form-input"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost</label>
                <input
                  type="number"
                  className="form-input"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Type</label>
                <select
                  className="form-select"
                  name="taxType"
                  value={formData.taxType}
                  onChange={handleChange}
                >
                  <option value="GST">GST</option>
                  <option value="IGST">IGST</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">HSN Code</label>
                <input
                  type="text"
                  className="form-input"
                  name="hsn"
                  value={formData.hsn}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SAC Code</label>
                <input
                  type="text"
                  className="form-input"
                  name="sac"
                  value={formData.sac}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  className="form-select"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="Piece">Piece</option>
                  <option value="Kg">Kg</option>
                  <option value="Liter">Liter</option>
                  <option value="Meter">Meter</option>
                  <option value="Box">Box</option>
                  <option value="Pack">Pack</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="stock.trackInventory"
                  checked={formData.stock.trackInventory}
                  onChange={handleChange}
                />
                Track Inventory
              </label>
            </div>

            {formData.stock.trackInventory && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    name="stock.quantity"
                    value={formData.stock.quantity}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Low Stock Alert</label>
                  <input
                    type="number"
                    className="form-input"
                    name="stock.lowStockAlert"
                    value={formData.stock.lowStockAlert}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary">
              Create Product
            </button>
          </form>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Tax Rate</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  No products found. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.sku || "N/A"}</td>
                  <td>₹{product.price?.toLocaleString("en-IN")}</td>
                  <td>{product.taxRate}% ({product.taxType})</td>
                  <td>
                    {product.stock?.trackInventory
                      ? `${product.stock.quantity} ${product.unit}`
                      : "N/A"}
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn-action danger"
                        title="Delete Product"
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

