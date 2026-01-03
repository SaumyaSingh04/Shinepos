import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WaiterPage = () => {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    items: []
  });

  useEffect(() => {
    fetchOrders();
    fetchMenus();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await axios.get('/api/menus');
      console.log('Menus fetched:', response.data);
      setMenus(response.data.menus || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const addItemToOrder = (menu) => {
    const existingItem = newOrder.items.find(item => item.menuId === menu._id);
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map(item =>
          item.menuId === menu._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, {
          menuId: menu._id,
          name: menu.name,
          price: menu.price,
          quantity: 1
        }]
      });
    }
  };

  const removeItemFromOrder = (menuId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.menuId !== menuId)
    });
  };

  const calculateTotal = () => {
    return newOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    try {
      const orderData = {
        ...newOrder,
        totalAmount: calculateTotal()
      };
      await axios.post('/api/orders', orderData);
      setNewOrder({ customerName: '', customerPhone: '', items: [] });
      setShowNewOrder(false);
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waiter Dashboard</h1>
        <button
          onClick={() => setShowNewOrder(!showNewOrder)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showNewOrder ? 'Cancel' : 'New Order'}
        </button>
      </div>

      {showNewOrder && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Customer Phone"
              value={newOrder.customerPhone}
              onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Menu Items</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {menus.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No menu items available
                  </div>
                ) : (
                  menus.filter(menu => menu.isAvailable).map((menu) => (
                    <div key={menu._id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{menu.name}</div>
                        <div className="text-sm text-gray-600">{menu.description}</div>
                        <div className="text-sm font-semibold text-green-600">${menu.price}</div>
                        <div className="text-xs text-gray-500">Category: {menu.category}</div>
                      </div>
                      <button
                        onClick={() => addItemToOrder(menu)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-2">
                {newOrder.items.map((item) => (
                  <div key={item.menuId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.quantity}x ${item.price}</div>
                    </div>
                    <button
                      onClick={() => removeItemFromOrder(item.menuId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              {newOrder.items.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <div className="font-bold">Total: ${calculateTotal().toFixed(2)}</div>
                  <button
                    onClick={submitOrder}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Submit Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">#{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                  <td className="px-6 py-4">{order.items.length} items</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'READY' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'DELIVERED')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaiterPage;