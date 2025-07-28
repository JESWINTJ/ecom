import React, { useEffect, useState } from 'react';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
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
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">Your Order History</h2>

        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center my-5">
            <img
              src="/images/empty-orders.png"
              alt="No orders"
              style={{ width: '150px', marginBottom: '1rem' }}
            />
            <h5>No orders yet</h5>
            <p>You haven't placed any orders with us yet.</p>
            <a href="/" className="btn btn-primary mt-2">Start Shopping</a>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Placed At</th>
                  <th className="px-4 py-3">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3">{order._id}</td>
                    <td className="px-4 py-3"><strong>{order.currentStatus}</strong></td>
                    <td className="px-4 py-3">{new Date(order.placedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <ul className="list-unstyled mb-0">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="d-flex align-items-center mb-2">
                            <img
                              src={item.product.product_image}
                              alt={item.product.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                marginRight: '15px',
                                borderRadius: '5px',
                              }}
                            />
                            <div>
                              <strong>{item.product.name}</strong><br />
                              ₹{item.unitCost} × {item.unitsOrdered}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default OrderHistoryPage;
