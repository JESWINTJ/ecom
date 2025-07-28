import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/orders/seller`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Failed to load orders');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Seller Orders</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.currentStatus}</p>
            <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>

            {order.buyerRef && (
              <p>
                <strong>Buyer:</strong> {order.buyerRef.name} ({order.buyerRef.email})
              </p>
            )}

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.product?.product_name}</strong> (ID: <code>{item.product?._id}</code>) — Qty: {item.unitsOrdered}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default SellerOrdersPage;
