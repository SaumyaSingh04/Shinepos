import React, { useState } from 'react';
import { FiX, FiCreditCard, FiDollarSign } from 'react-icons/fi';

const PaymentModal = ({ order, onProcessPayment, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: FiDollarSign },
    { value: 'CARD', label: 'Card', icon: FiCreditCard },
    { value: 'UPI', label: 'UPI', icon: FiCreditCard },
    { value: 'ONLINE', label: 'Online', icon: FiCreditCard }
  ];

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((paymentMethod !== 'CASH') && !transactionId.trim()) {
      setError('Transaction ID is required for non-cash payments');
      return;
    }

    setLoading(true);
    setError('');

    const paymentData = {
      method: paymentMethod,
      amount: order.totalAmount,
      transactionId: transactionId.trim() || undefined
    };

    const result = await onProcessPayment(order._id, paymentData);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // Modal will close automatically on success
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Process Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Customer:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction ID */}
          {paymentMethod !== 'CASH' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter transaction ID"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Process ${formatCurrency(order.totalAmount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;