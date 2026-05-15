import { useApp } from './context/AppContext';
import Header from './components/Header';
import AccessibilityBar from './components/AccessibilityBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import KitsPage from './pages/KitsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  const { currentPage, loading, user, setCurrentPage } = useApp();

  if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
    if (currentPage !== 'reset-password') {
      setTimeout(() => setCurrentPage('reset-password'), 0);
    }
  }

  // Páginas públicas (sin login)
  const publicPages = ['login', 'register', 'forgot-password', 'reset-password'];
  const showAuth = !user && !publicPages.includes(currentPage);
  const page = showAuth ? 'login' : currentPage;

  const renderPage = () => {
    switch (page) {
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'forgot-password': return <ForgotPasswordPage />;
      case 'reset-password': return <ResetPasswordPage />;
      case 'catalog': return <CatalogPage />;
      case 'product': return <ProductPage />;
      case 'kits': return <KitsPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'payment': return <PaymentPage />;
      case 'order-success': return <OrderSuccessPage />;
      case 'profile': return <ProfilePage />;
      case 'orders': return <OrdersPage />;
      case 'contact': return <ContactPage />;
      default: return <CatalogPage />;
    }
  };

  return (
    <>
      <Header />
      {renderPage()}
      <AccessibilityBar />
    </>
  );
}
