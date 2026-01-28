import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiGrid, FiUsers, FiCreditCard, FiClipboard, FiPackage, FiShoppingBag, FiTag, FiStar, FiTarget, FiList, FiPlus, FiSettings, FiLogOut, FiChevronDown, FiMenu, FiX, FiBarChart, FiClock } from 'react-icons/fi';

const RestaurantSidebar = ({ activeTab, setActiveTab, onLogout, sidebarOpen, setSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart /> },
    { id: 'tables', label: 'Tables', icon: <FiGrid /> },
    { id: 'staff', label: 'Staff', icon: <FiUsers /> },
    { id: 'attendance', label: 'Attendance', icon: <FiClock /> },
    { id: 'subscription', label: 'Subscription', icon: <FiCreditCard /> }
  ];

  const orderSubItems = [
    { id: 'orders', label: 'Orders', icon: <FiClipboard /> },
    { id: 'kot', label: 'Kitchen (KOT)', icon: <FiPackage /> }
  ];

  const inventorySubItems = [
    { id: 'inventory', label: 'Inventory List', icon: <FiList /> },
    { id: 'add-inventory', label: 'Add Item', icon: <FiPlus /> }
  ];

  const menuSubItems = [
    { id: 'category', label: 'Category', icon: <FiTag /> },
    { id: 'menu', label: 'Menu Items', icon: <FiShoppingBag /> },
    { id: 'addons', label: 'Addons', icon: <FiStar /> },
    { id: 'variations', label: 'Variations', icon: <FiTarget /> }
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          x: window.innerWidth >= 1024 ? 0 : (sidebarOpen ? 0 : -264)
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed lg:relative w-64 h-screen flex flex-col overflow-hidden z-40"
        style={{ opacity: window.innerWidth >= 1024 ? 1 : (sidebarOpen ? 1 : 0) }}
      >
        {/* Background with blur */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20"
          style={{ backdropFilter: 'blur(100px)' }}
        />
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl border-r border-white/20" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-4xl text-gray-900">🍽️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Restaurant POS</h2>
                  <p className="text-xs text-gray-700">{user.name || 'Admin'}</p>
                </div>
              </div>
              {/* Close button inside sidebar on mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-900" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-white/40 backdrop-blur-lg text-black shadow-lg'
                    : 'text-black hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Orders Dropdown */}
            <div className="pt-2">
              <button
                onClick={() => setOrderOpen(!orderOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  orderOpen ? 'bg-white/40 backdrop-blur-lg text-black' : 'text-black hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg"><FiClipboard /></span>
                  <span>Orders</span>
                </div>
                <FiChevronDown className={`transition-transform ${orderOpen ? 'rotate-180' : ''}`} />
              </button>
              {orderOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="ml-6 mt-1 space-y-1"
                >
                  {orderSubItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavClick(subItem.id)}
                      className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === subItem.id
                          ? 'bg-white/40 backdrop-blur-lg text-black shadow-md'
                          : 'text-black hover:bg-white/20 backdrop-blur-md'
                      }`}
                    >
                      <span className="text-lg">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Inventory Dropdown */}
            <div>
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  inventoryOpen ? 'bg-white/40 backdrop-blur-lg text-black' : 'text-black hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg"><FiPackage /></span>
                  <span>Inventory</span>
                </div>
                <FiChevronDown className={`transition-transform ${inventoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {inventoryOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="ml-6 mt-1 space-y-1"
                >
                  {inventorySubItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavClick(subItem.id)}
                      className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === subItem.id
                          ? 'bg-white/40 backdrop-blur-lg text-black shadow-md'
                          : 'text-black hover:bg-white/20 backdrop-blur-md'
                      }`}
                    >
                      <span className="text-lg">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Menu Dropdown */}
            <div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  menuOpen ? 'bg-white/40 backdrop-blur-lg text-black' : 'text-black hover:bg-white/20 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg"><FiShoppingBag /></span>
                  <span>Menu</span>
                </div>
                <FiChevronDown className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="ml-6 mt-1 space-y-1"
                >
                  {menuSubItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavClick(subItem.id)}
                      className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === subItem.id
                          ? 'bg-white/40 backdrop-blur-lg text-black shadow-md'
                          : 'text-black hover:bg-white/20 backdrop-blur-md'
                      }`}
                    >
                      <span className="text-lg">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-white/40 backdrop-blur-lg text-black shadow-lg'
                  : 'text-black hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              <span className="text-lg"><FiSettings /></span>
              <span>Settings</span>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transition-all"
            >
              <FiLogOut className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RestaurantSidebar;
