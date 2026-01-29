import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';

const MyAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('My attendance response:', response.data);
      
      const today = new Date().toDateString();
      const todayRecord = response.data.attendance?.find(record => 
        new Date(record.date).toDateString() === today
      );
      
      console.log('Today record found:', todayRecord);
      setTodayAttendance(todayRecord?.actual || todayRecord);
      
    } catch (error) {
      console.error('Error fetching my attendance:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      // Decode JWT to get the actual user ID that backend expects
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload:', payload);
      console.log('User from localStorage:', user);
      
      // Use userId from JWT payload since that's what the token contains
      const userId = payload.userId;
      console.log('Using userId:', userId);
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkin/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Check-in successful!');
      fetchMyAttendance();
    } catch (error) {
      console.error('Check-in error:', error.response?.data);
      alert('Check-in failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      // Decode JWT to get the actual user ID that backend expects
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id || payload.userId;
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkout/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Check-out successful!');
      fetchMyAttendance();
    } catch (error) {
      console.error('Check-out error:', error.response?.data);
      alert('Check-out failed: ' + (error.response?.data?.error || error.message));
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
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">My Attendance</h3>
            <p className="text-sm text-gray-300">{user.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">Today</p>
          <p className="text-white font-medium">{new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {todayAttendance ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiClock className="text-green-400" />
                <span className="text-sm text-white">Check In</span>
              </div>
              <p className="text-lg font-bold text-white">
                {todayAttendance.checkIn ? formatTime(todayAttendance.checkIn) : 'Not checked in'}
              </p>
            </div>
            
            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiClock className="text-red-400" />
                <span className="text-sm text-white">Check Out</span>
              </div>
              <p className="text-lg font-bold text-white">
                {todayAttendance.checkOut ? formatTime(todayAttendance.checkOut) : 'Not checked out'}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {!todayAttendance.checkIn && (
              <button
                onClick={handleCheckIn}
                className="flex-1 px-4 py-3 bg-green-500/30 backdrop-blur-md hover:bg-green-500/40 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <FiLogIn />
                <span>Check In</span>
              </button>
            )}
            
            {todayAttendance.checkIn && !todayAttendance.checkOut && (
              <button
                onClick={handleCheckOut}
                className="flex-1 px-4 py-3 bg-red-500/30 backdrop-blur-md hover:bg-red-500/40 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <FiLogOut />
                <span>Check Out</span>
              </button>
            )}
            
            {todayAttendance.checkIn && todayAttendance.checkOut && (
              <div className="flex-1 px-4 py-3 bg-gray-500/30 backdrop-blur-md text-white rounded-xl flex items-center justify-center">
                <span>✅ Attendance Complete</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-white mb-4">You haven't marked attendance today</p>
          <button
            onClick={handleCheckIn}
            className="px-6 py-3 bg-green-500/30 backdrop-blur-md hover:bg-green-500/40 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <FiLogIn />
            <span>Check In Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;