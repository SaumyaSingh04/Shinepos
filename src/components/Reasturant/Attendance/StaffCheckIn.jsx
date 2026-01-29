import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';

const StaffCheckIn = () => {
  const [staff, setStaff] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [staffResponse, attendanceResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/staff/all/staff`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/today`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStaff(staffResponse.data || []);
      setTodayAttendance(attendanceResponse.data.present || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkin/${staffId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Check-in successful!');
      fetchData();
    } catch (error) {
      alert('Check-in failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCheckOut = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkout/${staffId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Check-out successful!');
      fetchData();
    } catch (error) {
      alert('Check-out failed: ' + (error.response?.data?.message || error.message));
    }
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
      <h2 className="text-xl font-bold text-white mb-6">⏰ Staff Check In/Out</h2>
      
      {staff.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-white">No staff members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => {
            const attendance = todayAttendance.find(att => 
              att.staffId && (att.staffId._id === member._id || att.staffId === member._id)
            );
            const isCheckedIn = attendance && attendance.checkIn && !attendance.checkOut;
            
            return (
              <div key={member._id} className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{member.name}</h3>
                    <p className="text-sm text-gray-300">{member.role}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isCheckedIn ? (
                    <div className="flex-1 px-3 py-2 bg-blue-500/30 backdrop-blur-md text-white rounded-xl flex items-center justify-center space-x-1">
                      <FiClock />
                      <span>Checked In</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(member._id)}
                      className="flex-1 px-3 py-2 bg-green-500/30 backdrop-blur-md hover:bg-green-500/40 text-white rounded-xl transition-colors flex items-center justify-center space-x-1"
                    >
                      <FiLogIn />
                      <span>Check In</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCheckOut(member._id)}
                    disabled={!isCheckedIn}
                    className={`flex-1 px-3 py-2 backdrop-blur-md text-white rounded-xl transition-colors flex items-center justify-center space-x-1 ${
                      isCheckedIn 
                        ? 'bg-red-500/30 hover:bg-red-500/40' 
                        : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <FiLogOut />
                    <span>Check Out</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffCheckIn;