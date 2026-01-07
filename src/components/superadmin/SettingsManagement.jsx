import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsManagement = ({ activeCategory: initialCategory = 'SYSTEM' }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categories = {
    SYSTEM: { name: 'System', icon: '⚙️' },
    EMAIL: { name: 'Email', icon: '📧' },
    PAYMENT: { name: 'Payment', icon: '💳' },
    SECURITY: { name: 'Security', icon: '🔒' },
    GENERAL: { name: 'General', icon: '📋' }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value, category, description) => {
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, { key, value, category, description });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (setting, newValue) => {
    const updatedSettings = { ...settings };
    const categorySettings = updatedSettings[setting.category] || [];
    const settingIndex = categorySettings.findIndex(s => s.key === setting.key);
    
    if (settingIndex !== -1) {
      categorySettings[settingIndex] = { ...setting, value: newValue };
      setSettings(updatedSettings);
    }
  };

  const handleSave = (setting) => {
    updateSetting(setting.key, setting.value, setting.category, setting.description);
  };

  const renderSettingInput = (setting) => {
    const inputProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
      onChange: (e) => {
        let value = e.target.value;
        if (typeof setting.value === 'number') {
          value = parseInt(value) || 0;
        } else if (typeof setting.value === 'boolean') {
          value = e.target.checked;
        }
        handleInputChange(setting, value);
      }
    };

    if (typeof setting.value === 'boolean') {
      return (
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={setting.value}
            {...inputProps}
            className="mr-2"
          />
          <span>{setting.value ? 'Enabled' : 'Disabled'}</span>
        </label>
      );
    } else if (typeof setting.value === 'number') {
      return (
        <input
          type="number"
          value={setting.value}
          {...inputProps}
        />
      );
    } else {
      return (
        <input
          type="text"
          value={setting.value}
          {...inputProps}
        />
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-slate-900">System Settings</h2>
      
      {/* Settings Content */}
      <div className="space-y-6">
        {settings[activeCategory]?.map((setting) => (
          <div key={setting.key} className="bg-white p-4 lg:p-6 rounded-lg shadow border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-base lg:text-lg font-semibold text-slate-900">{setting.key}</h3>
                {setting.description && (
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">{setting.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                {renderSettingInput(setting)}
              </div>
              <button
                onClick={() => handleSave(setting)}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors text-sm lg:text-base"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )) || (
          <div className="text-center py-12">
            <p className="text-slate-500">No settings found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManagement;