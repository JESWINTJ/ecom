import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SellerProductListPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    details: '',
    category: '',
    amount: '',
    stock: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data.products && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setMessage('Invalid products data format');
        setProducts([]);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product._id !== productId));
      setMessage('Product deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      details: product.details,
      category: product.category,
      amount: product.amount,
      stock: product.stock
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (productId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.map(product => 
        product._id === productId ? res.data.product : product
      ));
      setEditingProduct(null);
      setMessage('Product updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update product');
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {message && (
        <p className={`mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              {editingProduct === product._id ? (
                <div className="edit-form">
                  <div className="mb-3">
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Details</label>
                    <textarea
                      name="details"
                      value={editFormData.details}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      value={editFormData.amount}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(product._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.details}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Price:</strong> ₹{product.amount}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  {product.product_image && (
                    <img
                      src={product.product_image}
                      alt={product.name}
                      className="w-full h-48 object-cover mt-2"
                    />
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerProductListPage;