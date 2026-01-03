import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunicationCenter = () => {
  const [messages, setMessages] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
    priority: 'MEDIUM',
    recipients: 'ALL',
    specificRestaurants: []
  });

  useEffect(() => {
    fetchMessages();
    fetchRestaurants();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/communication');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/communication', formData);
      setFormData({
        title: '',
        message: '',
        type: 'ANNOUNCEMENT',
        priority: 'MEDIUM',
        recipients: 'ALL',
        specificRestaurants: []
      });
      setShowCreateForm(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRestaurantSelect = (restaurantId) => {
    const selected = formData.specificRestaurants.includes(restaurantId)
      ? formData.specificRestaurants.filter(id => id !== restaurantId)
      : [...formData.specificRestaurants, restaurantId];
    
    setFormData({ ...formData, specificRestaurants: selected });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="p-6">Loading messages...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Communication Center</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showCreateForm ? 'Cancel' : 'Send Message'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Send New Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="NOTIFICATION">Notification</option>
                  <option value="ALERT">Alert</option>
                  <option value="UPDATE">Update</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Recipients</label>
                <select
                  name="recipients"
                  value={formData.recipients}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Restaurants</option>
                  <option value="ACTIVE">Active Restaurants</option>
                  <option value="TRIAL">Trial Restaurants</option>
                  <option value="SPECIFIC">Specific Restaurants</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formData.recipients === 'SPECIFIC' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Restaurants</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                  {restaurants.map((restaurant) => (
                    <label key={restaurant._id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.specificRestaurants.includes(restaurant._id)}
                        onChange={() => handleRestaurantSelect(restaurant._id)}
                        className="mr-2"
                      />
                      {restaurant.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sent Messages ({messages.length})</h3>
        {messages.map((message) => (
          <div key={message._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold">{message.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                  <span className="text-sm text-gray-600">{message.type}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{message.recipients}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(message.sentAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{message.message}</p>
            <div className="text-sm text-gray-500">
              Sent by: {message.sentBy?.name} • Read by: {message.readBy?.length || 0} restaurants
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationCenter;