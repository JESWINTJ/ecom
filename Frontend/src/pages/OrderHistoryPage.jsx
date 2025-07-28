import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); // must be correct
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/orders/my`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <div className="order-history container">
        <h2 className="my-4">Your Order History</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center my-5">
            <img
              src="/images/empty-orders.png"
              alt="No orders"
              style={{ width: '120px', marginBottom: '1rem' }}
            />
            <h5>No orders yet</h5>
            <p>You haven't placed any orders with us yet.</p>
            <a href="/" className="btn btn-primary">Start Shopping</a>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p>Status: <strong>{order.currentStatus}</strong></p>
                  <p>Placed At: {new Date(order.placedAt).toLocaleString()}</p>

                  <div>
                    <h6>Items:</h6>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <img
                            src={item.product.product_image}
                            alt={item.product.name}
                            style={{ width: '40px', marginRight: '10px' }}
                          />
                          {item.product.name} — ₹{item.unitCost} x {item.unitsOrdered}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderHistoryPage;
