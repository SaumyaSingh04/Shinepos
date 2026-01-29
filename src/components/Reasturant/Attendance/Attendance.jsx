import React, { useState } from 'react';
import AttendanceList from './AttendanceList';
import TodayAttendance from './TodayAttendance';
import StaffCheckIn from './StaffCheckIn';
import MyAttendanceHistory from './MyAttendanceHistory';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('my-attendance');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.role === 'owner';

  const renderContent = () => {
    if (!isAdmin) {
      // Staff view - only show their own attendance
      switch (activeTab) {
        case 'my-attendance':
          return <MyAttendanceHistory />;
        default:
          return <MyAttendanceHistory />;
      }
    }
    
    // Admin view - show all attendance management
    switch (activeTab) {
      case 'today':
        return <TodayAttendance />;
      case 'all':
        return <AttendanceList />;
      case 'checkin':
        return <StaffCheckIn />;
      default:
        return <TodayAttendance />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">👥 {isAdmin ? 'Attendance Management' : 'My Attendance'}</h1>
        {isAdmin && (
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'today'
                  ? 'bg-white/30 backdrop-blur-md text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'all'
                  ? 'bg-white/30 backdrop-blur-md text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'checkin'
                  ? 'bg-white/30 backdrop-blur-md text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Check In/Out
            </button>
          </div>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default Attendance;