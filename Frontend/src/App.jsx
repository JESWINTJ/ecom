import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BuyerProfilePage from './pages/BuyerProfilePage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ReviewPage from './pages/ReviewPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerRegisterPage from './pages/SellerRegisterPage'; // Import the seller registration page
import AddProductPage from './pages/AddProductPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import EditProductPage from './pages/EditProductPage';
import SellerProductListPage from './pages/SellerProductListPage';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ManageSellersPage from './pages/ManageSellersPage.jsx';
import ManageUsersPage from './pages/ManageUsersPage.jsx';
import ViewOrderPage from './pages/ViewOrderPage.jsx'; // Import the view order page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/seller" element={<SellerRegisterPage />} /> {/* Consistent path */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<BuyerProfilePage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/sellerdashboard" element={<SellerDashboardPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/products/edit/:productId" element={<EditProductPage />} />
            <Route path="/seller/products" element={<SellerProductListPage />} />
            <Route path="/admindashboard" element={<AdminDashboardPage />} />
            <Route path="/managesellers" element={<ManageSellersPage />} />
            <Route path="/manageusers" element={<ManageUsersPage />} />
            <Route path="/adminorder" element={<ViewOrderPage />} /> {/* Route for viewing order details */}
            {/* Removed duplicate seller registration route */}
            {/* Add other routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;