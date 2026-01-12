import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEye, FiEdit, FiDollarSign } from 'react-icons/fi';
import OrderList from './OrderList';
import CreateOrder from './CreateOrder';
import OrderDetails from './OrderDetails';
import PaymentModal from './PaymentModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/orders/all/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending order data:', orderData);
      const response = await axios.post(`${API_BASE_URL}/api/orders/add/staff`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(prev => [response.data.order, ...prev]);
      setActiveTab('list');
      return { success: true };
    } catch (err) {
      console.error('Create order error:', err);
      console.error('Error response:', err.response?.data);
      return { success: false, error: err.response?.data?.error || 'Failed to create order' };
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/orders/update/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(prev => prev.map(order => 
        order._id === orderId ? response.data.order : order
      ));
      
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(response.data.order);
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError('Failed to update order status');
    }
  };

  const handleProcessPayment = async (orderId, paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/orders/payment/${orderId}`,
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(prev => prev.map(order => 
        order._id === orderId ? response.data.order : order
      ));
      
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(response.data.order);
      }
      
      setShowPaymentModal(false);
      return { success: true };
    } catch (err) {
      console.error('Process payment error:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to process payment' };
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveTab('details');
  };

  const handlePaymentClick = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiEye />
            <span>Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'create' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiPlus />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {activeTab === 'list' && (
        <OrderList
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateStatus}
          onProcessPayment={handlePaymentClick}
          onRefresh={fetchOrders}
        />
      )}

      {activeTab === 'create' && (
        <CreateOrder
          onCreateOrder={handleCreateOrder}
          onCancel={() => setActiveTab('list')}
        />
      )}

      {activeTab === 'details' && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onProcessPayment={handlePaymentClick}
          onBack={() => setActiveTab('list')}
        />
      )}

      {showPaymentModal && selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onProcessPayment={handleProcessPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default Order;