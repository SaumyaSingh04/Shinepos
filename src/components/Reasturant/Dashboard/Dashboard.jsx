import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiDollarSign, FiTarget, FiUsers, FiStar } from 'react-icons/fi';
import axios from 'axios';
import AnalyticsCard from './AnalyticsCard';
import RecentOrders from './RecentOrders';
import TopSellingItems from './TopSellingItems';
import QuickActions from './QuickActions';
import OrderStatus from './OrderStatus';
import PaymentStatistics from './PaymentStatistics';
import MyAttendance from '../Attendance/MyAttendance';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'RESTAURANT_ADMIN' || user.role === 'MANAGER';
  
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    totalMenuItems: 0,
    activeStaff: 0,
    avgOrderValue: 0,
    customerSatisfaction: 0,
    pendingOrders: 0,
    completedOrders: 0,
    paidOrders: 0,
    cashPayments: 0,
    cardPayments: 0,
    upiPayments: 0,
    cashPercentage: 0,
    cardPercentage: 0,
    upiPercentage: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log('Fetching dashboard data from:', import.meta.env.VITE_API_URL);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats?filter=${filter}`, config);
      
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders.map(order => ({
          ...order,
          id: order.orderNumber,
          customer: order.customerName || 'Guest',
          items: order.items,
          amount: order.totalAmount,
          status: order.status.toLowerCase(),
          time: getTimeAgo(order.createdAt)
        })));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        orders: 5,
        revenue: 1250,
        totalMenuItems: 25,
        activeStaff: 8,
        avgOrderValue: 250,
        customerSatisfaction: 4.8,
        pendingOrders: 2,
        completedOrders: 3,
        paidOrders: 0,
        cashPayments: 0,
        cardPayments: 0,
        upiPayments: 0,
        cashPercentage: 0,
        cardPercentage: 0,
        upiPercentage: 0
      });
      
      setRecentOrders([
        { id: '#ORD-001', customer: 'John Doe', items: 3, amount: 450, status: 'completed', time: '2 min ago' },
        { id: '#ORD-002', customer: 'Sarah Smith', items: 2, amount: 320, status: 'preparing', time: '5 min ago' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
    return `${Math.floor(diffInMinutes / 1440)} day ago`;
  };

  const cards = [
    { 
      title: filter === 'today' ? "Today's Orders" : filter === 'weekly' ? "Weekly Orders" : "Monthly Orders", 
      value: stats.orders, 
      icon: <FiShoppingBag />, 
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: filter === 'today' ? "Today's Revenue" : filter === 'weekly' ? "Weekly Revenue" : "Monthly Revenue", 
      value: `₹${stats.revenue.toLocaleString()}`, 
      icon: <FiDollarSign />, 
      color: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Avg Order Value', 
      value: `₹${Math.round(stats.avgOrderValue)}`, 
      icon: <FiTarget />, 
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      trend: 'up'
    },
    { 
      title: 'Active Staff', 
      value: stats.activeStaff, 
      icon: <FiUsers />, 
      color: 'from-orange-500 to-orange-600',
      change: '0%',
      trend: 'neutral'
    }
  ];

  const handleQuickAction = (actionId) => {
    console.log('Quick action clicked:', actionId);
    // TODO: Implement navigation or modal opening based on actionId
  };

  if (loading) {
    return (
      <div className="p-6 bg-transparent min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-transparent min-h-screen space-y-6"
    >
      {/* My Attendance - Show only for staff, not admin */}
      {!isAdmin && <MyAttendance />}
      {/* My Attendance - Show for staff */}
      {/* <MyAttendance /> */}
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
            <p className="text-gray-200">Here's what's happening at your restaurant</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today" className="bg-gray-800">Today</option>
              <option value="weekly" className="bg-gray-800">This Week</option>
              <option value="monthly" className="bg-gray-800">This Month</option>
            </select>
            <div className="text-right">
              <p className="text-sm text-gray-300">Date</p>
              <p className="text-lg font-semibold text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <AnalyticsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
            trend={card.trend}
            delay={0.2 + index * 0.1}
          />
        ))}
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentStatistics stats={stats} delay={1.0} />
        <RecentOrders
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20"
          orders={recentOrders} delay={0.9} />

        {/* Customer Satisfaction - Hidden */}
        {/* <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Customer Satisfaction</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">{stats.customerSatisfaction}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`text-lg ${
                    i < Math.floor(stats.customerSatisfaction) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                  }`} 
                />
              ))}
            </div>
            <p className="text-gray-200 text-sm">Based on 127 reviews</p>
            <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(stats.customerSatisfaction / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div> */}

        {/* Quick Actions - Hidden */}
        {/* <QuickActions onActionClick={handleQuickAction} delay={0.8} /> */}
      </div>

      {/* Payment Statistics and Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatus stats={stats} delay={0.6} />
        <TopSellingItems items={topItems} delay={1.1} />
      </div>
    </motion.div>
  );
};

export default Dashboard;
