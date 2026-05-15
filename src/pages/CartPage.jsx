import { useApp } from '../context/AppContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, addToCart, cartTotal, setCurrentPage, speak } = useApp();
  const subtotal = cartTotal;
  const tax = subtotal * 0.19;
  const taxIncluded = subtotal - (subtotal / 1.19);
  const total = subtotal;

  if (cart.length === 0) {
    return (
      <main className="cart-page page-container fade-in">
        <button className="back-btn" onClick={() => setCurrentPage('catalog')}>← Volver</button>
        <h1 className="cart-title">Carrito de compras</h1>
        <div className="empty-cart">
          <span className="empty-icon" aria-hidden="true">🛍️</span>
          <p>Tu carrito está vacío.</p>
          <button className="btn-primary" onClick={() => setCurrentPage('catalog')}>
            Explorar productos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page page-container fade-in" aria-label="Carrito de compras">
      <button className="back-btn" onClick={() => setCurrentPage('catalog')}>← Volver</button>
      <h1 className="cart-title">
        Carrito de compras
        <button
          className="audio-inline-btn"
          onClick={() => speak(`Tu carrito tiene ${cart.length} productos. Total: ${total.toLocaleString('es-CO')} pesos.`)}
          aria-label="Escuchar resumen"
        >🔊</button>
      </h1>

      <div className="cart-table" role="table">
        <div className="cart-table-header" role="row">
          <span role="columnheader">Artículos</span>
          <span role="columnheader">Descripción</span>
          <span role="columnheader">Precio</span>
        </div>

        {cart.map((item, i) => (
          <article className="cart-row" role="row" key={`${item.id}-${item.color}-${i}`}>
            <div className="cart-img-wrap" role="cell">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                <div className="cart-img-placeholder">{item.name?.[0]}</div>
              )}
            </div>
            <div className="cart-desc" role="cell">
              <h3>{item.name}</h3>
              <p>Color: {item.color}</p>
              <div className="cart-qty-controls">
                <button
                  className="cart-qty-btn"
                  onClick={() => removeFromCart(item)}
                  aria-label="Disminuir cantidad"
                  disabled={item.quantity <= 1}
                >−</button>
                <span className="cart-qty-value">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => addToCart({ ...item, image_url: item.image_url })}
                  aria-label="Aumentar cantidad"
                >+</button>
              </div>
              <button
                className="cart-remove"
                onClick={() => {
                  for (let i = 0; i < item.quantity; i++) removeFromCart(item);
                }}
                aria-label={`Eliminar ${item.name}`}
              >
                🗑️ Eliminar todos
              </button>
            </div>
            <div className="cart-price" role="cell">
              ${(item.price * item.quantity).toLocaleString('es-CO')}
            </div>
          </article>
        ))}
      </div>

      <div className="cart-summary card">
        <div className="cart-line">
          <span>Subtotal ({cart.length})</span>
          <strong>${subtotal.toLocaleString('es-CO')}</strong>
        </div>
        <div className="cart-line">
          <span>Total de envío</span>
          <strong className="free-tag">Gratis</strong>
        </div>
        <div className="cart-line">
          <span>IVA incluido</span>
          <strong>${taxIncluded.toLocaleString('es-CO', { maximumFractionDigits: 2 })}</strong>
        </div>
        <div className="cart-line cart-total">
          <span>Total</span>
          <strong>${total.toLocaleString('es-CO')}</strong>
        </div>
      </div>

      <div className="cart-actions">
        <button className="btn-dark" onClick={() => setCurrentPage('checkout')}>
          Confirmar pedido
        </button>
        <button className="btn-dark" onClick={() => setCurrentPage('catalog')}>
          Seguir explorando
        </button>
      </div>
    </main>
  );
}
