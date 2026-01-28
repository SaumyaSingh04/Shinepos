import React, { useState } from 'react';
import { FiRefreshCw, FiEdit, FiPackage, FiTrash2 } from 'react-icons/fi';

const InventoryList = ({ inventory, onUpdate, onRestock, onRefresh, onEdit, onDelete }) => {
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const handleRestock = async () => {
    if (!restockQty || restockQty <= 0) return;
    
    const result = await onRestock(restockModal, parseInt(restockQty));
    if (result.success) {
      setRestockModal(null);
      setRestockQty('');
    }
  };

  const handleDelete = async () => {
    const result = await onDelete(deleteModal);
    if (result.success) {
      setDeleteModal(null);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl animate-fadeIn">
      <div className="p-6 border-b border-white/30 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">📦 Inventory Items</h2>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors"
        >
          <FiRefreshCw />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/30 backdrop-blur-lg">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Current Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Min Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Cost/Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {inventory.map((item) => (
              <tr key={item._id} className={`hover:bg-white/20 transition-colors ${item.isLowStock ? 'bg-orange-500/20' : ''}`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 capitalize">{item.category}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-medium ${item.isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                    {item.currentStock}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.minStock}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹{item.costPerUnit}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.supplier || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => setRestockModal(item._id)}
                      className="text-green-600 hover:text-green-800"
                      title="Restock"
                    >
                      <FiPackage />
                    </button>
                    <button
                      onClick={() => setDeleteModal(item._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inventory.length === 0 && (
        <div className="text-center py-8 text-gray-900">
          No inventory items found
        </div>
      )}

      {restockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Restock Item</h3>
            <input
              type="number"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full bg-white/40 backdrop-blur-lg border border-white/50 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              min="1"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleRestock}
                className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors"
              >
                ✓ Restock
              </button>
              <button
                onClick={() => {
                  setRestockModal(null);
                  setRestockQty('');
                }}
                className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors"
              >
                ← Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🗑️ Delete Item</h3>
            <p className="mb-4 text-gray-900">Are you sure you want to delete this item?</p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500/30 backdrop-blur-md hover:bg-red-500/40 text-red-700 rounded-xl transition-colors"
              >
                ✓ Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors"
              >
                ← Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
