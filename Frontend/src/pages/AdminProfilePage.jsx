import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(data);
      setFormData({ name: data.name, email: data.email, phone: data.phone });
    } catch (err) {
      setMessage('Failed to fetch profile');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/admin/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchAdmin(); // Refresh updated data
    } catch (err) {
      setMessage('Error updating profile');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Profile</h2>
        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : (
          <>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.buttonGroup}>
              {editing ? (
                <>
                  <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} style={styles.editBtn}>Edit Profile</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#555',
  },
  input: (enabled) => ({
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: enabled ? '1px solid #ccc' : '1px solid transparent',
    backgroundColor: enabled ? '#fff' : '#f5f5f5',
    fontSize: '16px',
  }),
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  editBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  loading: {
    fontStyle: 'italic',
    color: '#555',
  },
  message: {
    marginBottom: '20px',
    color: '#555',
    fontWeight: '500',
  },
};

export default AdminProfilePage;
