import React, { useState } from 'react';
import { FiRefreshCw, FiUser, FiPhone, FiGrid, FiShoppingBag, FiFileText, FiPlus, FiRotateCcw, FiCreditCard, FiChevronDown } from 'react-icons/fi';

const OrderList = ({ orders, onViewOrder, onUpdateStatus, onProcessPayment, onRefresh, onUpdatePriority, onTransfer, onAddItems, activeTab, setActiveTab }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedOrderItems, setExpandedOrderItems] = useState(null);

  console.log('OrderList loaded with onUpdatePriority:', !!onUpdatePriority);
  console.log('Sample order priority:', orders[0]?.priority);

  const statusColors = {
    PENDING: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
    PREPARING: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    READY: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    DELIVERED: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    CANCELLED: 'bg-gradient-to-r from-red-500 to-red-700 text-white',
    PAID: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Set first order as selected by default
  React.useEffect(() => {
    if (filteredOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [filteredOrders, selectedOrder]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6">
      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side - Order List */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden lg:col-span-1 self-start sticky top-6">
          <div className="p-4 border-b border-white/30">
            <h3 className="text-xl font-bold text-gray-900"><FiShoppingBag className="inline mr-2" />Orders ({filteredOrders.length})</h3>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-300px)] p-4 space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleOrderClick(order)}
                className={`bg-white/30 backdrop-blur-md rounded-xl p-4 cursor-pointer transition-colors hover:bg-white/40 border ${
                  selectedOrder?._id === order._id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-700"><FiGrid className="inline mr-1" />{order.tableNumber || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-900 text-sm cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    setExpandedOrderItems(expandedOrderItems === order._id ? null : order._id);
                  }}>
                    <div className="flex items-center gap-1">
                      <FiChevronDown className={`transition-transform ${expandedOrderItems === order._id ? 'rotate-180' : ''}`} />
                      <span>{order.items.length} items</span>
                    </div>
                    {expandedOrderItems === order._id && (
                      <div className="mt-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-700">{item.quantity}x {item.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-green-700">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-gray-900 font-medium">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Order Details */}
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden lg:col-span-2">
          {selectedOrder ? (
            <>
              <div className="p-4 border-b border-white/30">
                <h3 className="text-xl font-bold text-gray-900"><FiFileText className="inline mr-2" />Order Details</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Customer Info & Order Items in Same Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3"><FiUser className="inline mr-2" />Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                      {selectedOrder.customerPhone && (
                        <p className="text-gray-900"><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                      )}
                      <p className="text-gray-900"><span className="font-medium">Table:</span> {selectedOrder.tableNumber || 'N/A'}</p>
                      {selectedOrder.mergedTableNumbers && selectedOrder.mergedTableNumbers.length > 0 && (
                        <p className="text-purple-700 font-medium"><FiRotateCcw className="inline mr-1" />Merged: {selectedOrder.mergedTableNumbers.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                    <h4 className="font-bold text-gray-900 mb-3"><FiShoppingBag className="inline mr-2" />Order Items</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start text-sm bg-white/20 p-2 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.quantity}x {item.name}</p>
                            {item.variation && <p className="text-xs text-gray-700">Variation: {item.variation.name}</p>}
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary & Actions */}
                <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-700">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAddItems && onAddItems(selectedOrder._id)}
                      className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/50 text-gray-900 rounded-xl font-medium border border-white/40"
                    >
                      <FiPlus className="inline mr-1" />Add
                    </button>
                    {selectedOrder.tableId && selectedOrder.status !== 'PAID' && selectedOrder.status !== 'CANCELLED' && (
                      <button
                        onClick={() => onTransfer(selectedOrder)}
                        className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/50 text-gray-900 rounded-xl font-medium border border-white/40"
                      >
                        <FiRotateCcw className="inline mr-1" />Transfer
                      </button>
                    )}
                    {!selectedOrder.paymentDetails && (
                      <button
                        onClick={() => onProcessPayment(selectedOrder)}
                        className="flex-1 p-3 bg-white/30 backdrop-blur-md hover:bg-white/50 text-gray-900 rounded-xl font-medium border border-white/40"
                      >
                        <FiCreditCard className="inline mr-1" />Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-10">
              <div className="text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-900 font-medium text-lg">Select an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
