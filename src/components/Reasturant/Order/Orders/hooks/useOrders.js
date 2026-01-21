import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

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
      
      // Fetch all tables to map merged table info
      const tablesResponse = await axios.get(`${API_BASE_URL}/api/table/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tables = tablesResponse.data.tables;
      
      // Enrich orders with merged table info
      const enrichedOrders = response.data.orders.map(order => {
        if (order.mergedTables && order.mergedTables.length > 0) {
          const mergedTableNumbers = order.mergedTables
            .map(tableId => tables.find(t => t._id === tableId)?.tableNumber)
            .filter(Boolean);
          return { ...order, mergedTableNumbers };
        }
        return order;
      });
      
      setOrders(enrichedOrders);
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
      const response = await axios.post(`${API_BASE_URL}/api/orders/add/staff`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(prev => [response.data.order, ...prev]);
      setActiveTab('list');
      return { success: true };
    } catch (err) {
      console.error('Create order error:', err);
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

  const handleUpdatePriority = async (orderId, priority) => {
    try {
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, priority } : order
      ));

      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/orders/update/priority/${orderId}`,
        { priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Update priority error:', err);
      setError('Failed to update order priority');
      fetchOrders();
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

  const handleTransferClick = (order) => {
    setSelectedOrder(order);
    setShowTransferModal(true);
  };

  const handleTransferSuccess = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    selectedOrder,
    setSelectedOrder,
    showPaymentModal,
    setShowPaymentModal,
    showTransferModal,
    setShowTransferModal,
    fetchOrders,
    handleCreateOrder,
    handleUpdateStatus,
    handleUpdatePriority,
    handleProcessPayment,
    handleViewOrder,
    handlePaymentClick,
    handleTransferClick,
    handleTransferSuccess
  };
};
