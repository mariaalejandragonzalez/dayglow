import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import './Auth.css';

export default function ResetPasswordPage() {
  const { setCurrentPage, speak } = useApp();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirm) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!isSupabaseEnabled()) {
      setError('Esta función solo está disponible con Supabase configurado.');
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (dbError) {
      setError(dbError.message || 'Error al actualizar la contraseña.');
      return;
    }
    setSuccess(true);

    // Limpiar URL y redirigir al login después de 3 segundos
    setTimeout(() => {
      window.history.replaceState({}, document.title, '/');
      setCurrentPage('login');
    }, 3000);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in" style={{textAlign: 'center'}}>
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="success-title">¡Contraseña actualizada!</p>
          <p className="success-msg">
            Tu contraseña se cambió con éxito.<br />
            Redirigiendo al inicio de sesión…
          </p>
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
        </div>

        <div className="auth-divider" />

        <h2 className="auth-title">Nueva contraseña</h2>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '1.25rem'
        }}>
          Escribe tu nueva contraseña. Recuerda que debe tener al menos 6 caracteres.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <p className="required-note">
            Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
          </p>

          <div className="form-group">
            <label htmlFor="new-password" className="field-label">
              Nueva contraseña <span className="required-asterisk">*</span>
            </label>
            <input
              id="new-password"
              type="password"
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="field-label">
              Confirmar contraseña <span className="required-asterisk">*</span>
            </label>
            <input
              id="confirm-password"
              type="password"
              className="input-field"
              placeholder="Repite la nueva contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Actualizando…' : 'Cambiar contraseña'}
          </button>
        </form>

        <button
          className="audio-label-btn"
          onClick={() => speak('Página de cambio de contraseña. Escribe tu nueva contraseña dos veces para confirmar.')}
        >
          🔊 Escuchar instrucciones
        </button>
      </div>
    </div>
  );
}