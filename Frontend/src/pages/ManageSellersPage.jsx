import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/sellers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSellers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error fetching sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm('Are you sure you want to remove this seller?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSellers((prev) => prev.filter((seller) => seller._id !== sellerId));
      alert('Seller removed successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to remove seller');
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Manage Sellers</h2>
      {loading ? (
        <p>Loading sellers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sellers.length === 0 ? (
        <p>No sellers found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="text-center">
                <td className="border border-gray-300 p-2">{seller.name}</td>
                <td className="border border-gray-300 p-2">{seller.email}</td>
                <td className="border border-gray-300 p-2">{seller.phone}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(seller._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSellersPage;
