import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSuccess('');
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${import.meta.env.VITE_PUBLIC_BASE_URL}/api/users/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error && !profile.name) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg space-y-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">User Profile</h1>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-500 text-sm text-center">{success}</div>}

      <div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default UserProfilePage;
