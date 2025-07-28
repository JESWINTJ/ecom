import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard'; // Ensure ProductCard is imported

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/products`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched products:", data); // ✅ Add this
      setProducts(data.products || []); // Ensure data.products exists
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  // Filter products for different sections based on the 'category' field
  // Ensure your database products have a 'category' field (e.g., "electronics", "clothing")
  const electronicsProducts = products.filter(p => p.category === 'electronics');
  const clothingProducts = products.filter(p => p.category === 'clothing'); // Example for your "Updated Product Name"
  const furnitureProducts = products.filter(p => p.category === 'furniture');


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header component is not rendered here */}

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto p-4">
        {/* Banners Ads Section */}
        <section className="bg-blue-100 rounded-xl p-8 mb-8 text-center text-blue-800 text-xl font-medium shadow-inner">
          banners ads
        </section>

        {/* Best of Electronics Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Best of electronics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {electronicsProducts.length > 0 ? (
              electronicsProducts.map(product => (
                // Map backend fields to frontend expected props for ProductCard
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.name,
                    imageUrl: product.product_image, // Map product_image to imageUrl
                    price: parseFloat(product.amount), // Map amount to price, convert Decimal128 to number
                    // Pass other relevant fields if ProductCard needs them
                  }}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No electronic products found.</p>
            )}
          </div>
        </section>

        {/* Example for 'clothing' category if you have products like the one you provided */}
        <section className="mb-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Best of Clothing</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {clothingProducts.length > 0 ? (
              clothingProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.name,
                    imageUrl: product.product_image,
                    price: parseFloat(product.amount),
                  }}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No clothing products found.</p>
            )}
          </div>
        </section>

        {/* Best of Furniture Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Best of furniture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {furnitureProducts.length > 0 ? (
              furnitureProducts.map(product => (
                // Map backend fields to frontend expected props for ProductCard
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.name,
                    imageUrl: product.product_image, // Map product_image to imageUrl
                    price: parseFloat(product.amount), // Map amount to price, convert Decimal128 to number
                    // Pass other relevant fields if ProductCard needs them
                  }}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No furniture products found.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer component is not rendered here */}
    </div>
  );
}

export default HomePage;
