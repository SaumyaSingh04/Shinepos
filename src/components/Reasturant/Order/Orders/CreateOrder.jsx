import React from 'react';
import { FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { useCreateOrder } from './hooks/useCreateOrder';

const CreateOrder = ({ onCreateOrder, onCancel }) => {
  const {
    menuItems,
    tables,
    orderItems,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    guestCount,
    setGuestCount,
    selectedTable,
    setSelectedTable,
    showMergeOption,
    selectedTablesForMerge,
    selectedCapacity,
    isCapacityMet,
    toggleTableSelection,
    loading,
    error,
    selectedItem,
    selectedVariation,
    setSelectedVariation,
    selectedAddons,
    setSelectedAddons,
    openItemModal,
    closeItemModal,
    addItemToOrder,
    updateItemQuantity,
    removeItem,
    calculateTotal,
    handleSubmit
  } = useCreateOrder(onCreateOrder);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Create New Order</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Customer Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests *
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            {showMergeOption ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tables to Merge *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {tables.filter(t => t.status === 'AVAILABLE').map(table => {
                    const isDisabled = !selectedTablesForMerge.includes(table._id) && isCapacityMet;
                    
                    return (
                      <label key={table._id} className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedTablesForMerge.includes(table._id)}
                          disabled={isDisabled}
                          onChange={() => toggleTableSelection(table._id)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {table.tableNumber} (Capacity: {table.capacity})
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Guest count exceeds single table capacity. Select multiple tables. (Selected: {selectedCapacity}/{guestCount})
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table (Optional)
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Table</option>
                  {tables.filter(t => t.status === 'AVAILABLE').map(table => (
                    <option key={table._id} value={table._id}>
                      {table.tableNumber} (Capacity: {table.capacity})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Order Items</h3>
            
            {orderItems.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.variation.name} - ₹{item.price}
                        {item.addons.length > 0 && (
                          <div className="text-xs text-gray-500">
                            + {item.addons.map(a => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <FiMinus size={14} />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                      >
                        <FiPlus size={14} />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-right">
              <div className="text-lg font-semibold">
                Total: ₹{calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Add Items from Menu</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{item.itemName}</h4>
                  <span className="text-sm font-semibold text-green-600">
                    ₹{item.variation && item.variation.length > 0 
                      ? Math.min(...item.variation.map(v => v.price || 0))
                      : 0}
                  </span>
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                )}
                
                <button
                  type="button"
                  onClick={() => openItemModal(item)}
                  disabled={item.status !== 'active'}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                    item.status === 'active'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.status === 'active' ? 'Add to Order' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Item Selection Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">{selectedItem.itemName}</h3>
              
              {/* Variations */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Variation</label>
                {selectedItem.variation?.map(variation => (
                  <label key={variation._id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="variation"
                      checked={selectedVariation?._id === variation._id}
                      onChange={() => setSelectedVariation(variation)}
                      className="mr-2"
                    />
                    {variation.name} - ₹{variation.price}
                  </label>
                ))}
              </div>
              
              {/* Addons */}
              {selectedItem.addon?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Addons</label>
                  {selectedItem.addon.map(addon => (
                    <label key={addon._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedAddons.some(a => a._id === addon._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAddons(prev => [...prev, addon]);
                          } else {
                            setSelectedAddons(prev => prev.filter(a => a._id !== addon._id));
                          }
                        }}
                        className="mr-2"
                      />
                      {addon.name} - ₹{addon.price}
                    </label>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeItemModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addItemToOrder}
                  disabled={!selectedVariation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || orderItems.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;