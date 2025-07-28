import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import Header from '../components/layout/Header.jsx';
// import Footer from '../components/layout/Footer.jsx';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const discount = 0;
  const coupons = 12;
  const platformFee = 4;

  useEffect(() => {
    if (location.state && location.state.product) {
      setCartItem(location.state.product);
      setQuantity(1);
      localStorage.setItem('cartItem', JSON.stringify(location.state.product));
      localStorage.setItem('cartQuantity', '1');
    } else {
      const savedItem = localStorage.getItem('cartItem');
      const savedQty = localStorage.getItem('cartQuantity');
      if (savedItem) {
        setCartItem(JSON.parse(savedItem));
        setQuantity(parseInt(savedQty || '1'));
      }
    }
  }, [location.state]);

  const calculateTotal = () => {
    if (!cartItem) return 0;
    const itemPrice = parseFloat(cartItem.amount) * quantity;
    const total = itemPrice - discount - coupons + platformFee;
    return total;
  };

  const handleQuantityChange = (type) => {
    setQuantity(prevQuantity => {
      let newQuantity = prevQuantity;
      if (type === 'increment') {
        newQuantity = prevQuantity + 1;
      } else if (type === 'decrement' && prevQuantity > 1) {
        newQuantity = prevQuantity - 1;
      }
      localStorage.setItem('cartQuantity', newQuantity.toString());
      return newQuantity;
    });
  };

  const handleBuyNow = () => {
    if (!cartItem) {
      console.log('Cart is empty');
      return;
    }
    navigate('/checkout', {
      state: {
        cartData: { ...cartItem, quantity },
        discountAmount: discount,
        couponsAmount: coupons,
        platformFeeAmount: platformFee,
        totalAmount: calculateTotal(),
        savedAmount: (parseFloat(cartItem.amount) * quantity) - calculateTotal()
      }
    });
  };

  const handleRemove = () => {
    setCartItem(null);
    setQuantity(0);
    localStorage.removeItem('cartItem');
    localStorage.removeItem('cartQuantity');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-start md:items-stretch gap-8">
        {cartItem ? (
          <>
            <div className="flex flex-col items-center md:w-1/3 p-4 bg-white rounded-xl shadow-lg">
              <img
                src={cartItem.product_image}
                alt={cartItem.name}
                className="max-w-full h-auto rounded-lg mb-6 border border-gray-200"
              />
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-6">
                <button onClick={() => handleQuantityChange('decrement')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-semibold">
                  -
                </button>
                <span className="px-6 py-2 text-lg font-semibold text-gray-800 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button onClick={() => handleQuantityChange('increment')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-semibold">
                  +
                </button>
              </div>
              <button onClick={handleBuyNow} className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg mb-4 hover:bg-yellow-500 transition duration-300 shadow-md">
                Buy Now
              </button>
              <button onClick={handleRemove} className="w-full bg-yellow-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-yellow-300 transition duration-300 shadow-md">
                Remove
              </button>
            </div>

            <div className="flex-grow p-4 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-medium text-gray-800 mb-4 border-b pb-3">PRICE DETAILS</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({quantity} item)</span>
                  <span>₹{parseFloat(cartItem.amount) * quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">- ₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coupons for you</span>
                  <span className="text-green-600">- ₹{coupons}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
              <p className="text-green-600 font-semibold mt-4">
                You will save ₹{(parseFloat(cartItem.amount) * quantity) - calculateTotal()} on this order
              </p>
            </div>
          </>
        ) : (
          <div className="w-full text-center p-8 bg-white rounded-xl shadow-lg">
            <p className="text-xl text-gray-700">Your cart is empty.</p>
            <button onClick={() => navigate('/')} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
              Continue Shopping
            </button>
          </div>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default CartPage;
