import React, { useState, useEffect } from 'react';

const KOT = () => {
  const [orders, setOrders] = useState([]);
  const [kots, setKots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching kitchen orders with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/all/kitchen/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Kitchen API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Kitchen orders data:', data);
        setOrders(data.orders || []);
        setKots(data.kots || []);
      } else {
        const errorData = await response.text();
        console.error('Kitchen API error:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    }
    setLoading(false);
  };

  const updateKOTStatus = async (kotId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/update/kot/status/${kotId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating KOT status:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/update/orders/status/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const setPriority = async (orderId, priority) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/update/orders/priority/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority })
      });
      
      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error setting priority:', error);
    }
  };

  if (loading) return <div className="p-6">Loading kitchen orders...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kitchen Orders (KOT)</h2>
        <button
          onClick={fetchKitchenOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Display KOTs first (they have priority) */}
        {kots.map(kot => (
          <div key={kot._id} className={`bg-white rounded-lg shadow-md border-l-4 ${
            kot.priority === 'HIGH' || kot.priority === 'URGENT' ? 'border-red-500' : 
            kot.priority === 'NORMAL' ? 'border-yellow-500' : 'border-green-500'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{kot.kotNumber}</h3>
                  <p className="text-sm text-gray-600">{kot.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(kot.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  kot.status === 'PENDING' ? 'bg-red-100 text-red-800' :
                  kot.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {kot.status}
                </span>
              </div>

              <div className="mb-4">
                {kot.items?.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                    </div>
                    {item.variation && (
                      <div className="text-sm text-gray-600 ml-4">
                        • {item.variation.name}
                      </div>
                    )}
                    {item.addons?.map((addon, addonIndex) => (
                      <div key={addonIndex} className="text-sm text-gray-600 ml-4">
                        + {addon.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {kot.status === 'PENDING' && (
                  <button
                    onClick={() => updateKOTStatus(kot._id, 'IN_PROGRESS')}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Start Preparing
                  </button>
                )}
                {kot.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateKOTStatus(kot._id, 'COMPLETED')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Display Orders without KOTs */}
        {orders.map(order => (
          <div key={order._id} className={`bg-white rounded-lg shadow-md border-l-4 ${
            order.priority === 'high' ? 'border-red-500' : 
            order.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === 'PENDING' ? 'bg-red-100 text-red-800' :
                  order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                    </div>
                    {item.variation && (
                      <div className="text-sm text-gray-600 ml-4">
                        • {item.variation.name}
                      </div>
                    )}
                    {item.addons?.map((addon, addonIndex) => (
                      <div key={addonIndex} className="text-sm text-gray-600 ml-4">
                        + {addon.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                <select
                  value={order.priority || 'normal'}
                  onChange={(e) => setPriority(order._id, e.target.value)}
                  className="text-xs px-2 py-1 border rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-2">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'PREPARING')}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'READY')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && kots.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No pending orders in kitchen</p>
        </div>
      )}
    </div>
  );
};

export default KOT;