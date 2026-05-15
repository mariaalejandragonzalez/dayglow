import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

export default function CatalogPage() {
  const { products, speak, setCurrentPage, setSelectedProduct } = useApp();
  const [search, setSearch] = useState('');

  const tipProduct = products.find(p => p.is_tip);
  const featured = products.filter(p => !p.is_tip).slice(0, 3);
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleTipClick = () => {
    setSelectedProduct(tipProduct);
    setCurrentPage('product');
  };

  return (
    <main className="catalog-page" aria-label="Catálogo de productos">
      <div className="page-container">
        <div className="catalog-header">
          <h1 className="catalog-title">CATÁLOGO</h1>
        </div>

        <div className="search-wrap">
          <label htmlFor="catalog-search" className="sr-only">Buscar productos</label>
          <div className="search-inner">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="catalog-search"
              type="search"
              className="search-input"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {!search && (
          <>
            {tipProduct && (
              <section className="tip-section" aria-label="Producto destacado">
                <div className="tip-label">
                  <span>Producto Tip</span>
                  <button
                    className="audio-inline-btn"
                    onClick={() => speak(`Producto tip: ${tipProduct.name}. ${tipProduct.description}. Precio ${tipProduct.price.toLocaleString('es-CO')} pesos.`)}
                    aria-label="Escuchar producto destacado"
                  >🔊</button>
                </div>
                <p className="tip-subtitle">El producto de uso más elegante</p>
                <article
                  className="tip-card card"
                  onClick={handleTipClick}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleTipClick()}
                >
                  <div className="tip-img-wrap">
                    {tipProduct.image_url ? (
                      <img src={tipProduct.image_url} alt={tipProduct.name} />
                    ) : (
                      <div className="tip-placeholder">{tipProduct.name}</div>
                    )}
                  </div>
                  <div className="tip-info">
                    <h2>{tipProduct.name}</h2>
                    <button className="btn-soft" style={{marginTop: '0.5rem'}}>Ver producto</button>
                  </div>
                </article>
              </section>
            )}

            <section className="featured-section" aria-label="Lo más vendido">
              <div className="section-header">
                <h2 className="section-title">Lo más vendido</h2>
                <button
                  className="audio-inline-btn"
                  onClick={() => speak('Sección: Lo más vendido. Productos más populares de DayGlow.')}
                  aria-label="Escuchar sección"
                >🔊</button>
              </div>
              <div className="product-grid">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>

            <section className="all-section" aria-label="Todos los productos">
              <div className="section-header">
                <h2 className="section-title">Todos los productos</h2>
              </div>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          </>
        )}

        {search && (
          <section aria-label={`Resultados para "${search}"`}>
            <p className="search-results-label">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{search}"
            </p>
            {filtered.length > 0
              ? <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
              : <p className="no-results">No se encontraron productos.</p>
            }
          </section>
        )}
      </div>
    </main>
  );
}
