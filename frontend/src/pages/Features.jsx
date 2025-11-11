import React from "react";
import FeatureCard from "../components/FeatureCard";
import "../styles/features.css";
import { FiFileText, FiUser, FiClock, FiShoppingCart, FiBarChart2, FiSettings, FiCreditCard, FiBell, FiDatabase, FiShield, FiLayers, FiTrendingUp } from "react-icons/fi";

export default function Features() {
  return (
    <section className="page-features container">
      <h1 className="h1">All-in-one billing dashboard</h1>
      <p className="lead">From invoicing to analytics — everything you need to run and scale your business, beautifully organized.</p>

      <div className="features-list">
        <FeatureCard icon={<FiFileText/>} title="GST Invoices" description="Create GST-ready invoices with HSN/SAC, taxes, and professional templates for A4/Thermal."/>
        <FeatureCard icon={<FiShoppingCart/>} title="Inventory & Purchases" description="Track stock, variants, batches, low-stock alerts, and purchase orders in one place."/>
        <FeatureCard icon={<FiUser/>} title="Customers & CRM" description="Maintain ledgers, credits, reminders, and complete customer history."/>
        <FeatureCard icon={<FiClock/>} title="Recurring Billing" description="Automate invoices and payment reminders with flexible schedules."/>
        <FeatureCard icon={<FiBarChart2/>} title="Reports & Analytics" description="Real-time sales, taxes, and profitability dashboards with exportable reports."/>
        <FeatureCard icon={<FiCreditCard/>} title="Payments" description="Record payments, partials, and reconcile balances with ease."/>
        <FeatureCard icon={<FiTrendingUp/>} title="GST & Compliance" description="GSTR-1/3B data, e-Invoicing, e-Way Bill support and compliant exports."/>
        <FeatureCard icon={<FiLayers/>} title="Templates & Branding" description="Customize logos, colors, fields, and print layouts to match your brand."/>
        <FeatureCard icon={<FiBell/>} title="Notifications" description="Send due reminders and payment confirmations via SMS/email (provider required)."/>
        <FeatureCard icon={<FiDatabase/>} title="Imports & Exports" description="CSV/Excel imports and clean data exports for accounting or audits."/>
        <FeatureCard icon={<FiShield/>} title="User Roles & Access" description="Owner/admin/staff roles with permissions and activity logs."/>
        <FeatureCard icon={<FiSettings/>} title="Configurations" description="Tax presets, sequences, numbering, rounding, units, and more granular settings."/>
      </div>
    </section>
  );
}
