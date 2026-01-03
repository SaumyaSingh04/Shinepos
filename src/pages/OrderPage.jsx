import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderPage = () => {
  const { restaurantSlug } = useParams();
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, [restaurantSlug]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`/api/menus`, {
        headers: { 'X-Restaurant-Slug': restaurantSlug }
      });
      setMenus(response.data.menus.filter(menu => menu.isAvailable));
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const addToCart = (menu) => {
    const existingItem = cart.find(item => item.menuId === menu._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuId === menu._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.menuId !== menuId));
  };

  const updateQuantity = (menuId, quantity) => {
    if (quantity === 0) {
      removeFromCart(menuId);
    } else {
      setCart(cart.map(item =>
        item.menuId === menuId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`/api/${restaurantSlug}/orders`, {
        items: cart.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity
        })),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone
      });

      setOrderPlaced(response.data.order);
      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">Your order has been successfully placed.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-semibold">Order Number: {orderPlaced.orderNumber}</p>
            <p className="text-sm text-gray-600">Total: ₹{orderPlaced.totalAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setOrderPlaced(null)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{restaurantSlug.replace('-', ' ')} Menu</h1>
          <p className="text-gray-600">Select items to place your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{menu.name}</h3>
                  <p className="text-gray-600 mb-3">{menu.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">₹{menu.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(menu)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Your Order</h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.menuId} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total: ₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;