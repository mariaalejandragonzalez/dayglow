import { useApp } from '../context/AppContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { setCurrentPage, setSelectedProduct, speak } = useApp();

  const handleClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  return (
    <article
      className="product-card card"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`${product.name} - ${product.price.toLocaleString('es-CO')} pesos`}
    >
      <div className="product-img-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-img-placeholder">
            <span>{product.name}</span>
          </div>
        )}
        <button
          className="product-audio-btn"
          onClick={e => {
            e.stopPropagation();
            speak(`${product.name}. Precio ${product.price.toLocaleString('es-CO')} pesos.`);
          }}
          aria-label={`Escuchar descripción de ${product.name}`}
          title="Leer en voz alta"
        >
          🔊
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toLocaleString('es-CO')}</p>
        <button className="btn-soft product-cta">Ver producto</button>
      </div>
    </article>
  );
}
