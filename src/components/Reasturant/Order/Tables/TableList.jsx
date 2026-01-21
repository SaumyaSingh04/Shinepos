import React from 'react';
import { FiLink } from 'react-icons/fi';

const TableList = ({ tables, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-red-100 text-red-800';
      case 'RESERVED': return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <div key={table._id} className="bg-white rounded-lg shadow p-4 border">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{table.tableNumber}</h3>
              {table.mergedWith && table.mergedWith.length > 0 && (
                <FiLink className="text-purple-600" title="Merged Table" />
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
              {table.status}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">Capacity: {table.capacity} people</p>
            <p className="text-sm text-gray-600">Location: {table.location}</p>
            {table.mergedWith && table.mergedWith.length > 0 && (
              <div className="text-sm text-purple-600 font-medium mt-2">
                <p>Merged Tables:</p>
                <p className="text-xs">
                  {table.mergedWith.map(id => {
                    const originalTable = tables.find(t => t._id === id);
                    return originalTable?.tableNumber;
                  }).filter(Boolean).join(', ')}
                </p>
                {table.mergedGuestCount && (
                  <p className="text-xs">Guests: {table.mergedGuestCount}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <select
              value={table.status}
              onChange={(e) => onUpdateStatus(table._id, e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;