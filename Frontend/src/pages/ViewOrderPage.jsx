import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const { data } = await axios.get(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">View All Orders</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchOrders}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Buyer</th>
                <th className="py-2 px-4 border">Seller</th>
                <th className="py-2 px-4 border">Products</th>
                {/* <th className="py-2 px-4 border">Total</th> */}
                {/* <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Delivery</th>
                <th className="py-2 px-4 border">Date</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border text-sm">{order._id}</td>
                  <td className="py-2 px-4 border">
                    <div>
                      <p className="font-medium">{order.buyerRef?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.buyerRef?.email || ''}</p>
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    <div>
                      <p className="font-medium">{order.seller_id?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.seller_id?.email || ''}</p>
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    <ul className="list-disc pl-5">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.product?.name || 'Product'} × {item.unitsOrdered}
                          {item.product?.price && (
                            <span className="text-gray-500 ml-2">
                              (${(item.product.price * item.unitsOrdered).toFixed(2)})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  {/* <td className="py-2 px-4 border">
                    ${order.items.reduce((sum, item) => {
                      return sum + (item.product?.price || 0) * item.unitsOrdered;
                    }, 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border text-sm">{formatAddress(order.deliveryTo)}</td>
                  <td className="py-2 px-4 border text-sm">
                    {new Date(order.createdAt).toLocaleDateString()} <br />
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewOrderPage;