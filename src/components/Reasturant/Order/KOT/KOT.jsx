import React, { useState, useEffect } from 'react';
import KOTHistory from './KOTHistory';

const KOT = () => {
  const [kots, setKots] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching kitchen orders with token:', token ? 'Present' : 'Missing');
      
      // Fetch kitchen data and orders separately
      const [kitchenResponse, ordersResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/all/kitchen/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/all/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (kitchenResponse.ok && ordersResponse.ok) {
        const kitchenData = await kitchenResponse.json();
        const ordersData = await ordersResponse.json();
        
        console.log('Kitchen data:', kitchenData);
        console.log('Orders data:', ordersData);
        
        const activeKots = (kitchenData.kots || []).filter(kot => 
          kot.status !== 'DELIVERED' && kot.status !== 'CANCELLED' && kot.status !== 'PAID'
        );
        
        // Merge KOT data with order data to include extra items
        const kotsWithExtraItems = activeKots.map(kot => {
          const associatedOrder = ordersData.orders?.find(order => order._id === kot.orderId);
          console.log('KOT:', kot.kotNumber, 'KOT extraItems:', kot.extraItems?.length || 0, 'Order extraItems:', associatedOrder?.extraItems?.length || 0);
          return {
            ...kot,
            extraItems: [...(kot.extraItems || []), ...(associatedOrder?.extraItems || [])]
          };
        });
        
        setKots(kotsWithExtraItems);
        setOrders(ordersData.orders || []);
      } else {
        console.error('API error:', kitchenResponse.status, ordersResponse.status);
      }
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    }
    setLoading(false);
  };

  const updateKOTStatus = async (kotId, newStatus) => {
    try {
      // Optimistically update UI
      if (newStatus === 'DELIVERED' || newStatus === 'CANCELLED' || newStatus === 'PAID') {
        setKots(prev => prev.filter(kot => kot._id !== kotId));
      } else {
        setKots(prev => prev.map(kot => 
          kot._id === kotId ? { ...kot, status: newStatus } : kot
        ));
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kot/${kotId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        // Revert on error
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating KOT status:', error);
      fetchKitchenOrders();
    }
  };

  const updateKOTPriority = async (kotId, priority) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kitchen/update/kot/priority/${kotId}`, {
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
      console.error('Error updating KOT priority:', error);
    }
  };

  const updateExtraItemStatus = async (orderId, itemIndex, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/update/extra-item-status/${orderId}/${itemIndex}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating extra item status:', error);
    }
  };

  if (loading) return <div className="p-6">Loading kitchen orders...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kitchen Orders (KOT)</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'active' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active KOTs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'history' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            History
          </button>
          <button
            onClick={fetchKitchenOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                        kot.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        kot.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        kot.priority === 'NORMAL' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {kot.priority || 'NORMAL'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      kot.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      kot.status === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                      kot.status === 'READY' ? 'bg-green-100 text-green-800' :
                      kot.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                      kot.status === 'PAID' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {kot.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    {/* Regular KOT Items */}
                    {kot.items?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {item.quantity}x {item.name}
                          </span>
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
                    
                    {/* Extra Items from Order */}
                    {kot.extraItems?.map((extraItem, index) => (
                      <div key={`extra-${index}`} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-600">
                            +{extraItem.quantity}x {extraItem.name}
                          </span>
                          <select
                            value={extraItem.status || 'PENDING'}
                            onChange={(e) => updateExtraItemStatus(kot.orderId, index, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border-0 ${
                              (extraItem.status || 'PENDING') === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              extraItem.status === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                              extraItem.status === 'READY' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY">Ready</option>
                            <option value="SERVED">Served</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <select
                      value={kot.status}
                      onChange={(e) => updateKOTStatus(kot._id, e.target.value)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium border-0 ${
                        kot.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        kot.status === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                        kot.status === 'READY' ? 'bg-green-100 text-green-800' :
                        kot.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                        kot.status === 'PAID' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="READY">Ready</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="PAID">Paid</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {kots.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No active KOTs in kitchen</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && <KOTHistory />}
    </div>
  );
};

export default KOT;