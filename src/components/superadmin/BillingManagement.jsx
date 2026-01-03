import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillingManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const plans = {
    trial: { price: 0, name: 'Trial' },
    basic: { price: 29, name: 'Basic' },
    premium: { price: 79, name: 'Premium' },
    enterprise: { price: 199, name: 'Enterprise' }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/restaurants');
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurant data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (restaurantId, plan) => {
    try {
      await axios.put(`/api/subscriptions/restaurant/${restaurantId}/plan`, { plan });
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating plan:', error);
      setError('Failed to update subscription plan.');
    }
  };

  const getStatusColor = (plan) => {
    switch (plan) {
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading billing data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
        <button 
          onClick={fetchRestaurants}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Billing Management</h2>
      
      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <p className="text-gray-600">Slug: {restaurant.slug}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(restaurant.subscriptionPlan)}`}>
                  {plans[restaurant.subscriptionPlan]?.name || restaurant.subscriptionPlan?.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="font-medium">{plans[restaurant.subscriptionPlan]?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Price</p>
                  <p className="font-medium">${plans[restaurant.subscriptionPlan]?.price || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{restaurant.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {Object.entries(plans).map(([planKey, planData]) => (
                  <button
                    key={planKey}
                    onClick={() => updatePlan(restaurant._id, planKey)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      restaurant.subscriptionPlan === planKey
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {planData.name} (${planData.price})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillingManagement;