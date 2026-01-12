import React, { useState, useEffect } from 'react';
import AddItem from './AddItem';
import EditItem from './EditItem';

const ItemList = () => {
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    if (view === 'list') {
      const loadItems = async () => {
        if (!isMounted) return;
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/get/all-menu-items`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok && isMounted) {
            const data = await response.json();
            setItems(data.menuItems || []);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching items:', error);
          }
        }
        if (isMounted) {
          setLoading(false);
        }
      };

      loadItems();
    }
    
    return () => {
      isMounted = false;
    };
  }, [view]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/get/all-menu-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.menuItems || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/delete/menu-item/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
        alert('Item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setView('edit');
  };

  const handleAddSuccess = () => {
    setView('list');
  };

  const handleEditSuccess = () => {
    setView('list');
    setEditingItem(null);
  };

  if (view === 'add') {
    return <AddItem onSuccess={handleAddSuccess} onBack={() => setView('list')} />;
  }

  if (view === 'edit') {
    return <EditItem item={editingItem} onSuccess={handleEditSuccess} onBack={() => setView('list')} />;
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setView('add')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>
      
      {items.map(item => (
        <div key={item._id} className="bg-white p-4 rounded-lg shadow-md border">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.itemName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{item.itemName}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.foodType === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.foodType === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span> {item.categoryID?.name || 'N/A'}
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Prep Time:</span> {item.timeToPrepare} min
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Price:</span> 
                {item.variation && item.variation.length > 0 ? (
                  <span>₹{Math.min(...item.variation.map(v => v.price || 0))}</span>
                ) : (
                  <span className="text-gray-400">No variations</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No items found. Add some items to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;