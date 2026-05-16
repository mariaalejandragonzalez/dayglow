import { useApp } from '../context/AppContext';
import './KitsPage.css';

export default function KitsPage() {
  const { kits, speak, setCurrentPage } = useApp();

  const handleViewKit = (kit) => {
    sessionStorage.setItem('selectedKitId', kit.id);
    setCurrentPage('kit-detail');
  };

  return (
    <main className="kits-page page-container fade-in" aria-label="Kits estilo de vida">
      <h1 className="kits-title">
        KITS ESTILO DE VIDA
        <button
          className="audio-inline-btn"
          onClick={() => speak('Kits estilo de vida. Encuentra el kit perfecto para ti.')}
          aria-label="Escuchar título"
        >🔊</button>
      </h1>

      <div className="kits-grid">
        {kits.map(kit => (
          <article key={kit.id} className="kit-card card slide-up">
            <h2 className="kit-name">{kit.name}</h2>
            <div className="kit-img-wrap" onClick={() => handleViewKit(kit)} style={{cursor: 'pointer'}}>
              {kit.image_url ? (
                <img src={kit.image_url} alt={kit.name} />
              ) : (
                <div className="kit-placeholder">{kit.name}</div>
              )}
            </div>
            <p className="kit-desc">{kit.description}</p>
            <p className="kit-price">${kit.price.toLocaleString('es-CO')}</p>
            <ul className="kit-includes" aria-label={`Incluye: ${kit.includes?.join(', ')}`}>
              {kit.includes?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button className="btn-primary kit-btn" onClick={() => handleViewKit(kit)}>
              Ver más
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}