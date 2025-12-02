import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaList,
  FaUsers,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaImage,
  FaGift,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";

import DashboardContent from "../components/DashboardContent";
import ProductsContent from "../components/ProductsContent";
import CategoriesContent from "../components/CategoriesContent";
import SubcategoriesContent from "../components/SubcategoriesContent";
import UsersContent from "../components/UsersContent";
import OrdersContent from "../components/OrdersContent";
import QueriesContent from "../components/QueriesContent";
import BannerManager from "../components/BannerManager";
import CouponManager from "../components/CouponManager";
import ReferralManager from "../components/ReferralManager";
import OfferManager from "../components/OfferManager";

// ✅ Enhanced localStorage handler for iOS Safari compatibility
const StorageManager = {
  isLocalStorageAvailable: () => {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  getItem: (key) => {
    if (StorageManager.isLocalStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("localStorage getItem failed:", e);
      }
    }
    // Fallback to in-memory storage
    if (typeof window !== 'undefined') {
      return window.__fallbackStorage?.[key];
    }
    return null;
  },
  
  setItem: (key, value) => {
    if (StorageManager.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn("localStorage setItem failed:", e);
      }
    }
    // Fallback to in-memory storage
    if (typeof window !== 'undefined') {
      window.__fallbackStorage = window.__fallbackStorage || {};
      window.__fallbackStorage[key] = value;
    }
  },
  
  removeItem: (key) => {
    if (StorageManager.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn("localStorage removeItem failed:", e);
      }
    }
    // Fallback to in-memory storage
    if (typeof window !== 'undefined' && window.__fallbackStorage) {
      delete window.__fallbackStorage[key];
    }
  }
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(
    StorageManager.getItem("adminActiveSection") || "Dashboard"
  );

  useEffect(() => {
    StorageManager.setItem("adminActiveSection", activeSection);
  }, [activeSection]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Categories", icon: <FaTags /> },
    { name: "Subcategories", icon: <FaList /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Orders", icon: <FaShoppingCart /> },
    { name: "Queries", icon: <FaEnvelopeOpenText /> },
    { name: "Banners", icon: <FaImage /> },
    { name: "Coupons", icon: <FaGift /> },
    { name: "Referrals", icon: <FaUserFriends /> },
    { name: "Offers", icon: <FaClock /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardContent />;
      case "Products":
        return <ProductsContent />;
      case "Categories":
        return <CategoriesContent />;
      case "Subcategories":
        return <SubcategoriesContent />;
      case "Users":
        return <UsersContent />;
      case "Orders":
        return <OrdersContent />;
      case "Queries":
        return <QueriesContent />;
      case "Banners":
        return <BannerManager />;
      case "Coupons":
        return <CouponManager />;
      case "Referrals":
        return <ReferralManager />;
      case "Offers":
        return <OfferManager />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${
              sidebarOpen ? "block" : "hidden"
            } text-xl font-bold text-[#02066F]`}
          >
            Admin Panel
          </h1>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-gray-100 text-[#02066F]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveSection(item.name)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                    activeSection === item.name
                      ? "bg-[#02066F] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={`${sidebarOpen ? "mr-3" : "mx-auto"}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}