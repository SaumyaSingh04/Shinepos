import React, { useState, useEffect } from 'react';
import RestaurantAdd from './reasturantadd';
import RestaurantList from './reasturantlist';
import EditRestaurantInline from './EditRestaurantInline';

const Restaurants = () => {
  const [showAddPage, setShowAddPage] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setShowAddPage(false);
    };

    if (showAddPage) {
      window.history.pushState({ addPage: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showAddPage]);

  if (editingRestaurant) {
    return (
      <div className="p-6">
        <EditRestaurantInline 
          restaurant={editingRestaurant}
          onBack={() => setEditingRestaurant(null)}
          onSuccess={() => setEditingRestaurant(null)}
        />
      </div>
    );
  }

  if (showAddPage) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowAddPage(false)}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Restaurants
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Restaurant</h1>
        <RestaurantAdd onSuccess={() => setShowAddPage(false)} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Restaurants Management</h1>
        <button
          onClick={() => setShowAddPage(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Restaurant
        </button>
      </div>

      <RestaurantList onEdit={setEditingRestaurant} />
    </div>
  );
};

export default Restaurants;
