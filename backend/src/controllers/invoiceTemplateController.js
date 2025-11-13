const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const InvoiceAudit = require("../models/InvoiceAudit");
const fs = require("fs").promises;
const path = require("path");

/**
 * Get invoice with populated data for printing
 */
const getInvoiceForPrint = async (invoiceId, userId) => {
  const invoice = await Invoice.findOne({
    _id: invoiceId,
    userId,
    isDeleted: false
  }).populate("customerId");

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const business = await Business.findOne({ userId });
  if (!business) {
    throw new Error("Business profile not found");
  }

  return { invoice, business };
};

/**
 * Load HTML template and replace placeholders
 */
const renderTemplate = async (templateName, data) => {
  // Map 'default' to 'A4_CLASSIC' for backward compatibility
  const actualTemplate = templateName === 'default' ? 'A4_CLASSIC' : templateName;
  const templatePath = path.join(__dirname, "../templates/invoices", `${actualTemplate}.html`);
  
  let templateContent;
  try {
    templateContent = await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    throw new Error(`Template ${actualTemplate} not found`);
  }

  const { invoice, business } = data;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoice.currency || 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Build items table HTML
  const buildItemsTable = () => {
    return invoice.items.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <strong>${item.name}</strong>
          ${item.description ? `<br><small>${item.description}</small>` : ''}
          ${item.hsn ? `<br><small>HSN: ${item.hsn}</small>` : ''}
        </td>
        <td>${item.quantity} ${item.unit}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>${item.taxRate}%</td>
        <td>${formatCurrency(item.total)}</td>
      </tr>
    `).join('');
  };

  // Generate payment QR code placeholder
  const generateQRPlaceholder = () => {
    const upiId = business.paymentDetails?.upiId || '';
    if (upiId) {
      return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(business.businessName)}&am=${invoice.balance}&cu=${invoice.currency}`;
    }
    return '';
  };

  // Replace placeholders
  let rendered = templateContent
    // Business details
    .replace(/{{businessName}}/g, business.businessName || '')
    .replace(/{{businessAddress}}/g, `${business.address?.street || ''}, ${business.address?.city || ''}, ${business.address?.state || ''} ${business.address?.pincode || ''}`)
    .replace(/{{businessPhone}}/g, business.contact?.phone || business.phone || '')
    .replace(/{{businessEmail}}/g, business.contact?.email || business.email || '')
    .replace(/{{businessGSTIN}}/g, business.gstin || '')
    .replace(/{{businessLogo}}/g, business.logo || '')
    
    // Invoice details
    .replace(/{{invoiceNumber}}/g, invoice.invoiceNumber || '')
    .replace(/{{invoiceDate}}/g, formatDate(invoice.invoiceDate))
    .replace(/{{dueDate}}/g, formatDate(invoice.dueDate))
    .replace(/{{documentType}}/g, invoice.documentType.toUpperCase())
    
    // Customer details
    .replace(/{{customerName}}/g, invoice.customerDetails.name || '')
    .replace(/{{customerPhone}}/g, invoice.customerDetails.phone || '')
    .replace(/{{customerEmail}}/g, invoice.customerDetails.email || '')
    .replace(/{{customerAddress}}/g, `${invoice.customerDetails.address?.street || ''}, ${invoice.customerDetails.address?.city || ''}, ${invoice.customerDetails.address?.state || ''} ${invoice.customerDetails.address?.pincode || ''}`)
    .replace(/{{customerGSTIN}}/g, invoice.customerDetails.gstin || '')
    
    // Items
    .replace(/{{itemsTable}}/g, buildItemsTable())
    
    // Amounts
    .replace(/{{subtotal}}/g, formatCurrency(invoice.subtotal))
    .replace(/{{discount}}/g, formatCurrency(invoice.discount))
    .replace(/{{cgst}}/g, formatCurrency(invoice.taxDetails.cgst))
    .replace(/{{sgst}}/g, formatCurrency(invoice.taxDetails.sgst))
    .replace(/{{igst}}/g, formatCurrency(invoice.taxDetails.igst))
    .replace(/{{totalTax}}/g, formatCurrency(invoice.taxDetails.totalTax))
    .replace(/{{total}}/g, formatCurrency(invoice.total))
    .replace(/{{paidAmount}}/g, formatCurrency(invoice.paidAmount))
    .replace(/{{balance}}/g, formatCurrency(invoice.balance))
    .replace(/{{profit}}/g, formatCurrency(invoice.profit))
    
    // Status
    .replace(/{{status}}/g, invoice.status.toUpperCase())
    .replace(/{{paymentStatus}}/g, invoice.balance <= 0 ? 'PAID' : invoice.paidAmount > 0 ? 'PARTIALLY PAID' : 'UNPAID')
    
    // Notes
    .replace(/{{notes}}/g, invoice.notes || '')
    .replace(/{{terms}}/g, invoice.terms || '')
    
    // QR Code
    .replace(/{{qrCodeData}}/g, generateQRPlaceholder());

  return rendered;
};

