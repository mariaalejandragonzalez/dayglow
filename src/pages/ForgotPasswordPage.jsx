import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import './Auth.css';

export default function ForgotPasswordPage() {
  const { setCurrentPage, speak } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Por favor escribe tu correo electrónico.');
      return;
    }

    if (!isSupabaseEnabled()) {
      setError('Esta función solo está disponible con Supabase configurado.');
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?reset=true`,
    });
    setLoading(false);

    if (dbError) {
      setError(dbError.message || 'Error al enviar el correo. Intenta de nuevo.');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in" style={{textAlign: 'center'}}>
          <h2 className="auth-title" style={{marginBottom: '1.5rem'}}>
            Correo enviado
          </h2>
          <div className="auth-divider" style={{margin: '0 -2rem 1.5rem'}} />
          <div className="success-icon" aria-hidden="true">📧</div>
          <p className="success-title">¡Revisa tu bandeja de entrada!</p>
          <p className="success-msg">
            Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contraseña.
            <br /><br />
            <small style={{color: 'var(--text-muted)'}}>
              ¿No lo ves? Revisa tu carpeta de spam o correo no deseado.
            </small>
          </p>
          <button
            className="btn-primary"
            style={{width: '100%'}}
            onClick={() => setCurrentPage('login')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <span className="logo-diamond">✦</span>
          <h1 className="brand-name">DAYGLOW</h1>
          <p className="brand-tagline">belleza y cuidado para tu día a día</p>
        </div>

        <div className="auth-divider" />

        <h2 className="auth-title">¿Olvidaste tu contraseña?</h2>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '1.25rem',
          lineHeight: 1.5
        }}>
           Escribe tu correo y se enviara un enlace para restablecerla.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <p className="required-note">
            Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
          </p>

          <div className="form-group">
            <label htmlFor="forgot-email" className="field-label">
              Correo electrónico <span className="required-asterisk">*</span>
            </label>
            <input
              id="forgot-email"
              type="email"
              className="input-field"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Recordaste tu contraseña?{' '}
          <button className="link-btn" onClick={() => setCurrentPage('login')}>Inicia sesión</button>
        </p>

        <button
          className="audio-label-btn"
          onClick={() => speak('Página de recuperación de contraseña. Escribe tu correo y te enviaremos un enlace para restablecerla.')}
        >
          🔊 Escuchar instrucciones
        </button>
      </div>
    </div>
  );
}