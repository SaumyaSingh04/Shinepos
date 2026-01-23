import React, { useState, useEffect } from 'react';
import { useCategory } from '../Category/hooks/useCategory';

const EditItem = ({ item, onSuccess, onBack }) => {
  const { categories } = useCategory();
  const [formData, setFormData] = useState({
    itemName: '',
    categoryID: '',
    status: 'active',
    imageUrl: '',
    videoUrl: '',
    timeToPrepare: '',
    foodType: 'veg'
  });
  const [availableAddons, setAvailableAddons] = useState([]);
  const [availableVariations, setAvailableVariations] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAddon, setSearchAddon] = useState('');
  const [searchVariation, setSearchVariation] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchAddons();
    fetchVariations();
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        categoryID: item.categoryID?._id || item.categoryID || '',
        status: item.status || 'active',
        imageUrl: item.imageUrl || '',
        videoUrl: item.videoUrl || '',
        timeToPrepare: item.timeToPrepare || '',
        foodType: item.foodType || 'veg'
      });
      setSelectedAddons(item.addon ? item.addon.map(a => (typeof a === 'object' ? a._id : a).toString()) : []);
      setSelectedVariations(item.variation ? item.variation.map(v => (typeof v === 'object' ? v._id : v).toString()) : []);
    }
  }, [item]);

  const fetchAddons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addon/all/addon`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableAddons(data.addons || []);
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
    }
  };

  const fetchVariations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/variation/all/variation`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableVariations(data.variations || []);
      }
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
  };

  const uploadToCloudinary = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error);
        throw new Error(error.error || 'Upload failed');
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload exception:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddonChange = (addonId, checked) => {
    setSelectedAddons(checked ? [...selectedAddons, addonId] : selectedAddons.filter(id => id !== addonId));
  };

  const handleVariationChange = (variationId, checked) => {
    setSelectedVariations(checked ? [...selectedVariations, variationId] : selectedVariations.filter(id => id !== variationId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/update/menu-item/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          categoryID: formData.categoryID,
          status: formData.status,
          imageUrl: formData.imageUrl,
          videoUrl: formData.videoUrl,
          timeToPrepare: Number(formData.timeToPrepare),
          foodType: formData.foodType,
          addon: selectedAddons,
          variation: selectedVariations
        })
      });

      if (response.ok) {
        alert('Item updated successfully!');
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update item');
      }
    } catch (error) {
      alert('Error updating item');
    }
    setLoading(false);
  };

  const filteredAddons = availableAddons.filter(addon => 
    addon.name.toLowerCase().includes(searchAddon.toLowerCase())
  );

  const filteredVariations = availableVariations.filter(variation => 
    variation.name.toLowerCase().includes(searchVariation.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Left Side - Addons & Variations */}
      <div className="lg:col-span-1 space-y-6">
        {/* Addons */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🍟 Addons</h3>
          <input
            type="text"
            placeholder="🔍 Search addons..."
            value={searchAddon}
            onChange={(e) => setSearchAddon(e.target.value)}
            className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
          />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredAddons.map(addon => (
              <label key={addon._id} className="flex items-center space-x-3 p-3 bg-white/30 backdrop-blur-md rounded-xl cursor-pointer hover:bg-white/40 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon._id.toString())}
                  onChange={(e) => handleAddonChange(addon._id.toString(), e.target.checked)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{addon.name}</div>
                  <div className="text-sm text-gray-700">₹{addon.price}</div>
                </div>
                <span>{addon.veg ? '🟢' : '🔴'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Variations */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📏 Variations</h3>
          <input
            type="text"
            placeholder="🔍 Search variations..."
            value={searchVariation}
            onChange={(e) => setSearchVariation(e.target.value)}
            className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
          />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredVariations.map(variation => (
              <label key={variation._id} className="flex items-center space-x-3 p-3 bg-white/30 backdrop-blur-md rounded-xl cursor-pointer hover:bg-white/40 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedVariations.includes(variation._id.toString())}
                  onChange={(e) => handleVariationChange(variation._id.toString(), e.target.checked)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{variation.name}</div>
                  <div className="text-sm text-gray-700">₹{variation.price}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Item Details */}
      <div className="lg:col-span-2 space-y-6 animate-slideIn" style={{ animationDelay: '0.2s' }}>
        {/* Basic Information */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🍽️ Item Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Item Name *</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Category *</label>
              <select
                name="categoryID"
                value={formData.categoryID}
                onChange={handleInputChange}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Food Type</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="veg">🟢 Vegetarian</option>
                <option value="nonveg">🔴 Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Time to Prepare (min) *</label>
              <input
                type="number"
                name="timeToPrepare"
                value={formData.timeToPrepare}
                onChange={handleInputChange}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadingImage(true);
                    try {
                      const url = await uploadToCloudinary(file, 'image');
                      setFormData(prev => ({ ...prev, imageUrl: url }));
                    } catch (error) {
                      alert('Failed to upload image');
                    }
                    setUploadingImage(false);
                  }
                }}
                disabled={uploadingImage}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
              {uploadingImage && <p className="text-sm text-gray-900 mt-1">Uploading...</p>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadingVideo(true);
                    try {
                      const url = await uploadToCloudinary(file, 'video');
                      setFormData(prev => ({ ...prev, videoUrl: url }));
                    } catch (error) {
                      alert('Failed to upload video');
                    }
                    setUploadingVideo(false);
                  }
                }}
                disabled={uploadingVideo}
                className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
              {uploadingVideo && <p className="text-sm text-gray-900 mt-1">Uploading...</p>}
              {formData.videoUrl && (
                <div className="mt-2">
                  <video src={formData.videoUrl} controls className="w-full h-32 rounded-xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Summary */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-700">Selected Addons:</span>
              <span className="ml-2 font-bold text-gray-900">{selectedAddons.length}</span>
            </div>
            <div>
              <span className="text-gray-700">Selected Variations:</span>
              <span className="ml-2 font-bold text-gray-900">{selectedVariations.length}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : '✓ Update Item'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditItem;
