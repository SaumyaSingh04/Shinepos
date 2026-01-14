import React, { useState, useEffect } from 'react';
import AddVariation from './AddVariation';

const VariationList = ({ variations, loading, onAdd, onEdit, onDelete }) => {
  const toggleVariationStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/variation/update/variation/${id}`, {
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
      console.error('Error updating variation status:', error);
    }
  };

  const deleteVariation = async (id) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/variation/delete/variation/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Variation deleted successfully!');
        onDelete(); // Refresh data in parent
      }
    } catch (error) {
      console.error('Error deleting variation:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Variations</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Variation
        </button>
      </div>
      
      <div className="grid gap-4">
        {variations.map(variation => (
          <div key={variation._id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{variation.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    variation.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {variation.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Price:</span> ₹{variation.price}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleVariationStatus(variation._id, variation.available)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    variation.available ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      variation.available ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <button
                  onClick={() => onEdit && onEdit(variation)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVariation(variation._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      
      {variations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No variations found. Add some variations to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VariationList;