import React, { useState, useEffect } from 'react';
import AddAddon from './AddAddon';

const AddonList = ({ addons, loading, onAdd, onEdit, onDelete }) => {
  const toggleAddonStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/update/addon/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: newStatus })
      });
      
      if (response.ok) {
        onDelete(); // Refresh data in parent
      }
    } catch (error) {
      console.error('Error updating addon status:', error);
    }
  };

  const deleteAddon = async (id) => {
    if (!confirm('Are you sure you want to delete this addon?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/delete/addon/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Addon deleted successfully!');
        onDelete(); // Refresh data in parent
      }
    } catch (error) {
      console.error('Error deleting addon:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Addons</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Addon
        </button>
      </div>
      
      <div className="grid gap-4">
        {addons.map(addon => (
          <div key={addon._id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{addon.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    addon.veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {addon.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    addon.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {addon.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Price:</span> ₹{addon.price}
                </div>
                
                {addon.description && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Description:</span> {addon.description}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAddonStatus(addon._id, addon.available)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    addon.available ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      addon.available ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <button
                  onClick={() => onEdit && onEdit(addon)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAddon(addon._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      
      {addons.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No addons found. Add some addons to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AddonList;