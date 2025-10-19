import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import COLOR_PALETTES from '../../theme.js';

export default function ProductUpload() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    countries: [],
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percent: '',
    stock: '',
    category_id: '',
    brand_id: '',
    image_url: '',
    sizes: [],
    colors: [],
    materials: [],
    shipping_countries: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'seller' && userData.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userData);
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [categoriesRes, brandsRes, sizesRes, colorsRes, materialsRes, countriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/products/categories', { headers }),
        fetch('http://localhost:5000/api/products/brands', { headers }),
        fetch('http://localhost:5000/api/products/attributes/sizes', { headers }),
        fetch('http://localhost:5000/api/products/attributes/colors', { headers }),
        fetch('http://localhost:5000/api/products/attributes/materials', { headers }),
        fetch('http://localhost:5000/api/products/attributes/countries', { headers }),
      ]);

      const [categories, brands, sizes, colors, materials, countries] = await Promise.all([
        categoriesRes.json(),
        brandsRes.json(),
        sizesRes.json(),
        colorsRes.json(),
        materialsRes.json(),
        countriesRes.json(),
      ]);

      setDropdownData({
        categories: categories.categories || [],
        brands: brands.brands || [],
        sizes: sizes.sizes || [],
        colors: colors.colors || [],
        materials: materials.materials || [],
        countries: countries.countries || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load form data' });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/products/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const data = await response.json();
        setDropdownData(prev => ({
          ...prev,
          categories: [...prev.categories, data.category],
        }));
        setFormData(prev => ({ ...prev, category_id: data.category.id }));
        setNewCategoryName('');
        setShowNewCategory(false);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to add category' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/products/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newBrandName }),
      });

      if (response.ok) {
        const data = await response.json();
        setDropdownData(prev => ({
          ...prev,
          brands: [...prev.brands, data.brand],
        }));
        setFormData(prev => ({ ...prev, brand_id: data.brand.id }));
        setNewBrandName('');
        setShowNewBrand(false);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to add brand' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttributeToggle = (type, id) => {
    setFormData(prev => {
      const current = prev[type] || [];
      if (current.includes(id)) {
        return { ...prev, [type]: current.filter(item => item !== id) };
      } else {
        return { ...prev, [type]: [...current, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      
      // Transform data to match backend expectations
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_percent: parseFloat(formData.discount_percent || 0),
        stock: parseInt(formData.stock || 0),
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        image_url: formData.image_url,
        sizes: formData.sizes.map(id => ({ size_id: id, stock: 1 })),
        colors: formData.colors.map(id => ({ color_id: id })),
        materials: formData.materials.map(id => ({ material_id: id, percentage: 100 })),
        shipping_countries: formData.shipping_countries.map(id => ({ country_id: id, is_available: true })),
      };
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product uploaded successfully!' });
        setFormData({
          title: '',
          description: '',
          price: '',
          discount_percent: '',
          stock: '',
          category_id: '',
          brand_id: '',
          image_url: '',
          sizes: [],
          colors: [],
          materials: [],
          shipping_countries: [],
        });
        setImagePreview(null);
        setTimeout(() => navigate('/seller/dashboard'), 2000);
      } else {
        console.error('Upload error:', data);
        setMessage({ type: 'error', text: data.error || data.message || 'Failed to upload product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div style={{ color: COLOR_PALETTES.gold }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: COLOR_PALETTES.black }}>
            Upload Product
          </h1>
          <p style={{ color: '#666' }} className="mt-2">
            Add a new product to your store
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 shadow-lg"
          style={{
            backgroundColor: COLOR_PALETTES.white,
            border: `1px solid #e0e0e0`,
          }}
        >
          {/* Basic Information Section */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                />
              </div>

              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Category *
                </label>
                <div className="flex gap-2">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                  >
                    <option value="">Select a category</option>
                    {dropdownData.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="px-4 py-2 rounded-lg font-semibold text-black"
                    style={{ backgroundColor: COLOR_PALETTES.gold }}
                  >
                    +
                  </button>
                </div>
                {showNewCategory && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-lg font-semibold text-black"
                      style={{ backgroundColor: COLOR_PALETTES.gold }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Brand
                </label>
                <div className="flex gap-2">
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                  >
                    <option value="">Select a brand</option>
                    {dropdownData.brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewBrand(!showNewBrand)}
                    className="px-4 py-2 rounded-lg font-semibold text-black"
                    style={{ backgroundColor: COLOR_PALETTES.gold }}
                  >
                    +
                  </button>
                </div>
                {showNewBrand && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="New brand name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddBrand}
                      className="px-4 py-2 rounded-lg font-semibold text-black"
                      style={{ backgroundColor: COLOR_PALETTES.gold }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div></div>
            </div>

            <div>
              <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2 mt-6">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                style={{ borderColor: COLOR_PALETTES.gold + '60' }}
              />
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                />
              </div>

              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                />
              </div>

              <div>
                <label style={{ color: '#666' }} className="block text-sm font-semibold mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  style={{ borderColor: COLOR_PALETTES.gold + '60' }}
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
              Product Image
            </h2>

            <div className="flex gap-8">
              <div
                className="w-40 h-40 rounded-lg flex items-center justify-center overflow-hidden border-2"
                style={{
                  backgroundColor: COLOR_PALETTES.gold + '10',
                  borderColor: COLOR_PALETTES.gold + '50',
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: COLOR_PALETTES.gold, opacity: 0.5 }} className="text-4xl">
                    📷
                  </span>
                )}
              </div>

              <div className="flex-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    className="inline-block px-6 py-3 rounded-lg font-semibold transition hover:shadow-md"
                    style={{
                      backgroundColor: COLOR_PALETTES.gold,
                      color: COLOR_PALETTES.white,
                    }}
                  >
                    Upload Image
                  </div>
                </label>
                <p style={{ color: '#999' }} className="text-sm mt-4">
                  Recommended: 500x500px or larger. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLOR_PALETTES.black }}>
              Product Attributes
            </h2>

            {/* Sizes */}
            <div className="mb-8">
              <p style={{ color: '#666' }} className="font-semibold mb-4">
                Available Sizes
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dropdownData.sizes?.map(size => (
                  <label key={size.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size.id)}
                      onChange={() => handleAttributeToggle('sizes', size.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2" style={{ color: '#333' }}>
                      {size.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p style={{ color: '#666' }} className="font-semibold mb-4">
                Available Colors
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dropdownData.colors?.map(color => (
                  <label key={color.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color.id)}
                      onChange={() => handleAttributeToggle('colors', color.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2 flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      {color.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="mb-8">
              <p style={{ color: '#666' }} className="font-semibold mb-4">
                Materials
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dropdownData.materials?.map(material => (
                  <label key={material.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.materials.includes(material.id)}
                      onChange={() => handleAttributeToggle('materials', material.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2" style={{ color: '#333' }}>
                      {material.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Countries */}
            <div>
              <p style={{ color: '#666' }} className="font-semibold mb-4">
                Shipping Countries
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dropdownData.countries?.map(country => (
                  <label key={country.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping_countries.includes(country.id)}
                      onChange={() => handleAttributeToggle('shipping_countries', country.id)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2" style={{ color: '#333' }}>
                      {country.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition hover:shadow-md text-lg"
              style={{
                backgroundColor: COLOR_PALETTES.gold,
                color: COLOR_PALETTES.white,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition border-2"
              style={{
                borderColor: COLOR_PALETTES.gold,
                color: COLOR_PALETTES.gold,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
