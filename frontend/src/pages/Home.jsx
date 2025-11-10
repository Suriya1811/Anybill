import React from "react";
import Hero from "./Hero";
import FeatureCard from "../components/FeatureCard";
import "../styles/home.css";
import { FiBook, FiTrendingUp, FiShoppingCart, FiUsers, FiFileText, FiBarChart2 } from "react-icons/fi";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="features container">
        <h2 className="h2">Run your business with confidence</h2>
        <p className="lead">Create invoices, manage stock, collect payments, and stay GST compliant. Designed for speed and clarity.</p>

        <div className="features-grid">
          <FeatureCard icon={<FiBook/>} title="GST Invoices" description="Create professional GST invoices with HSN/SAC, taxes, and templates." />
          <FeatureCard icon={<FiShoppingCart/>} title="Inventory" description="Real-time stock, variants, low-stock alerts, and purchase tracking." />
          <FeatureCard icon={<FiTrendingUp/>} title="Analytics" description="Sales, tax, and profitability dashboards for quick decisions." />
          <FeatureCard icon={<FiUsers/>} title="Customers" description="Manage customers, credits, reminders, and payment history." />
          <FeatureCard icon={<FiFileText/>} title="E-Invoicing" description="e-Invoice and e-Way Bill support with easy exports." />
          <FeatureCard icon={<FiBarChart2/>} title="Reports" description="GST returns, GSTR-1/3B data, and downloadable statements." />
        </div>
      </section>
    </div>
  );
}
