import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDashboardHome from '../components/Reasturant/Dashboard/Dashboard';
import Category from '../components/Reasturant/Menu/Category/MainCategorys';
import Menu from '../components/Reasturant/Menu/menu/Menu';
import Addon from '../components/Reasturant/Menu/addon/Addon';
import Variation from '../components/Reasturant/Menu/variation/Variation';
import StaffList from '../components/Reasturant/Staff/Staff';
import Order from '../components/Reasturant/Order/Order';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
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
      case 'staff':
        return <StaffList />;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2></div>;
      default:
        return <RestaurantDashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <RestaurantSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
