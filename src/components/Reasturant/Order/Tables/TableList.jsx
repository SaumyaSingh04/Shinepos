import React, { useState } from 'react';
import { FiLink, FiCheckCircle, FiXCircle, FiAlertCircle, FiTool, FiUsers, FiMapPin, FiEdit2, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import TransferAndMergeModal from './TransferAndMergeModal';
import MergeTablesModal from './MergeTablesModal';

const TableList = ({ tables, onUpdateStatus, onEdit }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTransferMergeModal, setShowTransferMergeModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Helper function to get effective status for a table
  const getEffectiveStatus = (table) => {
    // If this table is merged with others and any merged table is occupied, show as occupied
    if (table.mergedWith && table.mergedWith.length > 0) {
      const mergedTable = tables.find(t => t.mergedWith && t.mergedWith.includes(table._id) && t.status === 'OCCUPIED');
      if (mergedTable) return 'OCCUPIED';
    }
    
    // If this table has merged tables and is occupied, all merged tables should show as occupied
    if (table.status === 'OCCUPIED' && table.mergedWith && table.mergedWith.length > 0) {
      return 'OCCUPIED';
    }
    
    // Check if this table is part of another table's merge and that table is occupied
    const parentMergedTable = tables.find(t => 
      t.mergedWith && t.mergedWith.includes(table._id) && t.status === 'OCCUPIED'
    );
    if (parentMergedTable) return 'OCCUPIED';
    
    return table.status;
  };

  const statuses = [
    { value: 'AVAILABLE', label: 'Available', icon: <FiCheckCircle /> },
    { value: 'OCCUPIED', label: 'Occupied', icon: <FiXCircle /> },
    { value: 'RESERVED', label: 'Reserved', icon: <FiAlertCircle /> },
    { value: 'MAINTENANCE', label: 'Maintenance', icon: <FiTool /> }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'OCCUPIED': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'RESERVED': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
      case 'MAINTENANCE': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE': return <FiCheckCircle />;
      case 'OCCUPIED': return <FiXCircle />;
      case 'RESERVED': return <FiAlertCircle />;
      case 'MAINTENANCE': return <FiTool />;
      default: return <FiAlertCircle />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map((table, index) => (
        <div 
          key={table._id} 
          className={`bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn card-hover ${openDropdown === table._id ? 'z-50' : 'z-0'}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl text-gray-900">🪑</div>
              <h3 className="text-2xl font-bold text-gray-900">{table.tableNumber}</h3>
              {table.mergedWith && table.mergedWith.length > 0 && (
                <FiLink className="text-purple-600 animate-pulse-slow" title="Merged Table" size={20} />
              )}
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-md flex items-center gap-1 ${getStatusColor(table.status)}`}>
              {getStatusIcon(table.status)} {table.status}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-gray-900">
              <FiUsers className="text-lg" />
              <p className="text-sm font-medium">Capacity: {table.capacity} people</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-900">
              <FiMapPin className="text-lg" />
              <p className="text-sm font-medium">Location: {table.location}</p>
            </div>
            {table.mergedWith && table.mergedWith.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-3 mt-3 border-2 border-purple-200 overflow-hidden">
                <div className="flex items-center space-x-2 mb-2">
                  <FiLink className="text-lg text-purple-700 flex-shrink-0" />
                  <p className="text-sm font-bold text-purple-700">Merged Tables:</p>
                </div>
                <p className="text-xs text-purple-600 font-medium break-words">
                  {table.mergedWith.map(id => {
                    const originalTable = tables.find(t => t._id === id);
                    return originalTable?.tableNumber;
                  }).filter(Boolean).join(', ')}
                </p>
                {table.mergedGuestCount && (
                  <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
                    <FiUsers className="flex-shrink-0" /> Guests: {table.mergedGuestCount}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === table._id ? null : table._id)}
                className="w-full px-4 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {getStatusIcon(table.status)}
                  {table.status}
                </span>
                <FiChevronDown className={`transition-transform ${openDropdown === table._id ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === table._id && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden z-50 shadow-2xl">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        onUpdateStatus(table._id, status.value);
                        setOpenDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-purple-500/20 flex items-center gap-2 transition-colors"
                    >
                      {status.icon}
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-1">
              {table.status === 'MAINTENANCE' && (
                <button
                  onClick={() => {
                    setSelectedTable(table);
                    setShowTransferMergeModal(true);
                  }}
                  className="px-2 py-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 text-red-700 rounded-xl text-xs font-medium transition-all border border-red-300 flex items-center gap-1"
                  title="Transfer & Merge"
                >
                  <FiRefreshCw size={12} />
                </button>
              )}
              
              <button
                onClick={() => {
                  setSelectedTable(table);
                  setShowMergeModal(true);
                }}
                className="px-2 py-2 bg-blue-500/20 backdrop-blur-md hover:bg-blue-500/30 text-blue-700 rounded-xl text-xs font-medium transition-all border border-blue-300 flex items-center gap-1"
                title="Merge Tables"
              >
                <FiLink size={12} />
              </button>
              
              <button
                onClick={() => onEdit(table)}
                className="px-2 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl text-sm font-medium transition-all border border-white/40 flex items-center justify-center"
              >
                <FiEdit2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {showTransferMergeModal && selectedTable && (
        <TransferAndMergeModal
          brokenTable={selectedTable}
          onClose={() => {
            setShowTransferMergeModal(false);
            setSelectedTable(null);
          }}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
      
      {showMergeModal && selectedTable && (
        <MergeTablesModal
          primaryTable={selectedTable}
          onClose={() => {
            setShowMergeModal(false);
            setSelectedTable(null);
          }}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default TableList;