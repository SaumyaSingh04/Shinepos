import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ingredient',
    currentStock: '',
    minStock: '',
    unit: 'kg',
    costPerUnit: '',
    supplier: ''
  });

  useEffect(() => {
    fetchInventory();
    fetchLowStockItems();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory`);
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory/low-stock`);
      setLowStockItems(response.data.lowStockItems);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/inventory/${editingItem._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/inventory`, formData);
      }
      setFormData({ name: '', category: 'ingredient', currentStock: '', minStock: '', unit: 'kg', costPerUnit: '', supplier: '' });
      setShowAddForm(false);
      setEditingItem(null);
      fetchInventory();
      fetchLowStockItems();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleRestock = async (itemId, quantity) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/inventory/${itemId}/restock`, { quantity: parseInt(quantity) });
      fetchInventory();
      fetchLowStockItems();
    } catch (error) {
      console.error('Error restocking item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingItem(null);
            setFormData({ name: '', category: 'ingredient', currentStock: '', minStock: '', unit: 'kg', costPerUnit: '', supplier: '' });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showAddForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Low Stock Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map(item => (
              <div key={item._id} className="text-sm text-red-700">
                {item.name}: {item.currentStock} {item.unit} (Min: {item.minStock})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="ingredient">Ingredient</option>
              <option value="beverage">Beverage</option>
              <option value="packaging">Packaging</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Current Stock"
              value={formData.currentStock}
              onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Min Stock Level"
              value={formData.minStock}
              onChange={(e) => setFormData({...formData, minStock: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="kg">Kg</option>
              <option value="g">Grams</option>
              <option value="l">Liters</option>
              <option value="ml">ML</option>
              <option value="pieces">Pieces</option>
              <option value="boxes">Boxes</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Cost per Unit"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Supplier (Optional)"
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </form>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item._id} className={item.isLowStock ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {item.supplier && <div className="text-sm text-gray-500">{item.supplier}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.currentStock} / {item.minStock}</div>
                  {item.isLowStock && <span className="text-xs text-red-600">Low Stock!</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.costPerUnit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const quantity = prompt('Enter restock quantity:');
                      if (quantity) handleRestock(item._id, quantity);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;