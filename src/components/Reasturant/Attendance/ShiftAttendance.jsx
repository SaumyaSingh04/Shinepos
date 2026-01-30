import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShiftAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStaffShifts();
  }, []);

  const fetchAllStaffShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/staff/all/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error('Error fetching staff shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShiftName = (startTime, endTime) => {
    const shiftMap = {
      '06:00-14:00': '🌅 Morning',
      '09:00-17:00': '🏢 Day', 
      '14:00-22:00': '🌆 Evening',
      '22:00-06:00': '🌙 Night',
      '10:00-18:00': '☀️ Regular'
    };
    return shiftMap[`${startTime}-${endTime}`] || `${startTime}-${endTime}`;
  };

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>;

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📅 Staff Shift Schedules</h2>
      
      <div className="space-y-4">
        {staff.map((member) => (
          <div key={member._id} className="bg-white/30 backdrop-blur-lg rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{member.name}</span>
              <span className="text-sm text-gray-300">{member.role}</span>
            </div>
            
            {member.shiftSchedule?.fixedShift ? (
              <div className="text-sm text-blue-300">
                {getShiftName(member.shiftSchedule.fixedShift.startTime, member.shiftSchedule.fixedShift.endTime)} 
                ({member.shiftSchedule.fixedShift.startTime} - {member.shiftSchedule.fixedShift.endTime})
              </div>
            ) : (
              <div className="text-sm text-gray-400">No shift assigned</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftAttendance;