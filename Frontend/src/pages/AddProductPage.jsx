import React, { useState } from 'react';
import axios from 'axios';

function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    details: '',
    category: '',
    amount: '',
    stock: '',
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from wherever you store it (localStorage, context, etc.)
  const token = localStorage.getItem('token'); // or from your auth context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please upload an image');
      return;
    }
    console.log('Form data before submission:', form);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('details', form.details);
    formData.append('category', form.category);
    formData.append('amount', form.amount);
    formData.append('stock', form.stock);
    formData.append('product_image', image);

    try {
      setLoading(true);
      setMessage('');
      
      const response = await axios.post('http://localhost:5000/api/sellers/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || 'Product added successfully!');
      setForm({
        name: '',
        details: '',
        category: '',
        amount: '',
        stock: '',
      });
      setImage(null);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add product');
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {message && (
        <p className={`text-sm mb-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="details" placeholder="Product Details" value={form.details} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" required />

        <button 
          type="submit" 
          disabled={loading} 
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProductPage;