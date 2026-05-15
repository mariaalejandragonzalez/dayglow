import { useApp } from '../context/AppContext';
import './AccessibilityBar.css';

export default function AccessibilityBar() {
  const {
    increaseFontSize, decreaseFontSize,
    darkMode, setDarkMode,
    highContrast, setHighContrast,
    speak, stopSpeaking, isSpeaking,
    currentPage,
  } = useApp();

  const pageTexts = {
    login: 'Página de inicio de sesión DayGlow. Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.',
    register: 'Página de registro. Completa el formulario con tu nombre, correo, ciudad, contraseña y confirmación de contraseña para crear tu cuenta.',
    catalog: 'Catálogo de productos DayGlow. Explora nuestra selección de cosméticos y productos de belleza.',
    product: 'Detalle del producto. Selecciona el tono de tu preferencia y agrégalo al carrito.',
    kits: 'Kits estilo de vida. Encuentra el kit perfecto para ti.',
    cart: 'Carrito de compras. Revisa los productos seleccionados y confirma tu pedido.',
    checkout: 'Datos de entrega. Completa tu información de contacto y dirección para recibir tu pedido.',
    payment: 'Método de pago. Selecciona cómo deseas pagar tu pedido.',
    'order-success': 'Tu pago ha sido exitoso. Gracias por tu compra.',
    profile: 'Perfil de usuario. Aquí puedes ver tu información personal.',
    orders: 'Mis pedidos. Historial de tus compras anteriores.',
  };

  const handleSpeak = () => {
    if (isSpeaking) stopSpeaking();
    else speak(pageTexts[currentPage] || 'DayGlow, belleza para tu día a día.');
  };

  return (
    <div className="a11y-bar" role="toolbar" aria-label="Opciones de accesibilidad">
      <button
        className="a11y-btn"
        onClick={increaseFontSize}
        title="Aumentar tamaño de letra"
        aria-label="Aumentar tamaño de letra"
      >
        <span aria-hidden="true">A+</span>
      </button>
      <button
        className="a11y-btn"
        onClick={decreaseFontSize}
        title="Disminuir tamaño de letra"
        aria-label="Disminuir tamaño de letra"
      >
        <span aria-hidden="true">A-</span>
      </button>
      <button
        className={`a11y-btn ${darkMode ? 'active' : ''}`}
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        aria-pressed={darkMode}
      >
        <span aria-hidden="true">{darkMode ? '☀' : '🌙'}</span>
      </button>
      <button
        className={`a11y-btn ${highContrast ? 'active' : ''}`}
        onClick={() => setHighContrast(!highContrast)}
        title={highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
        aria-label={highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
        aria-pressed={highContrast}
      >
        <span aria-hidden="true">◐</span>
      </button>
      <button
        className={`a11y-btn ${isSpeaking ? 'active speaking' : ''}`}
        onClick={handleSpeak}
        title={isSpeaking ? 'Detener lectura' : 'Leer página en voz alta'}
        aria-label={isSpeaking ? 'Detener lectura' : 'Leer página en voz alta'}
        aria-pressed={isSpeaking}
      >
        <span aria-hidden="true">{isSpeaking ? '🔇' : '🔊'}</span>
      </button>
    </div>
  );
}
