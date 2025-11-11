import React, { useState } from "react";
import { gstService, einvoiceService } from "../../services/apiService";

export default function GST({ user }) {
  const [activeTab, setActiveTab] = useState("gstr1");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
  });
  const [gstrData, setGstrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGSTR1 = async () => {
    try {
      setLoading(true);
      const res = await gstService.gstr1(dateRange);
      if (res.data.success) {
        setGstrData(res.data);
      }
    } catch (err) {
      alert("Failed to fetch GSTR-1: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGSTR3B = async () => {
    try {
      setLoading(true);
      const res = await gstService.gstr3b(dateRange);
      if (res.data.success) {
        setGstrData(res.data);
      }
    } catch (err) {
      alert("Failed to fetch GSTR-3B: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type, format) => {
    try {
      const res = await gstService.export(type, format);
      if (format === "csv") {
        const blob = new Blob([res.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-${Date.now()}.csv`;
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-${Date.now()}.json`;
        a.click();
      }
    } catch (err) {
      alert("Failed to export: " + err.response?.data?.message);
    }
  };

  return (
    <div className="gst-page">
      <div className="page-header">
        <h2>GST Compliance</h2>
      </div>

      <div className="gst-tabs">
        <button
          className={activeTab === "gstr1" ? "active" : ""}
          onClick={() => setActiveTab("gstr1")}
        >
          GSTR-1
        </button>
        <button
          className={activeTab === "gstr3b" ? "active" : ""}
          onClick={() => setActiveTab("gstr3b")}
        >
          GSTR-3B
        </button>
        <button
          className={activeTab === "einvoice" ? "active" : ""}
          onClick={() => setActiveTab("einvoice")}
        >
          E-Invoice
        </button>
        <button
          className={activeTab === "ewaybill" ? "active" : ""}
          onClick={() => setActiveTab("ewaybill")}
        >
          E-Way Bill
        </button>
      </div>

      {activeTab === "gstr1" && (
        <div className="gst-content">
          <div className="date-range">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <button onClick={fetchGSTR1} className="btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Generate GSTR-1"}
            </button>
            {gstrData && (
              <>
                <button onClick={() => exportData("gstr1", "csv")} className="btn-secondary">Export CSV</button>
                <button onClick={() => exportData("gstr1", "json")} className="btn-secondary">Export JSON</button>
              </>
            )}
          </div>
          {gstrData && (
            <div className="gst-data">
              <pre>{JSON.stringify(gstrData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === "gstr3b" && (
        <div className="gst-content">
          <div className="date-range">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <button onClick={fetchGSTR3B} className="btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Generate GSTR-3B"}
            </button>
            {gstrData && (
              <>
                <button onClick={() => exportData("gstr3b", "csv")} className="btn-secondary">Export CSV</button>
                <button onClick={() => exportData("gstr3b", "json")} className="btn-secondary">Export JSON</button>
              </>
            )}
          </div>
          {gstrData && (
            <div className="gst-data">
              <pre>{JSON.stringify(gstrData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === "einvoice" && (
        <div className="gst-content">
          <p>E-Invoice generation will be available here. Select an invoice to generate e-Invoice (IRN).</p>
        </div>
      )}

      {activeTab === "ewaybill" && (
        <div className="gst-content">
          <p>E-Way Bill generation will be available here. Select an invoice to generate e-Way Bill.</p>
        </div>
      )}
    </div>
  );
}

