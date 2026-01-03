import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CashierPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const processPayment = async (orderId) => {
    try {
      await axios.post(`/api/orders/${orderId}/payment`, {
        paymentMethod,
        amount: selectedOrder.totalAmount
      });
      setShowPayment(false);
      setSelectedOrder(null);
      fetchOrders();
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const openPaymentModal = (order) => {
    setSelectedOrder(order);
    setShowPayment(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-blue-100 text-blue-800',
      READY: 'bg-green-100 text-green-800',
      DELIVERED: 'bg-purple-100 text-purple-800',
      PAID: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Cashier Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Orders</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">#{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Items:</p>
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-bold">Total: ${order.totalAmount}</div>
                    {(order.status === 'READY' || order.status === 'DELIVERED') && order.status !== 'PAID' && (
                      <button
                        onClick={() => openPaymentModal(order)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Orders:</span>
                <span className="font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'PENDING').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ready:</span>
                <span className="font-bold text-green-600">
                  {orders.filter(o => o.status === 'READY').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold text-purple-600">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span>Total Revenue:</span>
                <span className="font-bold text-green-600">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cash:</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Card:</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Digital:</span>
                <span className="font-bold">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Process Payment</h3>
            
            <div className="mb-4">
              <p className="font-medium">Order: #{selectedOrder.orderNumber}</p>
              <p className="text-gray-600">Customer: {selectedOrder.customerName}</p>
              <p className="text-lg font-bold">Total: ${selectedOrder.totalAmount}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="DIGITAL">Digital Wallet</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => processPayment(selectedOrder._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Process Payment
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierPage;