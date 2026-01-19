import React, { useState } from 'react';

const RestaurantSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuItemsOpen, setMenuItemsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
    { id: 'tables', label: 'Tables', icon: 'M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z' },
    { id: 'staff', label: 'Staff', icon: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' },
    { id: 'subscription', label: 'Subscription', icon: 'M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z' },
    { id: 'settings', label: 'Settings', icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z' }
  ];

  const orderSubItems = [
    { id: 'orders', label: 'Orders' },
    { id: 'kot', label: 'Kitchen (KOT)' }
  ];

  const inventorySubItems = [
    { id: 'inventory', label: 'Inventory List' },
    { id: 'add-inventory', label: 'Add Item' }
  ];

  const menuSubItems = [
    { id: 'category', label: 'Category' },
    { id: 'menu', label: 'Menu Items' },
    { id: 'addons', label: 'Addons' },
    { id: 'variations', label: 'Variations' }
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Restaurant</h2>
        <p className="text-sm text-gray-400 mt-1">{user.name || 'Admin'}</p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === item.id
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                </svg>
                {item.label}
              </button>
            </li>
          ))}
          
          <li>
            <button
              onClick={() => setOrderOpen(!orderOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
                Orders
              </div>
              <svg className={`w-4 h-4 transition-transform ${orderOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {orderOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                {orderSubItems.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      onClick={() => setActiveTab(subItem.id)}
                      className={`w-full text-left p-2 rounded-lg text-sm ${
                        activeTab === subItem.id
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          <li>
            <button
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Inventory
              </div>
              <svg className={`w-4 h-4 transition-transform ${inventoryOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {inventoryOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                {inventorySubItems.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      onClick={() => setActiveTab(subItem.id)}
                      className={`w-full text-left p-2 rounded-lg text-sm ${
                        activeTab === subItem.id
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          <li>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
                Menu
              </div>
              <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {menuOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                {menuSubItems.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      onClick={() => setActiveTab(subItem.id)}
                      className={`w-full text-left p-2 rounded-lg text-sm ${
                        activeTab === subItem.id
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 text-red-400"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default RestaurantSidebar;
