import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiUser, FiSettings, FiLogOut, FiMenu, FiSearch } from 'react-icons/fi';

const DashboardHeader = ({ title, onMenuClick, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, message: 'New order #ORD-001 received', time: '2 min ago', type: 'order' },
    { id: 2, message: 'Low stock alert: Chicken Breast', time: '5 min ago', type: 'inventory' },
    { id: 3, message: 'Staff member John clocked in', time: '10 min ago', type: 'staff' }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'inventory': return '⚠️';
      case 'staff': return '👤';
      default: return '🔔';
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3 lg:px-6 lg:py-4 relative z-[9998]"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiMenu className="text-white text-xl" />
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-300 hidden lg:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Center Section - Search (Hidden on mobile) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <div className="relative z-[9999] dropdown-container">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiBell className="text-white text-xl" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 z-[9999]"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded-lg">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative z-[9999] dropdown-container">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white" />
              </div>
              <span className="text-white font-medium hidden lg:block">
                {user?.name || 'Admin'}
              </span>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="font-medium text-gray-800">{user?.name || 'Admin'}</p>
                      <p className="text-sm text-gray-500">{user?.email || 'admin@restaurant.com'}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg text-gray-700">
                        <FiUser className="text-sm" />
                        <span className="text-sm">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg text-gray-700">
                        <FiSettings className="text-sm" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <hr className="my-1" />
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg text-red-600">
                        <FiLogOut className="text-sm" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;