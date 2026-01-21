import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import TableList from './TableList';
import AddTable from './AddTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTable, setShowAddTable] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchTables = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/table/tables`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal
        });
        setTables(response.data.tables);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Fetch tables error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTables();
    
    return () => abortController.abort();
  }, []);

  const handleUpdateTableStatus = async (tableId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/table/tables/${tableId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(prev => prev.map(table => 
        table._id === tableId ? { ...table, status } : table
      ));
    } catch (error) {
      console.error('Update table status error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Table Management</h1>
        
        <button
          onClick={() => setShowAddTable(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Table</span>
        </button>
      </div>

      <TableList tables={tables} onUpdateStatus={handleUpdateTableStatus} />

      {showAddTable && (
        <AddTable
          onTableAdded={(table) => setTables(prev => [...prev, table])}
          onClose={() => setShowAddTable(false)}
        />
      )}
    </div>
  );
};

export default Tables;