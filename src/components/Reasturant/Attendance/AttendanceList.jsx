import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiUser, FiCalendar, FiFilter } from 'react-icons/fi';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAttendance = attendance.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">📊 All Attendance Records</h2>
        <div className="flex items-center space-x-2">
          <FiFilter className="text-white" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/30 backdrop-blur-lg border border-white/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>
      
      {filteredAttendance.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-white">No attendance records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/30 backdrop-blur-lg">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Staff</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredAttendance.map((record) => (
                <tr key={record._id} className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-white" />
                      <span className="text-white">{record.staffId?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-white" />
                      <span className="text-white">{formatDate(record.date)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {record.checkIn ? formatTime(record.checkIn) : '-'}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {record.checkOut ? formatTime(record.checkOut) : '-'}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {record.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      record.status === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;