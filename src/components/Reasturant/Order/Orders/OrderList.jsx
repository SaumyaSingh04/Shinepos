import React, { useState } from 'react';
import { FiEye, FiEdit, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

const OrderList = ({ orders, onViewOrder, onUpdateStatus, onProcessPayment, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ORDER_ACCEPTED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
    SERVED: 'bg-purple-100 text-purple-800',
    COMPLETE: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800'
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="ORDER_ACCEPTED">Accepted</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="SERVED">Served</option>
              <option value="COMPLETE">Complete</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    {order.customerPhone && (
                      <div className="text-gray-500">{order.customerPhone}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[order.status]}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ORDER_ACCEPTED">Accepted</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="SERVED">Served</option>
                    <option value="COMPLETE">Complete</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-sm">
                  {order.paymentDetails ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {order.paymentDetails.method}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    {!order.paymentDetails && (
                      <button
                        onClick={() => onProcessPayment(order)}
                        className="text-green-600 hover:text-green-800"
                        title="Process Payment"
                      >
                        <FiDollarSign />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrderList;