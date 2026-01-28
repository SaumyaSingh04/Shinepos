import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileHeader from '../components/MobileHeader';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDashboardHome from '../components/Reasturant/Dashboard/Dashboard';
import AnalyticsDashboard from '../components/Reasturant/Dashboard/AnalyticsDashboard';
import DashboardHeader from '../components/Reasturant/Dashboard/DashboardHeader';
import Category from '../components/Reasturant/Menu/Category/MainCategorys';
import Menu from '../components/Reasturant/Menu/menu/Menu';
import Addon from '../components/Reasturant/Menu/addon/Addon';
import Variation from '../components/Reasturant/Menu/variation/Variation';
import StaffList from '../components/Reasturant/Staff/Staff';
import Order from '../components/Reasturant/Order/Orders/Order';
import Tables from '../components/Reasturant/Order/Tables/Tables';
import KOT from '../components/Reasturant/Order/KOT/KOT';
import Inventory from '../components/Reasturant/Inventory/Inventory';
import SubscriptionPlans from '../components/Reasturant/Subscription/SubscriptionPlans';
import SubscriptionBlocker from './SubscriptionBlocker';
import Attendance from '../components/Reasturant/Attendance/Attendance';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const backgroundImages = {
    dashboard: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
    orders: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80',
    tables: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
    kot: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80',
    menu: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80',
    category: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&q=80',
    addons: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80',
    variations: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1920&q=80',
    inventory: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&q=80',
    staff: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1920&q=80',
    subscription: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
    settings: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920&q=80'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/restaurant-login');
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return <RestaurantDashboardHome />;
        case 'analytics':
          return <AnalyticsDashboard />;
        case 'category':
          return <Category />;
        case 'menu':
          return <Menu />;
        case 'addons':
          return <Addon />;
        case 'variations':
          return <Variation />;
        case 'orders':
          return <Order />;
        case 'tables':
          return <Tables />;
        case 'kot':
          return <KOT />;
        case 'inventory':
          return <Inventory initialTab="list" onTabChange={(tab) => setActiveTab(tab === 'list' ? 'inventory' : 'add-inventory')} />;
        case 'add-inventory':
          return <Inventory initialTab="add" onTabChange={(tab) => setActiveTab(tab === 'list' ? 'inventory' : 'add-inventory')} />;
        case 'staff':
          return <StaffList />;
        case 'attendance':
          return <Attendance />;
        case 'subscription':
          return <SubscriptionPlans />;
        case 'settings':
          return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2></div>;
        default:
          return <RestaurantDashboardHome />;
      }
    })();

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        {content}
      </motion.div>
    );
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      category: 'Categories',
      menu: 'Menu Items',
      addons: 'Addons',
      variations: 'Variations',
      orders: 'Orders',
      tables: 'Tables',
      kot: 'Kitchen',
      inventory: 'Inventory',
      'add-inventory': 'Add Inventory',
      staff: 'Staff',
      attendance: 'Attendance',
      subscription: 'Subscription',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Restaurant POS';
  };

  return (
    <div className="flex h-screen bg-gray-900 relative overflow-hidden">
      {/* Mobile Header - Only show on mobile */}
      <div className="lg:hidden">
        <MobileHeader title={getPageTitle()} onMenuClick={() => setSidebarOpen(true)} />
      </div>
      
      <div 
        className="fixed inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${backgroundImages[activeTab] || backgroundImages.dashboard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.4)',
          transform: 'scale(1.1)',
          zIndex: 0
        }}
      />
      <SubscriptionBlocker />
      <RestaurantSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <DashboardHeader 
            title={getPageTitle()} 
            onMenuClick={() => setSidebarOpen(true)} 
            user={user}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
