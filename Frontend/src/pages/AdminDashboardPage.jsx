import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [admin, setAdmin] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAdminProfile = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/profile');
       withCredentials: true
      setAdmin(data);
    } catch (err) {
      setError('Error fetching admin profile');
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, sellersRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/sellers'),
        axios.get('/api/admin/orders'),
      ]);

      setUserCount(usersRes.data.length);
      setSellerCount(sellersRes.data.length);
      setOrderCount(ordersRes.data.length);
    } catch (err) {
      setError('Error fetching stats');
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {admin.name}</h2>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone:</strong> {admin.phone}</p>
        <p><strong>Role:</strong> {admin.role?.join(', ')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-bold">Users</h3>
          <p className="text-2xl">{userCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-bold">Sellers</h3>
          <p className="text-2xl">{sellerCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md text-center">
          <h3 className="text-lg font-bold">Orders</h3>
          <p className="text-2xl">{orderCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/manageusers')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/managesellers')}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Manage Sellers
        </button>
        <button
          onClick={() => navigate('/adminorder')}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate('/admin/profile')}
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
