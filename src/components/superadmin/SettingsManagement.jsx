import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({});
  const [planLimits, setPlanLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('SYSTEM');

  const categories = {
    SYSTEM: { name: 'System', icon: '⚙️' },
    EMAIL: { name: 'Email', icon: '📧' },
    PAYMENT: { name: 'Payment', icon: '💳' },
    SECURITY: { name: 'Security', icon: '🔒' },
    PLAN_LIMITS: { name: 'Plan Limits', icon: '📊' },
    GENERAL: { name: 'General', icon: '📋' }
  };

  useEffect(() => {
    fetchSettings();
    fetchPlanLimits();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanLimits = async () => {
    try {
      const response = await axios.get('/api/settings/plan-limits');
      setPlanLimits(response.data.limits);
    } catch (error) {
      console.error('Error fetching plan limits:', error);
    }
  };

  const updateSetting = async (key, value, category, description) => {
    setSaving(true);
    try {
      await axios.put('/api/settings', { key, value, category, description });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePlanLimits = async (plan, limits) => {
    setSaving(true);
    try {
      await axios.put('/api/settings/plan-limits', { plan, limits });
      fetchPlanLimits();
    } catch (error) {
      console.error('Error updating plan limits:', error);
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

  const handlePlanLimitChange = (plan, limitType, value) => {
    setPlanLimits(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [limitType]: parseInt(value) || 0
      }
    }));
  };

  const handlePlanLimitSave = (plan) => {
    updatePlanLimits(plan, planLimits[plan]);
  };

  const renderPlanLimitsSection = () => {
    const plans = ['trial', 'basic', 'premium', 'enterprise'];
    const planColors = {
      trial: 'bg-gray-50 border-gray-200',
      basic: 'bg-blue-50 border-blue-200',
      premium: 'bg-purple-50 border-purple-200',
      enterprise: 'bg-gold-50 border-yellow-200'
    };

    return (
      <div className="space-y-6">
        {plans.map(plan => (
          <div key={plan} className={`p-6 rounded-lg border ${planColors[plan]}`}>
            <h3 className="text-lg font-semibold mb-4 capitalize">{plan} Plan Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orders Limit</label>
                <input
                  type="number"
                  value={planLimits[plan]?.orders || 0}
                  onChange={(e) => handlePlanLimitChange(plan, 'orders', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Users Limit</label>
                <input
                  type="number"
                  value={planLimits[plan]?.users || 0}
                  onChange={(e) => handlePlanLimitChange(plan, 'users', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Items Limit</label>
                <input
                  type="number"
                  value={planLimits[plan]?.menuItems || 0}
                  onChange={(e) => handlePlanLimitChange(plan, 'menuItems', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handlePlanLimitSave(plan)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : `Save ${plan.charAt(0).toUpperCase() + plan.slice(1)} Limits`}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSettingInput = (setting) => {
    const inputProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
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

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      
      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeCategory === key
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeCategory === 'PLAN_LIMITS' ? (
          renderPlanLimitsSection()
        ) : (
          settings[activeCategory]?.map((setting) => (
            <div key={setting.key} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{setting.key}</h3>
                  {setting.description && (
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  {renderSettingInput(setting)}
                </div>
                <button
                  onClick={() => handleSave(setting)}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )) || (
            <div className="text-center py-12">
              <p className="text-gray-500">No settings found for this category.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SettingsManagement;