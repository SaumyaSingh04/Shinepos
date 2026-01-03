import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemMonitoring = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    fetchHealthHistory();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await axios.get('/api/system/health');
      setSystemHealth(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system health:', error);
      setLoading(false);
    }
  };

  const fetchHealthHistory = async () => {
    try {
      const response = await axios.get('/api/system/health/history?hours=24');
      setHealthHistory(response.data.healthHistory);
    } catch (error) {
      console.error('Error fetching health history:', error);
    }
  };

  const formatBytes = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading system health...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
      
      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Server Status</p>
              <p className="text-lg font-bold text-green-600">Online</p>
              <p className="text-xs text-gray-500">Uptime: {formatUptime(systemHealth?.serverStatus?.uptime || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${systemHealth?.databaseStatus?.connected ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Database</p>
              <p className={`text-lg font-bold ${systemHealth?.databaseStatus?.connected ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth?.databaseStatus?.connected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-xs text-gray-500">Response: {systemHealth?.databaseStatus?.responseTime || 0}ms</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Memory Usage</p>
              <p className="text-lg font-bold text-blue-600">
                {formatBytes(systemHealth?.serverStatus?.memoryUsage?.heapUsed || 0)}
              </p>
              <p className="text-xs text-gray-500">
                / {formatBytes(systemHealth?.serverStatus?.memoryUsage?.heapTotal || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Performance</p>
              <p className="text-lg font-bold text-purple-600">
                {systemHealth?.apiMetrics?.averageResponseTime?.toFixed(0) || 0}ms
              </p>
              <p className="text-xs text-gray-500">
                Error Rate: {systemHealth?.apiMetrics?.errorRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Server Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">RSS Memory:</span>
              <span className="font-medium">{formatBytes(systemHealth?.serverStatus?.memoryUsage?.rss || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">External Memory:</span>
              <span className="font-medium">{formatBytes(systemHealth?.serverStatus?.memoryUsage?.external || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CPU Usage:</span>
              <span className="font-medium">{(systemHealth?.serverStatus?.cpuUsage || 0).toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Process ID:</span>
              <span className="font-medium">Browser Environment</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">API Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Requests:</span>
              <span className="font-medium">{systemHealth?.apiMetrics?.totalRequests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Error Rate:</span>
              <span className="font-medium">{systemHealth?.apiMetrics?.errorRate?.toFixed(2) || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Response Time:</span>
              <span className="font-medium">{systemHealth?.apiMetrics?.averageResponseTime?.toFixed(0) || 0}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DB Connections:</span>
              <span className="font-medium">{systemHealth?.databaseStatus?.activeConnections || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health History Chart */}
      {healthHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">24-Hour Health Trend</h3>
          <div className="text-sm text-gray-600">
            Showing {healthHistory.length} data points from the last 24 hours
          </div>
          {/* In a real implementation, you'd use a charting library like Chart.js or Recharts */}
          <div className="mt-4 text-center text-gray-500">
            Chart visualization would go here (integrate with Chart.js or similar)
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitoring;