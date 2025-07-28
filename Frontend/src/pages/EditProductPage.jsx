import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    details: '',
    category: '',
    amount: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try the specific product endpoint
        let response;
        try {
            console.log('Fetching product with ID:', id);
          response = await axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (fetchError) {
          // If specific endpoint fails, try fetching all products and find the matching one
          console.log('Specific product fetch failed, trying all products...');
          const allProductsResponse = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/sellers/products`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const product = allProductsResponse.data.products.find(p => p._id === id);
          if (!product) {
            throw new Error('Product not found');
          }
          response = { data: { product } };
        }

        const product = response.data.product;
        setForm({
          name: product.name,
          details: product.details,
          category: product.category,
          amount: product.amount,
          stock: product.stock,
        });
        setCurrentImage(product.product_image || '');
        setFetching(false);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message || 'Failed to fetch product');
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('details', form.details);
    formData.append('category', form.category);
    formData.append('amount', form.amount);
    formData.append('stock', form.stock);
    if (image) {
      formData.append('product_image', image);
    }

    try {
      setLoading(true);
      setMessage('');
      
      const response = await axios.put(
        `http://localhost:5000/api/sellers/products/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || 'Product updated successfully!');
      setTimeout(() => {
        navigate('/seller/products'); // Redirect to products list after success
      }, 1500);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto p-4 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Update Product</h2>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (message && message.includes('not found')) {
    return (
      <div className="container mx-auto p-4 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Update Product</h2>
        <p className="text-red-600">{message}</p>
        <button 
          onClick={() => navigate('/seller/products')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>

      {message && (
        <p className={`text-sm mb-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {currentImage && !image && (
        <div className="mb-4">
          <p className="text-sm mb-1">Current Image:</p>
          <img 
            src={`http://localhost:5000/${currentImage}`} 
            alt="Current product" 
            className="h-32 object-cover rounded"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="details" placeholder="Product Details" value={form.details} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full border p-2 rounded" required />
        <div>
          <p className="text-sm mb-1">Update Image (leave blank to keep current):</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
        </div>

        <div className="flex space-x-4">
          <button 
            type="submit" 
            disabled={loading} 
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/seller/products')} 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;