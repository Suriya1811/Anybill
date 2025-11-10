import React, { useState, useEffect } from "react";
import { inventoryService, warehouseService, productService } from "../../services/apiService";

export default function Inventory({ user }) {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ warehouseId: "", lowStock: false });

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
    fetchProducts();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      const params = {};
      if (filter.warehouseId) params.warehouseId = filter.warehouseId;
      if (filter.lowStock) params.lowStock = true;
      
      const res = await inventoryService.getAll(params);
      if (res.data.success) {
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseService.getAll();
      if (res.data.success) {
        setWarehouses(res.data.warehouses);
      }
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll();
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchLowStockAlerts = async () => {
    try {
      const res = await inventoryService.getLowStockAlerts();
      if (res.data.success) {
        setInventory(res.data.alerts);
      }
    } catch (err) {
      console.error("Failed to fetch low stock alerts:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h2>Inventory</h2>
        <div className="header-actions">
          <button onClick={fetchLowStockAlerts} className="btn-secondary">
            Low Stock Alerts
          </button>
        </div>
      </div>

      <div className="filters">
        <select
          value={filter.warehouseId}
          onChange={(e) => setFilter({ ...filter, warehouseId: e.target.value })}
        >
          <option value="">All Warehouses</option>
          {warehouses.map((wh) => (
            <option key={wh._id} value={wh._id}>{wh.name}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={filter.lowStock}
            onChange={(e) => setFilter({ ...filter, lowStock: e.target.checked })}
          />
          Show Low Stock Only
        </label>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Low Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No inventory found</td>
              </tr>
            ) : (
              inventory.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.productId?.name || "N/A"}</td>
                  <td>{inv.warehouseId?.name || "N/A"}</td>
                  <td>{inv.quantity || 0}</td>
                  <td>{inv.reservedQuantity || 0}</td>
                  <td>{(inv.quantity || 0) - (inv.reservedQuantity || 0)}</td>
                  <td>
                    {inv.isLowStock ? (
                      <span className="badge warning">Low Stock</span>
                    ) : (
                      <span className="badge success">OK</span>
                    )}
                  </td>
                  <td>
                    <button className="btn-sm">Adjust</button>
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

