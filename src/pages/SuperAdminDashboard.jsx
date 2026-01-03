import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SystemMonitoring from '../components/superadmin/SystemMonitoring';
import AdvancedAnalytics from '../components/superadmin/AdvancedAnalytics';
import BillingManagement from '../components/superadmin/BillingManagement.jsx';
import SettingsManagement from '../components/superadmin/SettingsManagement.jsx';
import UserManagement from '../components/superadmin/UserManagement.jsx';
import CommunicationCenter from '../components/superadmin/CommunicationCenter.jsx';

const SuperAdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchRestaurants();
    fetchAnalytics();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/restaurants/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingRestaurant) {
        await axios.put(`/api/restaurants/${editingRestaurant._id}`, { name: formData.name });
        setEditingRestaurant(null);
      } else {
        await axios.post('/api/restaurants', formData);
      }
      setFormData({ name: '', adminEmail: '', adminPassword: '', adminName: '', phone: '', address: '', city: '', state: '', zipCode: '', cuisine: '', description: '' });
      setShowCreateForm(false);
      fetchRestaurants();
      fetchAnalytics();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save restaurant');
    }
    setLoading(false);
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({ name: restaurant.name, adminEmail: '', adminPassword: '', adminName: '', phone: '', address: '', city: '', state: '', zipCode: '', cuisine: '', description: '' });
    setShowCreateForm(true);
  };

  const handleDelete = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/restaurants/${restaurantId}`);
        fetchRestaurants();
        fetchAnalytics();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  const toggleRestaurantStatus = async (restaurantId) => {
    try {
      await axios.patch(`/api/restaurants/${restaurantId}/toggle-status`);
      fetchRestaurants();
      fetchAnalytics();
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
    }
  };

  const handleBulkToggle = async () => {
    if (selectedRestaurants.length === 0) return;
    
    try {
      await Promise.all(
        selectedRestaurants.map(id => 
          axios.patch(`/api/restaurants/${id}/toggle-status`)
        )
      );
      setSelectedRestaurants([]);
      fetchRestaurants();
      fetchAnalytics();
    } catch (error) {
      console.error('Error in bulk toggle:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-fill city and state when ZIP code is entered
    if (name === 'zipCode' && value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
            zipCode: value
          }));
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = analytics.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalOrders = analytics.reduce((sum, item) => sum + item.totalOrders, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage restaurants and system settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'monitoring', name: 'System Health', icon: '🔧' },
                { id: 'analytics', name: 'Analytics', icon: '📈' },
                { id: 'subscriptions', name: 'Billing', icon: '💳' },
                { id: 'settings', name: 'Settings', icon: '⚙️' },
                { id: 'communication', name: 'Communication', icon: '📢' },
                { id: 'users', name: 'User Management', icon: '👥' },
                { id: 'content', name: 'Content', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Restaurant Button */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingRestaurant(null);
              setFormData({ name: '', adminEmail: '', adminPassword: '', adminName: '', phone: '', address: '', city: '', state: '', zipCode: '', cuisine: '', description: '' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{showCreateForm ? 'Cancel' : 'Create New Restaurant'}</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {selectedRestaurants.length > 0 && (
              <button
                onClick={handleBulkToggle}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Bulk Toggle ({selectedRestaurants.length})
              </button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingRestaurant ? 'Edit Restaurant' : 'Create New Restaurant'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter restaurant name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                  <input
                    type="text"
                    name="cuisine"
                    placeholder="e.g., Italian, Chinese, American"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {!editingRestaurant && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                      <input
                        type="text"
                        name="adminName"
                        placeholder="Enter admin name"
                        value={formData.adminName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        name="adminEmail"
                        placeholder="Enter admin email"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
                      <input
                        type="password"
                        name="adminPassword"
                        placeholder="Enter admin password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Enter 6-digit PIN code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    maxLength="6"
                    pattern="[0-9]{6}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">City and state will auto-fill</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter restaurant description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? (editingRestaurant ? 'Updating...' : 'Creating...') : (editingRestaurant ? 'Update Restaurant' : 'Create Restaurant')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Restaurants List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Restaurants ({filteredRestaurants.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRestaurants(filteredRestaurants.map(r => r._id));
                        } else {
                          setSelectedRestaurants([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRestaurants.map((restaurant) => {
                  const restaurantAnalytics = analytics.find(a => a.restaurantId === restaurant._id) || {};
                  return (
                    <tr key={restaurant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRestaurants.includes(restaurant._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRestaurants([...selectedRestaurants, restaurant._id]);
                            } else {
                              setSelectedRestaurants(selectedRestaurants.filter(id => id !== restaurant._id));
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                          <div className="text-sm text-gray-500">{restaurant.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          restaurant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurantAnalytics.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(restaurantAnalytics.totalRevenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(restaurant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleEdit(restaurant)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleRestaurantStatus(restaurant._id)}
                          className={`${restaurant.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {restaurant.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          onClick={() => handleDelete(restaurant._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants found</h3>
              <p className="mt-1 text-sm text-gray-500">{searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new restaurant.'}</p>
            </div>
          )}
        </div>
          </div>
        )}

        {activeTab === 'monitoring' && <SystemMonitoring />}
        {activeTab === 'analytics' && <AdvancedAnalytics />}
        {activeTab === 'subscriptions' && <BillingManagement />}
        
        {activeTab === 'settings' && <SettingsManagement />}
        
        {activeTab === 'communication' && <CommunicationCenter />}
        
        {activeTab === 'users' && <UserManagement />}
        
        {activeTab === 'content' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content Management</h3>
            <p className="text-gray-500">Help docs, tutorials, and system content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;