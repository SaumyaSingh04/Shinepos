import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CASHIER',
    permissions: [],
    phone: '',
    hourlyRate: ''
  });

  const rolePermissions = {
    RESTAURANT_ADMIN: ['orders', 'menus', 'inventory', 'staff', 'reports', 'kitchen'],
    MANAGER: ['orders', 'menus', 'inventory', 'reports', 'kitchen'],
    CASHIER: ['orders'],
    KITCHEN_STAFF: ['kitchen', 'orders']
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/staff`);
      setStaff(response.data.staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staffData = {
        ...formData,
        permissions: rolePermissions[formData.role] || []
      };

      if (editingStaff) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/staff/${editingStaff._id}`, staffData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/staff`, staffData);
      }
      
      setFormData({ name: '', email: '', password: '', role: 'CASHIER', permissions: [], phone: '', hourlyRate: '' });
      setShowAddForm(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      password: '',
      role: staffMember.role,
      permissions: staffMember.permissions,
      phone: staffMember.phone || '',
      hourlyRate: staffMember.hourlyRate || ''
    });
    setShowAddForm(true);
  };

  const scheduleShift = async (staffId, shiftData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/staff/${staffId}/shift`, shiftData);
      fetchStaff();
    } catch (error) {
      console.error('Error scheduling shift:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      RESTAURANT_ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      CASHIER: 'bg-green-100 text-green-800',
      KITCHEN_STAFF: 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingStaff(null);
            setFormData({ name: '', email: '', password: '', role: 'CASHIER', permissions: [], phone: '', hourlyRate: '' });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showAddForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder={editingStaff ? "New Password (leave blank to keep current)" : "Password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="px-3 py-2 border rounded-lg"
              required={!editingStaff}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="CASHIER">Cashier</option>
              <option value="KITCHEN_STAFF">Kitchen Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
            </select>
            <input
              type="tel"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Hourly Rate"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              {editingStaff ? 'Update' : 'Add'} Staff
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                    {member.phone && <div className="text-sm text-gray-500">{member.phone}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Orders: {member.performance?.ordersProcessed || 0}</div>
                  <div>Avg Time: {member.performance?.averageOrderTime || 0}min</div>
                  <div>Rating: {member.performance?.customerRating || 0}/5</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${member.hourlyRate || 0}/hr
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const date = prompt('Enter shift date (YYYY-MM-DD):');
                      const startTime = prompt('Enter start time (HH:MM):');
                      const endTime = prompt('Enter end time (HH:MM):');
                      if (date && startTime && endTime) {
                        scheduleShift(member._id, { date, startTime, endTime });
                      }
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Schedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;