import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function LoginPage() {
  const { setCurrentPage, login, speak, isSupabaseEnabled } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (!res.success) setError(res.message || 'Error al iniciar sesión.');
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <span className="logo-diamond">✦</span>
          <h1 className="brand-name">DAYGLOW</h1>
          <p className="brand-tagline">belleza y cuidado para tu día a día</p>
        </div>

        <div className="auth-divider" />

        <h2 className="auth-title">Iniciar Sesión</h2>

        {!isSupabaseEnabled && (
          <div className="demo-banner" role="status">
            🌐 Modo demo activo. Configura Supabase en <code>.env</code> para conexión real.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <p className="required-note">
            Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
          </p>

          <div className="form-group">
            <label htmlFor="login-email" className="field-label">
              Correo electrónico <span className="required-asterisk">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="field-label">
              Contraseña <span className="required-asterisk">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="Tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button
            type="button"
            className="forgot-link"
            onClick={() => setCurrentPage('forgot-password')}
          >
            ¿Olvidaste la contraseña?
          </button>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes una cuenta?{' '}
          <button className="link-btn" onClick={() => setCurrentPage('register')}>Regístrate ya</button>
        </p>

        <button
          className="audio-label-btn"
          onClick={() => speak('Página de inicio de sesión DayGlow. Ingresa tu correo y contraseña para acceder.')}
        >
          🔊 Escuchar instrucciones
        </button>
      </div>
    </div>
  );
}