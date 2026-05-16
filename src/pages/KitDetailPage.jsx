import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './KitDetailPage.css';
import ProductReviews from '../components/ProductReviews';

export default function KitDetailPage() {
  const { kits, setCurrentPage, addToCart, speak } = useApp();
  const [kit, setKit] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem('selectedKitId');
    if (storedId && kits.length > 0) {
      const found = kits.find(k => String(k.id) === String(storedId));
      setKit(found || kits[0]);
    } else if (kits.length > 0) {
      setKit(kits[0]);
    }
  }, [kits]);

  if (!kit) {
    return <div className="page-container" style={{padding:'3rem'}}>Cargando…</div>;
  }

  const handleAdd = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart({
        id: `kit-${kit.id}`,
        name: kit.name,
        price: kit.price,
        image_url: kit.image_url,
        color: 'Standard',
      });
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
    setQuantity(1);
  };

  return (
    <main className="kit-detail page-container fade-in" aria-label={`Detalle del ${kit.name}`}>
      <button className="back-btn" onClick={() => setCurrentPage('kits')}>
        ← Volver a los kits
      </button>

      <h1 className="kit-detail-title">
        {kit.name}
        <button
          className="audio-inline-btn"
          onClick={() => speak(`${kit.name}. ${kit.description}. Precio: ${kit.price.toLocaleString('es-CO')} pesos. Incluye: ${kit.includes?.join(', ')}.`)}
          aria-label="Escuchar descripción del kit"
        >🔊</button>
      </h1>

      <div className="kit-detail-grid">
        <div className="kit-image-wrap">
          {kit.image_url ? (
            <img src={kit.image_url} alt={kit.name} />
          ) : (
            <div className="kit-placeholder">{kit.name}</div>
          )}
        </div>

        <div className="kit-info-side">
          <p className="kit-detail-price">${kit.price.toLocaleString('es-CO')}</p>
          <p className="kit-detail-desc">{kit.description}</p>

          <div className="kit-includes-section">
            <h2 className="includes-title">¿Qué incluye este kit?</h2>
            <ul className="includes-list">
              {kit.includes?.map((item, i) => (
                <li key={i} className="includes-item">
                  <span className="includes-bullet">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="kit-savings">
            <p>💄 Un kit perfectamente curado para que disfrutes los mejores productos juntos.</p>
          </div>

          <div className="quantity-selector">
            <label htmlFor="kit-quantity" className="field-label">
              Cantidad:
            </label>
            <div className="quantity-controls">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                disabled={quantity <= 1}
              >−</button>
              <input
                id="kit-quantity"
                type="number"
                className="qty-input"
                min="1"
                max="10"
                value={quantity}
                onChange={e => {
                  const v = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(v, 10)));
                }}
                aria-label="Cantidad"
              />
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                aria-label="Aumentar cantidad"
                disabled={quantity >= 10}
              >+</button>
            </div>
            <p className="qty-info">
              Subtotal: <strong>${(kit.price * quantity).toLocaleString('es-CO')}</strong>
            </p>
          </div>

          <button
            className="btn-primary add-cart-btn"
            onClick={handleAdd}
          >
            Añadir {quantity} {quantity === 1 ? 'kit' : 'kits'} al carrito
          </button>
        </div>
      </div>
     {/* Sección de Reseñas */}
      <ProductReviews productId={kit.id} itemType="kit" />
      {showToast && (
        <div className="product-toast card slide-up" role="status" aria-live="polite">
          <div className="toast-content">
            <span className="toast-icon" aria-hidden="true">✓</span>
            <p>¡{kit.name} agregado al carrito!</p>
          </div>
          <div className="toast-actions">
            <button className="btn-soft" onClick={() => setCurrentPage('kits')}>Ver más kits</button>
            <button className="btn-primary" onClick={() => setCurrentPage('cart')}>Ver carrito</button>
          </div>
        </div>
      )}
    </main>
  );
}