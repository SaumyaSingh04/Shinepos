import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InventoryManagement from '../components/restaurant/InventoryManagement';
import StaffManagement from '../components/restaurant/StaffManagement';
import KitchenDisplay from '../components/restaurant/KitchenDisplay';
import NotificationCenter from '../components/restaurant/NotificationCenter';
import RestaurantSidebar from '../components/restaurant/RestaurantSidebar';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    customerPhone: ''
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchMenus();
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);



  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menus`);
      setMenus(response.data.menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingMenu) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/menus/${editingMenu._id}`, menuFormData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/menus`, menuFormData);
      }
      
      setMenuFormData({ name: '', description: '', price: '', category: '' });
      setShowMenuForm(false);
      setEditingMenu(null);
      fetchMenus();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save menu item');
    }
    setLoading(false);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Please add items to the order');
      return;
    }

    console.log('User object:', user);
    console.log('Restaurant slug:', user.restaurantSlug);

    setLoading(true);
    setError('');

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/${user.restaurantSlug}/orders`;
      console.log('Making request to:', url);
      
      await axios.post(url, {
        items: cart.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity
        })),
        customerName: orderFormData.customerName,
        customerPhone: orderFormData.customerPhone
      });
      
      setOrderFormData({ customerName: '', customerPhone: '' });
      setCart([]);
      setShowOrderForm(false);
      fetchOrders();
    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.response?.data?.error || 'Failed to create order');
    }
    setLoading(false);
  };

  const addToCart = (menu) => {
    const existingItem = cart.find(item => item.menuId === menu._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuId === menu._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: 1
      }]);
    }
  };

  const updateCartQuantity = (menuId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.menuId !== menuId));
    } else {
      setCart(cart.map(item =>
        item.menuId === menuId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleMenuEdit = (menu) => {
    setEditingMenu(menu);
    setMenuFormData({
      name: menu.name,
      description: menu.description || '',
      price: menu.price.toString(),
      category: menu.category
    });
    setShowMenuForm(true);
  };

  const handleMenuDelete = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/menus/${menuId}`);
        fetchMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleMenuFormChange = (e) => {
    setMenuFormData({
      ...menuFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleOrderFormChange = (e) => {
    setOrderFormData({
      ...orderFormData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex">
      <RestaurantSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-indigo-600 shadow-lg border-b border-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 lg:py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="mr-4 p-2 rounded-lg text-indigo-100 hover:text-white hover:bg-indigo-500 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-white">Restaurant Dashboard</h1>
                  <p className="text-indigo-100 mt-1 font-medium text-sm lg:text-base capitalize">{user.restaurantSlug?.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <NotificationCenter />
                <span className="text-indigo-100 font-medium text-sm lg:text-base hidden sm:block">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-white hover:bg-indigo-50 text-indigo-600 px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm lg:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="p-3 lg:p-4">
            {/* Header */}
            <div className="mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Restaurant Overview</h2>
              <p className="text-slate-600 text-sm lg:text-base">Monitor your restaurant performance and key metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{orders.length}</p>
                  </div>
                  <div className="bg-indigo-400 bg-opacity-30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Menu Items</p>
                    <p className="text-3xl font-bold mt-2">{menus.length}</p>
                  </div>
                  <div className="bg-emerald-400 bg-opacity-30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Pending Orders</p>
                    <p className="text-3xl font-bold mt-2">{orders.filter(o => o.status === 'PENDING').length}</p>
                  </div>
                  <div className="bg-amber-400 bg-opacity-30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Today's Revenue</p>
                    <p className="text-3xl font-bold mt-2">₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-3 lg:p-4 mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3 lg:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <div className="bg-indigo-600 rounded-full p-3 mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-900">New Order</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('menus')}
                  className="flex flex-col items-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <div className="bg-emerald-600 rounded-full p-3 mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-900">Manage Menu</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="flex flex-col items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <div className="bg-amber-600 rounded-full p-3 mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-900">Inventory</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('kitchen')}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="bg-purple-600 rounded-full p-3 mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-900">Kitchen</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowOrderForm(!showOrderForm);
                  setCart([]);
                  setOrderFormData({ customerName: '', customerPhone: '' });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{showOrderForm ? 'Cancel' : 'Create New Order'}</span>
              </button>
            </div>

            {/* Create Order Form */}
            {showOrderForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Order</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Menu Items */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Select Items</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {menus.filter(menu => menu.isAvailable).map((menu) => (
                        <div key={menu._id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{menu.name}</p>
                            <p className="text-sm text-gray-600">₹{menu.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => addToCart(menu)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={orderFormData.customerName}
                        onChange={handleOrderFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        name="customerPhone"
                        placeholder="Phone Number (Optional)"
                        value={orderFormData.customerPhone}
                        onChange={handleOrderFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {cart.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="space-y-2 mb-4">
                            {cart.map((item) => (
                              <div key={item.menuId} className="flex justify-between items-center">
                                <span className="text-sm">{item.name}</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.menuId, item.quantity - 1)}
                                    className="w-6 h-6 bg-gray-200 rounded-full text-xs"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateCartQuantity(item.menuId, item.quantity + 1)}
                                    className="w-6 h-6 bg-gray-200 rounded-full text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-2 font-bold">
                            Total: ₹{getTotalAmount().toFixed(2)}
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={loading || cart.length === 0}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        {loading ? 'Creating Order...' : 'Create Order'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Orders ({orders.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                        <p className="text-gray-600">{order.customerName} • {order.customerPhone}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{order.totalAmount.toFixed(2)}</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                          className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'READY' ? 'bg-green-100 text-green-800' :
                            order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="READY">Ready</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menus' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowMenuForm(!showMenuForm);
                  setEditingMenu(null);
                  setMenuFormData({ name: '', description: '', price: '', category: '' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {showMenuForm ? 'Cancel' : 'Add Menu Item'}
              </button>
            </div>

            {showMenuForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                <form onSubmit={handleMenuSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Item Name"
                      value={menuFormData.name}
                      onChange={handleMenuFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={menuFormData.price}
                      onChange={handleMenuFormChange}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={menuFormData.category}
                    onChange={handleMenuFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={menuFormData.description}
                    onChange={handleMenuFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Saving...' : (editingMenu ? 'Update' : 'Add')} Item
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{menu.name}</h3>
                  <p className="text-gray-600 mb-3">{menu.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">₹{menu.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      menu.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {menu.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Category: {menu.category}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMenuEdit(menu)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleMenuDelete(menu._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'inventory' && (
          <InventoryManagement />
        )}

        {activeTab === 'staff' && (
          <StaffManagement />
        )}

        {activeTab === 'kitchen' && (
          <KitchenDisplay />
        )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;