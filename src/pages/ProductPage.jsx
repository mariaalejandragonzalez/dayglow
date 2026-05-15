import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductReviews from '../components/ProductReviews';
import './ProductPage.css';

export default function ProductPage() {
  const { selectedProduct, setCurrentPage, addToCart, speak, products } = useApp();
  const product = selectedProduct || products[0];
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [showTest, setShowTest] = useState(false);

  if (!product) return <div className="page-container" style={{padding:'3rem'}}>Cargando…</div>;

  const colors = product.colors || ['Default'];
  const colorHex = product.color_hex || ['#E87BA0'];
  const stock = product.stock || [10];

  const handleAdd = async () => {
    // Agregar al carrito la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      await addToCart({
        ...product,
        color: colors[colorIndex],
        colorHex: colorHex[colorIndex],
      });
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
    setQuantity(1); // Reset
  };

  
  const testTones = colors.map((c, i) => ({ name: c, hex: colorHex[i] }));

  return (
    <main className="product-page page-container fade-in" aria-label={`Detalle: ${product.name}`}>
      <button
        className="back-btn"
        onClick={() => setCurrentPage('catalog')}
        aria-label="Volver al catálogo"
      >← Volver</button>

      <h1 className="product-title">
        Información Producto
        <button
          className="audio-inline-btn"
          onClick={() => speak(`${product.name}. ${product.description}. Precio: ${product.price.toLocaleString('es-CO')} pesos.`)}
          aria-label="Leer descripción"
        >🔊</button>
      </h1>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-main-img">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="product-img-fallback">
                <span>{product.name}</span>
              </div>
            )}
          </div>
          <button className="test-product-btn" onClick={() => setShowTest(true)}>
             Test producto
          </button>
        </div>

        <div className="product-detail-info">
          <p className="product-detail-price">${product.price.toLocaleString('es-CO')}</p>
          <p className="product-detail-desc">{product.description}</p>

          <div className="color-selector">
            <p className="selector-label">Tono: <strong>{colors[colorIndex]}</strong></p>
            <div className="color-swatches" role="radiogroup" aria-label="Selector de tono">
              {colors.map((c, i) => (
                <button
                  key={c}
                  className={`color-swatch ${colorIndex === i ? 'active' : ''} ${stock[i] === 0 ? 'sold-out' : ''}`}
                  style={{ background: colorHex[i] }}
                  onClick={() => setColorIndex(i)}
                  aria-label={`Tono ${c}${stock[i] === 0 ? ' - Agotado' : ''}`}
                  role="radio"
                  aria-checked={colorIndex === i}
                  title={stock[i] === 0 ? `${c} - Agotado` : c}
                />
              ))}
            </div>
            <p className="available-info">
              {stock[colorIndex] === 0 ? (
                <span className="sold-out-tag">⚠️ Agotado</span>
              ) : stock[colorIndex] <= 5 ? (
                <>Disponibles: <strong className="low-stock">{stock[colorIndex]} (¡Pocas unidades!)</strong></>
              ) : (
                <>Disponibles: <strong>{stock[colorIndex]}</strong></>
              )}
            </p>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity-input" className="field-label">
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
                id="quantity-input"
                type="number"
                className="qty-input"
                min="1"
                max={stock[colorIndex]}
                value={quantity}
                onChange={e => {
                  const v = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(v, stock[colorIndex])));
                }}
                aria-label="Cantidad"
              />
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity(q => Math.min(stock[colorIndex], q + 1))}
                aria-label="Aumentar cantidad"
                disabled={quantity >= stock[colorIndex]}
              >+</button>
            </div>
            <p className="qty-info">
              Subtotal: <strong>${(product.price * quantity).toLocaleString('es-CO')}</strong>
            </p>
          </div>

          <button
            className="btn-primary add-cart-btn"
            onClick={handleAdd}
            disabled={stock[colorIndex] === 0}
          >
            {stock[colorIndex] === 0
              ? 'Agotado'
              : `Añadir ${quantity} ${quantity === 1 ? 'producto' : 'productos'} al carrito`
            }
          </button>
        </div>
      </div>

      {showToast && (
        <div className="product-toast card slide-up" role="status" aria-live="polite">
          <div className="toast-content">
            <span className="toast-icon" aria-hidden="true">ℹ</span>
            <p>El producto se ha agregado correctamente al carrito</p>
          </div>
          <div className="toast-actions">
            <button className="btn-soft" onClick={() => setShowToast(false)}>Volver</button>
            <button className="btn-primary" onClick={() => setCurrentPage('cart')}>Ver carrito</button>
          </div>
        </div>
      )}

      {/* Sección de Reseñas */}
      <ProductReviews productId={product.id} />
      {showTest && (
        <div className="modal-overlay" onClick={() => setShowTest(false)} role="dialog" aria-modal="true" aria-labelledby="test-title">
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTest(false)} aria-label="Cerrar">✕</button>
            <h2 id="test-title" className="modal-title">TEST PRODUCTO</h2>
            <p style={{textAlign:'center', fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem'}}>
              Vista previa de tonos disponibles
            </p>
            <div className="test-grid">
              {testTones.map((t, i) => (
                <div key={i} className="test-item" onClick={() => { setColorIndex(i); setShowTest(false); }}>
                  <div className="test-circle" style={{ background: t.hex }} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
            <button
              className="btn-primary"
              style={{width: '100%', marginTop: '1.25rem'}}
              onClick={() => setShowTest(false)}
            >
              Ver información del producto
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
