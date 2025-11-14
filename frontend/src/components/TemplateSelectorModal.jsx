import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/template-selector.css';

const TemplateSelectorModal = ({ invoiceId, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('A4_CLASSIC');
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTemplates();
  }, []);

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

  const handlePreview = async () => {
    try {
      setPreviewing(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/billing/invoices/${invoiceId}/preview?template=${selectedTemplate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'text'
        }
      );

      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(response.data);
      previewWindow.document.close();
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview template');
    } finally {
      setPreviewing(false);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Printing invoice with template:', selectedTemplate);
      
      const response = await axios.post(
        `${API_URL}/api/billing/invoices/${invoiceId}/print`,
        {
          template: selectedTemplate,
          format: 'HTML'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Print response:', response.data);

      if (response.data && response.data.success && response.data.html) {
        // Open in new window and trigger print
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Please allow popups for this site');
          return;
        }
        printWindow.document.write(response.data.html);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        alert('Failed to generate print content. No HTML received.');
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Failed to print invoice: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Downloading PDF with template:', selectedTemplate);
      
      // Get the HTML
      const response = await axios.post(
        `${API_URL}/api/billing/invoices/${invoiceId}/print`,
        {
          template: selectedTemplate,
          format: 'HTML'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Download response:', response.data);

      if (response.data && response.data.success && response.data.html) {
        // Open in new window for PDF download via browser's print to PDF
        const pdfWindow = window.open('', '_blank');
        if (!pdfWindow) {
          alert('Please allow popups for this site');
          return;
        }
        pdfWindow.document.write(response.data.html);
        pdfWindow.document.close();
        
        pdfWindow.onload = () => {
          setTimeout(() => {
            alert('Use your browser\'s Print dialog and select "Save as PDF" to download.');
            pdfWindow.print();
          }, 500);
        };
      } else {
        alert('Failed to generate PDF. No HTML content received.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-modal-overlay">
      <div className="template-modal">
        <div className="modal-header">
          <h2>Select Invoice Template</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="template-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="template-icon">
                  {getTemplateIcon(template.id)}
                </div>
                <h3>{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-meta">
                  <span className="template-size">{template.size}</span>
                  <span className="template-orientation">{template.orientation}</span>
                </div>
                {selectedTemplate === template.id && (
                  <div className="selected-indicator">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handlePreview}
            disabled={previewing || loading}
          >
            {previewing ? 'Loading...' : 'Preview'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handlePrint}
            disabled={loading || previewing}
          >
            {loading ? 'Processing...' : 'Print'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={handleDownloadPDF}
            disabled={loading || previewing}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const getTemplateIcon = (templateId) => {
  const icons = {
    'A4_CLASSIC': '📄',
    'A5_COMPACT': '📋',
    'THERMAL_80MM': '🧾',
    'THERMAL_58MM': '🧾',
    'MODERN': '✨',
    'BUSINESS_CLASSIC': '💼',
    'PROFORMA': '📝',
    'DELIVERY_CHALLAN': '🚚',
    'RETAIL': '🛒'
  };
  return icons[templateId] || '📄';
};

export default TemplateSelectorModal;
