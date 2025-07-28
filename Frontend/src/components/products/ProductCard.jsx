import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    // Navigate to the ProductDetailPage for this specific product
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="bg-blue-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleProductClick}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="rounded-lg mb-2 w-full h-24 object-contain" // Added object-contain for better image fitting
      />
      <span className="text-gray-700 text-sm text-center font-medium line-clamp-2">
        {product.name}
      </span>
      {/* Optionally add price here if you want it on the card */}
      {product.price && (
        <span className="text-gray-900 font-semibold mt-1">₹{product.price}</span>
      )}
    </div>
  );
}

export default ProductCard;
