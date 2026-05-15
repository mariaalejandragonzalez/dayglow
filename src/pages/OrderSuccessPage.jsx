import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './OrderSuccess.css';

export default function OrderSuccessPage() {
  const { setCurrentPage, speak } = useApp();

  useEffect(() => {
    speak('Tu pago ha sido exitoso. Gracias por tu compra.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="success-page page-container fade-in" aria-label="Pago exitoso">
      <div className="success-container">
        <div className="success-illustration" aria-hidden="true">
          <svg viewBox="0 0 200 160" width="180" height="140">
            <defs>
              <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAD4E6"/>
                <stop offset="100%" stopColor="#E8538A"/>
              </linearGradient>
            </defs>
            <rect x="55" y="20" width="90" height="130" rx="14" fill="url(#bagGrad)" stroke="#C43070" strokeWidth="2"/>
            <g transform="translate(72, 50)">
              <path d="M0 8 L10 8 L18 38 L48 38 L56 14 L14 14"
                fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="48" r="4" fill="white"/>
              <circle cx="44" cy="48" r="4" fill="white"/>
            </g>
            <circle cx="160" cy="50" r="22" fill="#2A9F50"/>
            <path d="M150 50 L157 57 L170 44" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="35" y="35" fontSize="18" fill="#E8538A">✦</text>
            <text x="160" y="120" fontSize="14" fill="#E8538A">✦</text>
            <text x="20" y="100" fontSize="12" fill="#F7B8D3">✦</text>
          </svg>
        </div>

        <h1 className="success-h1">Tu pago ha sido exitoso</h1>
        <p className="success-text">
          Gracias por tu compra, esperamos que vuelvas muy pronto ✦
        </p>

        <div className="success-actions">
          <button className="btn-dark" onClick={() => setCurrentPage('catalog')}>
            Continuar comprando
          </button>
          <button className="btn-outline" onClick={() => setCurrentPage('orders')}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    </main>
  );
}
