import { useApp } from '../context/AppContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { profile, user, setCurrentPage, speak } = useApp();

  const data = profile || {
    full_name: user?.email?.split('@')[0] || 'Usuario',
    email: user?.email || '',
    phone: '',
    department: 'Tolima',
  };

  return (
    <main className="profile-page fade-in" aria-label="Perfil de usuario">
      <div className="profile-hero">
        <button
          className="back-btn-light"
          onClick={() => setCurrentPage('catalog')}
          aria-label="Volver"
        >←</button>
        <h1 className="profile-title">
          Perfil
          <button
            className="audio-inline-btn-light"
            onClick={() => speak(`Perfil de ${data.full_name}. Email: ${data.email}.`)}
            aria-label="Escuchar perfil"
          >🔊</button>
        </h1>
        <button className="edit-btn" aria-label="Editar perfil" title="Editar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        <div className="profile-avatar">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
      </div>

      <div className="profile-info page-container">
        <ul className="profile-list">
          <li className="profile-item">
            <span className="profile-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="6" y="2" width="12" height="20" rx="2"/>
                <line x1="9" y1="6" x2="15" y2="6"/>
              </svg>
            </span>
            <div>
              <p className="profile-label">Nombre</p>
              <p className="profile-value">{data.full_name}</p>
            </div>
          </li>

          <li className="profile-item">
            <span className="profile-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
            </span>
            <div>
              <p className="profile-label">Mis pedidos</p>
              <button className="btn-soft" onClick={() => setCurrentPage('orders')} style={{padding:'0.3rem 0.85rem',fontSize:'0.8rem'}}>
                Ver más
              </button>
            </div>
          </li>

          <li className="profile-item">
            <span className="profile-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21h18M5 21V7l8-4 8 4v14M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
            </span>
            <div>
              <p className="profile-label">Departamento</p>
              <p className="profile-value">{data.department || 'Tolima'}</p>
            </div>
          </li>

          {data.phone && (
            <li className="profile-item">
              <span className="profile-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </span>
              <div>
                <p className="profile-label">Número</p>
                <p className="profile-value">{data.phone}</p>
              </div>
            </li>
          )}

          <li className="profile-item">
            <span className="profile-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <div>
              <p className="profile-label">E-Mail</p>
              <p className="profile-value">{data.email}</p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
