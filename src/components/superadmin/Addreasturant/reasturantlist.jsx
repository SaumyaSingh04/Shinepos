import React from 'react';
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useRestaurantList } from './hooks/useRestaurantList';

const RestaurantList = ({ onEdit }) => {
  const navigate = useNavigate();
  const { restaurants, loading, toggleStatus, deleteRestaurant } = useRestaurantList();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <tr key={restaurant._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{restaurant.restaurantName}</div>
                <div className="text-sm text-gray-500">{restaurant.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.ownerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  restaurant.subscriptionPlan === 'trial' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {restaurant.subscriptionPlan}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  restaurant.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleStatus(restaurant._id)}
                    className={restaurant.isActive ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}
                    title={restaurant.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {restaurant.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                  </button>
                  <button
                    onClick={() => onEdit(restaurant)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteRestaurant(restaurant._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;
