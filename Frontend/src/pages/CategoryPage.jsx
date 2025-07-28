import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import ProductCard from '../components/products/ProductCard.jsx'; // Assuming you have a ProductCard component

function CategoryPage() {
  const { categoryName } = useParams(); // Get category name from URL
  const navigate = useNavigate();

  // Dummy product data for demonstration based on category
  // In a real application, you would fetch products based on categoryName from your backend
  const getDummyProducts = (category) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return [
          { id: 'e1', name: 'Smart Watch Pro', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Watch', price: 12000 },
          { id: 'e2', name: 'Noise Cancelling Headphones', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Headphones', price: 8500 },
          { id: 'e3', name: 'Portable Bluetooth Speaker', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Speaker', price: 3000 },
          { id: 'e4', name: 'Gaming Laptop', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Laptop', price: 75000 },
        ];
      case 'furniture':
        return [
          { id: 'f1', name: 'Modern Sofa Set', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Sofa', price: 25000 },
          { id: 'f2', name: 'Wooden Coffee Table', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Table', price: 7000 },
          { id: 'f3', name: 'Ergonomic Office Chair', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Chair', price: 9000 },
          { id: 'f4', name: 'Bookshelf Unit', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Bookshelf', price: 5500 },
        ];
      default:
        return [
          { id: 'g1', name: 'Generic Product 1', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Item1', price: 100 },
          { id: 'g2', name: 'Generic Product 2', imageUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=Item2', price: 200 },
        ];
    }
  };

  const products = getDummyProducts(categoryName || '');

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-light text-gray-800 mb-6 text-center capitalize">
          {categoryName ? `Products in ${categoryName}` : 'All Categories'}
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-xl text-gray-700">No products found for this category.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CategoryPage;
