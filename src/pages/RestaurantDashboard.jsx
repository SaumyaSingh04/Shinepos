import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDashboardHome from '../components/Reasturant/Dashboard/Dashboard';
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

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

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
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="h-full"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      <div 
        className="fixed inset-0 transition-opacity duration-500"
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
      <RestaurantSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto relative z-10 bg-transparent">
        <AnimatePresence mode="wait" initial={false}>
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
