import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import SuperAdminLogin from './pages/SuperAdminLogin';
import RestaurantLogin from './pages/RestaurantLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import EditRestaurant from './components/superadmin/Addreasturant/EditRestaurantInline';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/admin-login" element={<PageTransition><SuperAdminLogin /></PageTransition>} />
        <Route path="/restaurant-login" element={<PageTransition><RestaurantLogin /></PageTransition>} />
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <PageTransition><SuperAdminDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/superadmin/restaurants/edit/:id" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <PageTransition><EditRestaurant /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <PageTransition><SuperAdminDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/restaurant-dashboard" element={
          <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN', 'MANAGER', 'CHEF', 'WAITER', 'CASHIER']}>
            <PageTransition><RestaurantDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/restaurant-login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-800">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
