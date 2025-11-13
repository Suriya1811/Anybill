import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/invoice-preview.css';

const InvoicePreview = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const template = searchParams.get('template') || 'A4_CLASSIC';
  
  const [invoiceHTML, setInvoiceHTML] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchInvoicePreview();
  }, [id, template]);

  const fetchInvoicePreview = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `${API_URL}/api/billing/invoices/${id}/preview?template=${template}`
      );
      
      setInvoiceHTML(response.data);
    } catch (err) {
      console.error('Failed to load invoice preview:', err);
      setError(err.response?.data?.message || 'Failed to load invoice. Please check the link or contact the sender.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="invoice-preview-container">
        <div className="preview-loading">
          <div className="loader"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-preview-container">
        <div className="preview-error">
          <h2>❌ Unable to Load Invoice</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-preview-container">
      <div className="preview-header no-print">
        <div className="preview-actions">
          <button onClick={handlePrint} className="btn-action btn-print">
            🖨️ Print Invoice
          </button>
          <button onClick={handleDownload} className="btn-action btn-download">
            📥 Download PDF
          </button>
          <button onClick={() => window.history.back()} className="btn-action btn-back">
            ← Back
          </button>
        </div>
      </div>

      <div className="preview-content" dangerouslySetInnerHTML={{ __html: invoiceHTML }} />
    </div>
  );
};

export default InvoicePreview;
