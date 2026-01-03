import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KitchenPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders.filter(order => 
        ['PENDING', 'PREPARING'].includes(order.status)
      ));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Kitchen Orders (KOT)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                order.status === 'PENDING' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>{item.quantity}x {item.name}</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 mb-3">
              Order Time: {new Date(order.createdAt).toLocaleTimeString()}
            </div>

            <div className="flex gap-2">
              {order.status === 'PENDING' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'PREPARING')}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm"
                >
                  Start Cooking
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'READY')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                >
                  Mark Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending orders in kitchen</p>
        </div>
      )}
    </div>
  );
};

export default KitchenPage;