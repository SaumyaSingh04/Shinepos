import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiPhone } from 'react-icons/fi';

const OrderHistory = () => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/all/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const completedOrders = (data.orders || []).filter(order => 
          order.status === 'PAID' || order.status === 'CANCELLED'
        );
        setHistoryOrders(completedOrders);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">📜</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-900 font-medium">Loading history...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn space-y-4">
      {historyOrders.length > 0 ? (
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/30 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Table</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Items</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white/20 backdrop-blur-md">
              {historyOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <tr 
                    className="border-t border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiChevronDown className={`transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          {order.customerPhone && (
                            <p className="text-sm text-gray-700"><FiPhone className="inline mr-1" /> {order.customerPhone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{order.tableNumber || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {expandedOrder === order._id ? (
                          order.items?.map((item, idx) => (
                            <span key={idx} className="bg-white/30 backdrop-blur-md text-gray-900 text-xs px-2 py-1 rounded">
                              {item.quantity}x {item.name}
                            </span>
                          ))
                        ) : (
                          <>
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <span key={idx} className="bg-white/30 backdrop-blur-md text-gray-900 text-xs px-2 py-1 rounded">
                                {item.quantity}x {item.name}
                              </span>
                            ))}
                            {order.items?.length > 2 && (
                              <span className="text-xs text-gray-700">+{order.items.length - 2} more</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-1000">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                        order.status === 'PAID' ? 'bg-gray-600 text-white' : 'bg-red-500/30 text-red-900 backdrop-blur-md'
                      }`}>
                        {order.status === 'PAID' ? 'PAID' : 'CANCELLED'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="text-6xl mb-4 animate-pulse-slow">📜</div>
          <p className="text-gray-500 text-lg font-medium">No order history available</p>
          <p className="text-gray-400 text-sm mt-2">Completed orders will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;