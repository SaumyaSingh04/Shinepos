import React, { useState } from 'react';
import { FiPlus, FiEye } from 'react-icons/fi';
import OrderList from './OrderList';
import CreateOrder from './CreateOrder';
import OrderDetails from './OrderDetails';
import PaymentModal from '../Payment/PaymentModal';
import TransferModal from './TransferModal';
import AddNewOrder from '../AddNewOrder';
import { useOrders } from './hooks/useOrders';

const Order = () => {
  const [showAddItems, setShowAddItems] = useState(null);
  const {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    selectedOrder,
    setSelectedOrder,
    showPaymentModal,
    setShowPaymentModal,
    showTransferModal,
    setShowTransferModal,
    fetchOrders,
    handleCreateOrder,
    handleUpdateStatus,
    handleUpdatePriority,
    handleProcessPayment,
    handleViewOrder,
    handlePaymentClick,
    handleTransferClick,
    handleTransferSuccess
  } = useOrders();

  const handleAddItems = (orderId) => {
    console.log('handleAddItems called with orderId:', orderId);
    setShowAddItems(orderId);
  };

  const handleAddItemsClose = () => {
    setShowAddItems(null);
    fetchOrders();
    setActiveTab('list'); // Redirect to orders page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiEye />
            <span>Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'create' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiPlus />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {activeTab === 'list' && (
        <OrderList
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          onProcessPayment={handlePaymentClick}
          onAddItems={handleAddItems}
          onTransfer={handleTransferClick}
          onRefresh={fetchOrders}
        />
      )}

      {activeTab === 'create' && (
        <CreateOrder
          onCreateOrder={handleCreateOrder}
          onCancel={() => setActiveTab('list')}
        />
      )}

      {activeTab === 'details' && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onProcessPayment={handlePaymentClick}
          onBack={() => setActiveTab('list')}
        />
      )}

      {showPaymentModal && selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          onProcessPayment={handleProcessPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showAddItems && (
        <div>
          <p>Debug: showAddItems = {showAddItems}</p>
          <AddNewOrder
            orderId={showAddItems}
            onClose={handleAddItemsClose}
          />
        </div>
      )}

      {showTransferModal && selectedOrder && (
        <TransferModal
          order={selectedOrder}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};

export default Order;