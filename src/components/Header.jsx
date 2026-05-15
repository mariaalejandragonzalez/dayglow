import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Header.css';

export default function Header() {
  const { currentPage, setCurrentPage, cartCount, user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  if (['login', 'register'].includes(currentPage) || !user) return null;

  const go = (p) => { setCurrentPage(p); setMenuOpen(false); };

  return (
    <header className="header" role="banner">
      <div className="header-inner page-container">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        <div
          className="logo-wrap"
          onClick={() => setCurrentPage('catalog')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setCurrentPage('catalog')}
          aria-label="DayGlow - Ir al catálogo"
        >
          <span className="logo-icon">✦</span>
          <span className="logo-text">DayGlow</span>
        </div>

        <nav className="header-actions" aria-label="Acciones principales">
          <button className="icon-btn" onClick={() => setCurrentPage('profile')} aria-label="Mi perfil" title="Mi perfil">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button
            className="icon-btn cart-btn"
            onClick={() => setCurrentPage('cart')}
            aria-label={`Carrito con ${cartCount} producto${cartCount !== 1 ? 's' : ''}`}
            title="Carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount}</span>}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true">
          <nav className="side-menu fade-in" onClick={e => e.stopPropagation()} aria-label="Menú">
            <div className="side-menu-header">
              <span className="logo-text" style={{fontSize: '1.4rem'}}>Menú</span>
              <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">✕</button>
            </div>
            <ul>
              <li><button onClick={() => go('catalog')}>Catálogo</button></li>
              <li><button onClick={() => go('kits')}>Kits estilo de vida</button></li>
              <li className="menu-divider" aria-hidden="true" />
              <li><button onClick={() => go('profile')}>Mi perfil</button></li>
              <li><button onClick={() => go('orders')}>Mis pedidos</button></li>
              <li><button onClick={() => go('contact')}>Contáctanos</button></li>
              <li><button className="logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>Cerrar sesión</button></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
