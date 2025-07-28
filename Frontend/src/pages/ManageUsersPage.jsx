// src/pages/ManageUsersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Manage Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Phone</th>
              <th style={cellStyle}>Roles</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={cellStyle}>{user.name}</td>
                <td style={cellStyle}>{user.email}</td>
                <td style={cellStyle}>{user.phone}</td>
                <td style={cellStyle}>{user.roles?.join(', ')}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    Delete
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

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left',
};

export default ManageUsersPage;
