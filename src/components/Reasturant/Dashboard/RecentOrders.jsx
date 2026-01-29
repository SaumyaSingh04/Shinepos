import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import OrderDetailsPopup from './OrderDetailsPopup';

const RecentOrders = ({ orders, delay = 0, onOrderClick }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {orders.length > 0 ? orders.map((order, index) => (
          <motion.div 
            key={index} 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + (index * 0.1), duration: 0.3 }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setClickPosition({ x: rect.right, y: rect.top + rect.height / 2 });
              console.log('Clicked order:', order);
              setSelectedOrder(order);
            }}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium">{order.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{order.customer} • {Array.isArray(order.items) ? order.items.length : order.items} items</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">₹{order.amount}</p>
              <p className="text-gray-400 text-xs">{order.time}</p>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-300">No recent orders</p>
          </div>
        )}
      </div>
    </motion.div>

      {/* Order Details Popup */}
      {selectedOrder && (
        <OrderDetailsPopup 
          order={selectedOrder}
          position={clickPosition}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default RecentOrders;