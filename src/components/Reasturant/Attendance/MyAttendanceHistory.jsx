import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiCalendar, FiLogIn, FiLogOut } from 'react-icons/fi';
import MyAttendance from './MyAttendance';

const MyAttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching my attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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
    <div className="space-y-6">
      {/* Today's Attendance Card */}
      <MyAttendance />
      
      {/* Attendance History */}
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">📊 My Attendance History</h2>
        
        {attendance.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendance.map((record) => (
              <div key={record._id} className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="text-white" />
                    <span className="font-medium text-white">{formatDate(record.date)}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      record.actual.status === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {record.actual.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-white">
                    {record.actual.checkIn && (
                      <div className="flex items-center space-x-1">
                        <FiLogIn className="text-green-400" />
                        <span>In: {formatTime(record.actual.checkIn)}</span>
                      </div>
                    )}
                    {record.actual.checkOut && (
                      <div className="flex items-center space-x-1">
                        <FiLogOut className="text-red-400" />
                        <span>Out: {formatTime(record.actual.checkOut)}</span>
                      </div>
                    )}
                    {record.actual.workingHours && (
                      <div className="font-medium">
                        {record.actual.workingHours.toFixed(1)}h
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendanceHistory;