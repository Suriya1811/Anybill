/**
 * Sample Invoice Data for Testing
 * 
 * This file contains example invoice data demonstrating:
 * - Paid invoice (balance = 0)
 * - Partially paid invoice (balance > 0, paidAmount > 0)
 * - Unpaid invoice (balance = total, paidAmount = 0)
 * - Automatic profit calculation from cost price
 */

const sampleInvoices = [
  // Invoice 1: PAID - Full payment received
  {
    invoiceNumber: "INV-000001",
    documentType: "invoice",
    customerId: "65abc123def456789", // Replace with actual customer ID
    customerDetails: {
      name: "Rajesh Kumar",
      phone: "+919876543210",
      email: "rajesh@example.com",
      address: {
        street: "123 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India"
      },
      gstin: "29ABCDE1234F1Z5"
    },
    invoiceDate: new Date("2025-11-01"),
    dueDate: new Date("2025-11-15"),
    items: [
      {
        name: "Laptop Dell Inspiron 15",
        description: "15.6 inch, 8GB RAM, 512GB SSD",
        quantity: 1,
        unit: "Piece",
        price: 45000,
        costPrice: 38000, // Profit = (45000 - 38000) * 1 = 7000
        taxRate: 18,
        taxType: "GST",
        hsn: "84713000",
        subtotal: 45000,
        taxAmount: 8100,
        total: 53100
      },
      {
        name: "Wireless Mouse",
        description: "Logitech M235",
        quantity: 2,
        unit: "Piece",
        price: 500,
        costPrice: 350, // Profit = (500 - 350) * 2 = 300
        taxRate: 18,
        taxType: "GST",
        hsn: "84716060",
        subtotal: 1000,
        taxAmount: 180,
        total: 1180
      }
    ],
    subtotal: 46000,
    discount: 1000,
    discountType: "fixed",
    taxDetails: {
      cgst: 4140,
      sgst: 4140,
      igst: 0,
      totalTax: 8280
    },
    total: 53280,
    paidAmount: 53280, // Fully paid
    balance: 0,
    status: "paid",
    profit: 7300, // Total profit: 7000 + 300 = 7300
    paymentHistory: [
      {
        paidAmount: 20000,
        paymentDate: new Date("2025-11-02"),
        paymentMethod: "UPI",
        note: "Partial payment received"
      },
      {
        paidAmount: 33280,
        paymentDate: new Date("2025-11-10"),
        paymentMethod: "Bank Transfer",
        note: "Final payment - invoice cleared"
      }
    ],
    templateId: "A4_CLASSIC",
    notes: "Thank you for your business!",
    terms: "Payment due within 15 days"
  },

  // Invoice 2: PARTIALLY PAID
  {
    invoiceNumber: "INV-000002",
    documentType: "invoice",
    customerId: "65abc123def456789",
    customerDetails: {
      name: "Priya Sharma",
      phone: "+919876543211",
      email: "priya@example.com",
      address: {
        street: "456 Brigade Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India"
      },
      gstin: "27XYZAB5678G1Z2"
    },
    invoiceDate: new Date("2025-11-05"),
    dueDate: new Date("2025-11-20"),
    items: [
      {
        name: "Office Chair Ergonomic",
        description: "Adjustable height, lumbar support",
        quantity: 5,
        unit: "Piece",
        price: 8000,
        costPrice: 5500, // Profit = (8000 - 5500) * 5 = 12500
        taxRate: 18,
        taxType: "GST",
        hsn: "94013000",
        subtotal: 40000,
        taxAmount: 7200,
        total: 47200
      },
      {
        name: "Desk Lamp LED",
        description: "Adjustable brightness",
        quantity: 5,
        unit: "Piece",
        price: 1200,
        costPrice: 800, // Profit = (1200 - 800) * 5 = 2000
        taxRate: 12,
        taxType: "GST",
        hsn: "94051000",
        subtotal: 6000,
        taxAmount: 720,
        total: 6720
      }
    ],
    subtotal: 46000,
    discount: 2000,
    discountType: "fixed",
    taxDetails: {
      cgst: 3960,
      sgst: 3960,
      igst: 0,
      totalTax: 7920
    },
    total: 51920,
    paidAmount: 30000, // Partially paid
    balance: 21920,
    status: "partial",
    profit: 14500, // Total profit: 12500 + 2000 = 14500
    paymentHistory: [
      {
        paidAmount: 30000,
        paymentDate: new Date("2025-11-08"),
        paymentMethod: "Cash",
        note: "Initial payment received"
      }
    ],
    templateId: "MODERN",
    notes: "Balance payment due by 20th Nov",
    terms: "50% advance, balance on delivery"
  },

  // Invoice 3: UNPAID
  {
    invoiceNumber: "INV-000003",
    documentType: "invoice",
    customerId: "65abc123def456789",
    customerDetails: {
      name: "Amit Patel",
      phone: "+919876543212",
      email: "amit@example.com",
      address: {
        street: "789 SG Highway",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        country: "India"
      },
      gstin: "24PQRST9012H1Z3"
    },
    invoiceDate: new Date("2025-11-08"),
    dueDate: new Date("2025-11-22"),
    items: [
      {
        name: "Printer HP LaserJet",
        description: "Wireless, Duplex printing",
        quantity: 1,
        unit: "Piece",
        price: 18000,
        costPrice: 14000, // Profit = (18000 - 14000) * 1 = 4000
        taxRate: 18,
        taxType: "GST",
        hsn: "84433210",
        subtotal: 18000,
        taxAmount: 3240,
        total: 21240
      },
      {
        name: "Printer Cartridge Set",
        description: "Black + Color",
        quantity: 2,
        unit: "Pack",
        price: 2500,
        costPrice: 1800, // Profit = (2500 - 1800) * 2 = 1400
        taxRate: 18,
        taxType: "GST",
        hsn: "84439990",
        subtotal: 5000,
        taxAmount: 900,
        total: 5900
      }
    ],
    subtotal: 23000,
    discount: 0,
    discountType: "fixed",
    taxDetails: {
      cgst: 2070,
      sgst: 2070,
      igst: 0,
      totalTax: 4140
    },
    total: 27140,
    paidAmount: 0, // Unpaid
    balance: 27140,
    status: "sent",
    profit: 5400, // Total profit: 4000 + 1400 = 5400
    paymentHistory: [],
    templateId: "BUSINESS_CLASSIC",
    notes: "Please make payment within due date to avoid late fees",
    terms: "Payment due within 15 days. 2% late fee after due date."
  }
];

/**
 * Summary Statistics from Sample Data:
 * 
 * Total Revenue: 132,340 (sum of all totals)
 * Total Paid: 83,280
 * Total Outstanding: 49,060
 * Total Profit: 27,200
 * Profit Margin: 20.55%
 * 
 * Invoice Count:
 * - Paid: 1
 * - Partially Paid: 1
 * - Unpaid: 1
 */

module.exports = {
  sampleInvoices,
  summary: {
    totalRevenue: 132340,
    totalPaid: 83280,
    totalOutstanding: 49060,
    totalProfit: 27200,
    profitMargin: 20.55,
    invoiceCount: {
      paid: 1,
      partial: 1,
      unpaid: 1
    }
  }
};
