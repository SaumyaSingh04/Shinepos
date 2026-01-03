import React from 'react';
import { useAuth } from '../context/AuthContext';
import RestaurantDashboard from './RestaurantDashboard';
import KitchenPage from './KitchenPage';
import WaiterPage from './WaiterPage';
import CashierPage from './CashierPage';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Route based on user role
  switch (user.role) {
    case 'RESTAURANT_ADMIN':
    case 'MANAGER':
      return <RestaurantDashboard />;
    
    case 'CHEF':
      return <KitchenPage />;
    
    case 'WAITER':
      return <WaiterPage />;
    
    case 'CASHIER':
      return <CashierPage />;
    
    default:
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>Your role ({user.role}) does not have access to any dashboard.</p>
        </div>
      );
  }
};

export default RoleBasedDashboard;