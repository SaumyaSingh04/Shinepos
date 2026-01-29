import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const TodayAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.present || []);
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📅 Today's Attendance</h2>
      
      {attendance.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-white">No attendance records for today</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendance.map((record) => (
            <div key={record._id} className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FiUser className="text-white" />
                  <span className="font-medium text-white">{record.staffId?.name || 'Unknown'}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  record.status === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {record.status === 'present' ? <FiCheckCircle className="inline mr-1" /> : <FiXCircle className="inline mr-1" />}
                  {record.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-200">
                {record.checkIn && (
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-green-400" />
                    <span>In: {formatTime(record.checkIn)}</span>
                  </div>
                )}
                {record.checkOut && (
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-red-400" />
                    <span>Out: {formatTime(record.checkOut)}</span>
                  </div>
                )}
                {record.hoursWorked && (
                  <div className="text-white font-medium">
                    Hours: {record.hoursWorked.toFixed(1)}h
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayAttendance;