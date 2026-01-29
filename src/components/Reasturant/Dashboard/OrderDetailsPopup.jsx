import React from 'react';
import { motion } from 'framer-motion';

const OrderDetailsPopup = ({ order, position, onClose }) => {
  if (!order) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      ></motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-blue-600/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">Order Details</h3>
              <span className="text-white text-sm">{order.orderNumber}</span>
              <span className="text-white text-sm">Viewing {order.orderNumber}</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded p-0.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {/* Order Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div>
                <p className="text-xs text-gray-300 uppercase mb-0.5">Customer</p>
                <p className="text-sm font-semibold text-white">{order.customerName || 'Guest'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase mb-0.5">Status</p>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                  order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase mb-0.5">Date</p>
                <p className="text-sm font-semibold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase mb-0.5">Time</p>
                <p className="text-sm font-semibold text-white">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-white mb-2">Order Items</h4>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-semibold text-gray-300 uppercase">Item</th>
                      <th className="px-3 py-1.5 text-center font-semibold text-gray-300 uppercase">Qty</th>
                      <th className="px-3 py-1.5 text-right font-semibold text-gray-300 uppercase">Price</th>
                      <th className="px-3 py-1.5 text-right font-semibold text-gray-300 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={index} className="border-b border-white/5 last:border-0">
                          <td className="px-3 py-1.5 text-white">{item.name || item.menuItem?.name || 'Unknown'}</td>
                          <td className="px-3 py-1.5 text-center text-gray-300">{item.quantity}</td>
                          <td className="px-3 py-1.5 text-right text-gray-300">₹{item.price || item.menuItem?.price || 0}</td>
                          <td className="px-3 py-1.5 text-right font-semibold text-white">₹{item.itemTotal || (item.quantity * (item.price || item.menuItem?.price || 0))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-3 text-center text-gray-300">No items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded p-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-200">Total Amount</span>
                <span className="text-lg font-bold text-white">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderDetailsPopup;
