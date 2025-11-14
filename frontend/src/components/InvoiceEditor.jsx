import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/invoice-editor.css';

const InvoiceEditor = ({ invoiceId, onClose, onUpdate }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [instantPaymentAmount, setInstantPaymentAmount] = useState('');

  const [templates, setTemplates] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchInvoice();
    fetchTemplates();
  }, [invoiceId]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/billing/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/billing/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoice(response.data.invoice);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      alert('Failed to load invoice details: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/billing/invoices/${invoiceId}/payment`,
        {
          paidAmount: parseFloat(paymentAmount),
          paymentMethod,
          note: paymentNote
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Payment added successfully!');
        setPaymentAmount('');
        setPaymentNote('');
        fetchInvoice();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Payment update error:', error);
      alert(error.response?.data?.message || 'Failed to add payment');
    } finally {
      setSaving(false);
    }
  };

  const handleInstantPayment = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/billing/invoices/${invoiceId}/payment`,
        {
          paidAmount: parseFloat(amount),
          paymentMethod: 'Instant Payment',
          note: 'Instant payment received'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const summary = response.data.summary;
        let message = `✅ Payment of ${formatCurrency(parseFloat(amount))} added successfully!\n\n`;
        
        if (summary) {
          message += `Previous Balance: ${formatCurrency(summary.previousBalance)}\n`;
          message += `New Balance: ${formatCurrency(summary.newBalance)}\n\n`;
          
          if (summary.statusChanged) {
            message += `Status: "${summary.previousStatus.toUpperCase()}" → "${summary.newStatus.toUpperCase()}"`;
          }
        }
        
        alert(message);
        setInstantPaymentAmount('');
        fetchInvoice();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Instant payment error:', error);
      alert(error.response?.data?.message || 'Failed to add instant payment');
    } finally {
      setSaving(false);
    }
  };

  const handleSetPayment = async (newPaidAmount) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/billing/invoices/${invoiceId}/payment`,
        {
          paidAmount: parseFloat(newPaidAmount),
          paymentMethod: 'Adjustment',
          note: 'Payment amount adjusted'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const summary = response.data.summary;
        let message = 'Payment status updated successfully!\n\n';
        
        if (summary && summary.statusChanged) {
          message += `Status changed from "${summary.previousStatus.toUpperCase()}" to "${summary.newStatus.toUpperCase()}"\n`;
        }
        
        message += `New Balance: ${formatCurrency(response.data.invoice.balance)}`;
        
        alert(message);
        fetchInvoice();
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Payment set error:', error);
      alert(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setSaving(false);
    }
  };

  const markAsPaid = () => {
    if (confirm(`Mark invoice as fully paid (${formatCurrency(invoice.balance)} remaining)?`)) {
      handleSetPayment(invoice.total);
    }
  };

  const markAsUnpaid = () => {
    if (confirm('Mark invoice as unpaid?')) {
      handleSetPayment(0);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoice?.currency || 'INR'
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'paid': { label: 'PAID', color: '#27ae60', icon: '✅' },
      'partial': { label: 'PARTIALLY PAID', color: '#f39c12', icon: '⏳' },
      'draft': { label: 'DRAFT', color: '#95a5a6', icon: '📝' },
      'sent': { label: 'UNPAID', color: '#e74c3c', icon: '📨' },
      'overdue': { label: 'OVERDUE', color: '#c0392b', icon: '⚠️' },
      'cancelled': { label: 'CANCELLED', color: '#7f8c8d', icon: '❌' }
    };
    const statusInfo = statusMap[status] || { label: status.toUpperCase(), color: '#95a5a6', icon: '📄' };
    return (
      <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
        {statusInfo.icon} {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return <div className="invoice-editor-modal"><div className="loading">Loading invoice...</div></div>;
  }

  if (!invoice) {
    return <div className="invoice-editor-modal"><div className="error">Invoice not found</div></div>;
  }

  return (
    <div className="invoice-editor-modal">
      <div className="invoice-editor-content">
        <div className="editor-header">
          <h2>Edit Invoice - {invoice.invoiceNumber}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="editor-body">
          {/* Invoice Summary */}
          <div className="invoice-summary-card">
            <div className="summary-row">
              <div className="summary-item">
                <label>Invoice Number:</label>
                <strong>{invoice.invoiceNumber}</strong>
              </div>
              <div className="summary-item">
                <label>Status:</label>
                {getStatusBadge(invoice.status)}
              </div>
              <div className="summary-item">
                <label>Customer:</label>
                <strong>{invoice.customerDetails.name}</strong>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="financial-summary">
            <div className="financial-card">
              <label>Total Amount</label>
              <div className="amount">{formatCurrency(invoice.total)}</div>
            </div>
            <div className="financial-card paid">
              <label>Paid Amount</label>
              <div className="amount">{formatCurrency(invoice.paidAmount || 0)}</div>
            </div>
            <div className="financial-card balance">
              <label>Balance Due</label>
              <div className="amount">{formatCurrency(invoice.balance || 0)}</div>
            </div>
            <div className="financial-card profit">
              <label>Profit</label>
              <div className="amount">{formatCurrency(invoice.profit || 0)}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="btn btn-success" 
              onClick={markAsPaid}
              disabled={invoice.status === 'paid' || saving}
            >
              Mark as Paid
            </button>
            <button 
              className="btn btn-danger" 
              onClick={markAsUnpaid}
              disabled={invoice.paidAmount === 0 || saving}
            >
              Mark as Unpaid
            </button>
            <button 
              className="btn btn-info" 
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            >
              {showPaymentHistory ? 'Hide' : 'Show'} Payment History
            </button>
          </div>

          {/* Instant Payment Section */}
          <div className="instant-payment-section">
            <h3>💳 Instant Payment</h3>
            <div className="instant-payment-form">
              <input
                type="number"
                value={instantPaymentAmount}
                onChange={(e) => setInstantPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                disabled={saving}
                className="instant-payment-input"
              />
              <button 
                className="btn btn-instant" 
                onClick={() => handleInstantPayment(instantPaymentAmount)}
                disabled={saving || !instantPaymentAmount}
              >
                {saving ? 'Processing...' : '⚡ Pay Now'}
              </button>
              <button 
                className="btn btn-instant-full" 
                onClick={() => handleInstantPayment(invoice.balance)}
                disabled={saving || invoice.balance <= 0}
              >
                {saving ? 'Processing...' : `💰 Pay Full Balance (${formatCurrency(invoice.balance)})`}
              </button>
            </div>
          </div>

          {/* Payment History */}
          {showPaymentHistory && invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
            <div className="payment-history">
              <h3>Payment History</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.paymentHistory.map((payment, index) => (
                    <tr key={index}>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>{formatCurrency(payment.paidAmount)}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Payment */}
          <div className="add-payment-section">
            <h3>Add Payment</h3>
            <div className="payment-form">
              <div className="form-group">
                <label>Payment Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={saving}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Note (Optional)</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add a note"
                  disabled={saving}
                />
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleAddPayment}
                disabled={saving || !paymentAmount}
              >
                {saving ? 'Processing...' : 'Add Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;
