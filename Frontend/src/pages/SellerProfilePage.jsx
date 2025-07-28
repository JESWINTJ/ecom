import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerProfilePage = () => {
  const [seller, setSeller] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gstNumber: '',
    address: { street: '', city: '', pincode: '' },
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/sellers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeller(data);
      setFormData({
        name: data.name,
        phone: data.phone,
        gstNumber: data.gstNumber,
        address: {
          street: data.address.street || '',
          city: data.address.city || '',
          pincode: data.address.pincode || '',
        },
      });
    } catch (err) {
      setMessage('Failed to fetch profile');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['street', 'city', 'pincode'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/sellers/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage('Failed to update profile');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Seller Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone:</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>GST Number:</label>
              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Street:</label>
              <input
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>City:</label>
              <input
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                disabled={!editing}
                style={styles.input(editing)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pincode:</label>
              <input
                name="pincode"
                value={formData.address.pincode}
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
    maxWidth: '600px',
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
  message: {
    marginBottom: '15px',
    color: '#444',
    fontWeight: '500',
  },
};

export default SellerProfilePage;
