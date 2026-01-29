import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiLoader } from 'react-icons/fi';
import TableList from './TableList';
import AddTable from './AddTable';
import EditTable from './EditTable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    if (view === 'list') {
      fetchTables();
    }
  }, [view]);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/table/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(response.data.tables);
    } catch (error) {
      console.error('Fetch tables error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTableStatus = async (tableId, status) => {
    try {
      const token = localStorage.getItem('token');
      const table = tables.find(t => t._id === tableId);
      
      // Update the main table
      await axios.patch(`${API_BASE_URL}/api/table/tables/${tableId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let tablesToUpdate = [tableId];
      
      // If this table has merged tables, update all merged tables with same status
      if (table.mergedWith && table.mergedWith.length > 0) {
        const updatePromises = table.mergedWith.map(mergedTableId => 
          axios.patch(`${API_BASE_URL}/api/table/tables/${mergedTableId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        await Promise.all(updatePromises);
        tablesToUpdate = [tableId, ...table.mergedWith];
      }
      
      // If this table is part of another table's merge, update the parent and all siblings
      const parentTable = tables.find(t => t.mergedWith && t.mergedWith.includes(tableId));
      if (parentTable) {
        await axios.patch(`${API_BASE_URL}/api/table/tables/${parentTable._id}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const siblingPromises = parentTable.mergedWith
          .filter(id => id !== tableId)
          .map(siblingId => 
            axios.patch(`${API_BASE_URL}/api/table/tables/${siblingId}/status`, { status }, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );
        await Promise.all(siblingPromises);
        
        tablesToUpdate = [parentTable._id, ...parentTable.mergedWith];
      }
      
      // Update local state for all affected tables
      setTables(prev => prev.map(t => 
        tablesToUpdate.includes(t._id) ? { ...t, status } : t
      ));
      
    } catch (error) {
      console.error('Update table status error:', error);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setView('edit');
  };

  if (view === 'add') {
    return <AddTable onSuccess={() => setView('list')} onBack={() => setView('list')} />;
  }

  if (view === 'edit') {
    return <EditTable table={editingTable} onSuccess={() => setView('list')} onBack={() => setView('list')} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FiLoader className="text-6xl mb-4 animate-spin mx-auto text-orange-500" size={64} />
          <p className="mt-4 text-gray-900 font-medium">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setView('add')}
          className="px-6 py-3 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl flex items-center space-x-2 font-medium transition-all border border-white/40"
        >
          <FiPlus />
          <span>Add Table</span>
        </button>
      </div>

      <TableList tables={tables} onUpdateStatus={handleUpdateTableStatus} onEdit={handleEdit} />
    </div>
  );
};

export default Tables;