/**
 * Print invoice endpoint
 */
const printInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { template = "A4_CLASSIC", format = "HTML" } = req.body;

    console.log(`Printing invoice ${id} with template ${template}`);
    
    const data = await getInvoiceForPrint(id, req.user.id);
    const renderedHTML = await renderTemplate(template, data);

    // Log audit
    await InvoiceAudit.logAction({
      invoiceId: id,
      userId: req.user.id,
      actionType: "PRINTED",
      note: `Printed using template: ${template}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Always return JSON with HTML content
    res.json({
      success: true,
      html: renderedHTML,
      template
    });
  } catch (error) {
    console.error('Print invoice error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to print invoice: " + error.message 
    });
  }
};

/**
 * Get available templates
 */
const getAvailableTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: "A4_CLASSIC",
        name: "A4 Classic",
        description: "Standard A4 size professional invoice",
        size: "A4",
        orientation: "portrait"
      },
      {
        id: "A5_COMPACT",
        name: "A5 Compact",
        description: "Compact A5 size invoice",
        size: "A5",
        orientation: "portrait"
      },
      {
        id: "THERMAL_80MM",
        name: "Thermal 80mm",
        description: "80mm thermal printer receipt",
        size: "80mm",
        orientation: "portrait"
      },
      {
        id: "THERMAL_58MM",
        name: "Thermal 58mm",
        description: "58mm thermal printer receipt",
        size: "58mm",
        orientation: "portrait"
      },
      {
        id: "MODERN",
        name: "Modern",
        description: "Modern design with colors",
        size: "A4",
        orientation: "portrait"
      },
      {
        id: "BUSINESS_CLASSIC",
        name: "Business Classic",
        description: "Traditional business invoice",
        size: "A4",
        orientation: "portrait"
      },
      {
        id: "PROFORMA",
        name: "Proforma Invoice",
        description: "Proforma invoice template",
        size: "A4",
        orientation: "portrait"
      },
      {
        id: "DELIVERY_CHALLAN",
        name: "Delivery Challan",
        description: "Delivery challan template",
        size: "A4",
        orientation: "portrait"
      },
      {
        id: "RETAIL",
        name: "Retail",
        description: "Retail-style receipt",
        size: "80mm",
        orientation: "portrait"
      }
    ];

    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch templates: " + error.message 
    });
  }
};

/**
 * Preview invoice template - PUBLIC ACCESS for sharing
 */
const previewTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { template = "A4_CLASSIC" } = req.query;

    // Allow public access - no user ID verification
    const invoice = await Invoice.findOne({
      _id: id,
      isDeleted: false
    }).populate("customerId");

    if (!invoice) {
      return res.status(404).send('<html><body><h1>Invoice not found</h1><p>The invoice you are looking for does not exist or has been deleted.</p></body></html>');
    }

    const business = await Business.findOne({ userId: invoice.userId });
    if (!business) {
      return res.status(404).send('<html><body><h1>Business not found</h1></body></html>');
    }

    const data = { invoice, business };
    const renderedHTML = await renderTemplate(template, data);

    res.send(renderedHTML);
  } catch (error) {
    console.error('Preview template error:', error);
    res.status(500).send(`<html><body><h1>Error loading invoice</h1><p>${error.message}</p></body></html>`);
  }
};

module.exports = {
  printInvoice,
  getAvailableTemplates,
  previewTemplate,
  renderTemplate
};

