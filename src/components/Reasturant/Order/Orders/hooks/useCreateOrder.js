import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMergeTablesForOrder } from './useMergeTablesForOrder';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useCreateOrder = (onCreateOrder) => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const {
    showMergeOption,
    selectedTablesForMerge,
    selectedCapacity,
    isCapacityMet,
    toggleTableSelection,
    mergeTables
  } = useMergeTablesForOrder(guestCount, tables);

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/menus/get/all-menu-items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(response.data.menuItems || []);
    } catch (err) {
      console.error('Fetch menu items error:', err);
      setError('Failed to fetch menu items');
    }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/table/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(response.data.tables || []);
    } catch (err) {
      console.error('Fetch tables error:', err);
    }
  };

  const openItemModal = (menuItem) => {
    setSelectedItem(menuItem);
    setSelectedVariation(menuItem.variation?.[0] || null);
    setSelectedAddons([]);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedVariation(null);
    setSelectedAddons([]);
  };

  const addItemToOrder = () => {
    if (!selectedItem || !selectedVariation) return;
    
    const itemPrice = selectedVariation.price + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const itemKey = `${selectedItem._id}-${selectedVariation._id}-${selectedAddons.map(a => a._id).join(',')}`;
    
    const existingItem = orderItems.find(item => item.key === itemKey);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(item =>
        item.key === itemKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, {
        key: itemKey,
        menuId: selectedItem._id,
        name: selectedItem.itemName,
        variation: selectedVariation,
        addons: selectedAddons,
        price: itemPrice,
        quantity: 1
      }]);
    }
    
    closeItemModal();
  };

  const updateItemQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.key !== itemKey));
    } else {
      setOrderItems(prev => prev.map(item =>
        item.key === itemKey
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeItem = (itemKey) => {
    setOrderItems(prev => prev.filter(item => item.key !== itemKey));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    
    if (!guestCount || parseInt(guestCount) <= 0) {
      setError('Valid guest count is required');
      return;
    }
    
    if (orderItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let tableId = selectedTable;

      // Handle table merge if needed
      if (showMergeOption && selectedTablesForMerge.length >= 2) {
        tableId = await mergeTables();
      }

      const orderData = {
        items: orderItems.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity,
          variation: {
            variationId: item.variation._id
          },
          addons: item.addons.map(addon => ({
            addonId: addon._id
          }))
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        tableId: tableId || undefined
      };

      const result = await onCreateOrder(orderData);
      
      if (result.success) {
        setOrderItems([]);
        setCustomerName('');
        setCustomerPhone('');
        setGuestCount('');
        setSelectedTable('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    }
    
    setLoading(false);
  };

  return {
    menuItems,
    tables,
    orderItems,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    guestCount,
    setGuestCount,
    selectedTable,
    setSelectedTable,
    showMergeOption,
    selectedTablesForMerge,
    selectedCapacity,
    isCapacityMet,
    toggleTableSelection,
    loading,
    error,
    selectedItem,
    selectedVariation,
    setSelectedVariation,
    selectedAddons,
    setSelectedAddons,
    openItemModal,
    closeItemModal,
    addItemToOrder,
    updateItemQuantity,
    removeItem,
    calculateTotal,
    handleSubmit
  };
};
