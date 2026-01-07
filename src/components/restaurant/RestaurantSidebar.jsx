import React from 'react';
import { 
  MdDashboard, 
  MdShoppingCart, 
  MdRestaurantMenu, 
  MdInventory, 
  MdPeople, 
  MdKitchen, 
  MdAnalytics, 
  MdSettings,
  MdClose
} from 'react-icons/md';

const RestaurantSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: MdDashboard },
    { id: 'orders', name: 'Orders', icon: MdShoppingCart },
    { id: 'menus', name: 'Menu Management', icon: MdRestaurantMenu },
    { id: 'inventory', name: 'Inventory', icon: MdInventory },
    { id: 'staff', name: 'Staff Management', icon: MdPeople },
    { id: 'kitchen', name: 'Kitchen Display', icon: MdKitchen },
    { id: 'analytics', name: 'Analytics', icon: MdAnalytics },
    { id: 'settings', name: 'Settings', icon: MdSettings }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`w-64 bg-white shadow-xl border-r border-slate-200 min-h-screen fixed left-0 top-0 overflow-y-auto transition-transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-slate-900">ShinePos</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded transition-all"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-slate-50 transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-3 border-indigo-500 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className={`mr-3 text-lg transition-transform duration-300 group-hover:scale-105 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-500'
              }`}><item.icon /></span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default RestaurantSidebar;