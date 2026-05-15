import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function RegisterPage() {
  const { setCurrentPage, register, speak, isSupabaseEnabled } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Completa todos los campos.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!terms || !privacy) {
      setError('Debes aceptar los términos y la política de privacidad.');
      return;
    }
    setLoading(true);
    const res = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      city: 'Ibagué',
    });
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Error al registrar.');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in" style={{textAlign: 'center'}}>
          <h2 className="auth-title" style={{marginBottom: '1.5rem'}}>Registro</h2>
          <div className="auth-divider" style={{margin: '0 -2rem 1.5rem'}} />
          <div className="success-icon" aria-hidden="true">ℹ</div>
          <p className="success-title">Registro exitoso</p>
          <p className="success-msg">
            La cuenta se ha creado con éxito.
            {isSupabaseEnabled && <><br />Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.</>}
          </p>
          <button
            className="btn-primary"
            style={{width: '100%'}}
            onClick={() => setCurrentPage('login')}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  // Definición de campos (más fácil de mantener)
  const fields = [
    { id: 'reg-name',    key: 'name',     label: 'Nombre',                placeholder: 'Tu nombre completo',  type: 'text',     autocomplete: 'name' },
    { id: 'reg-email',   key: 'email',    label: 'Email',                 placeholder: 'ejemplo@correo.com',  type: 'email',    autocomplete: 'email' },
    { id: 'reg-phone',   key: 'phone',    label: 'Celular',               placeholder: '300 123 4567',        type: 'tel',      autocomplete: 'tel' },
    { id: 'reg-pass',    key: 'password', label: 'Contraseña',            placeholder: 'Mínimo 6 caracteres', type: 'password', autocomplete: 'new-password' },
    { id: 'reg-confirm', key: 'confirm',  label: 'Confirmar contraseña',  placeholder: 'Repite la contraseña',type: 'password', autocomplete: 'new-password' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h2 className="auth-title" style={{fontSize: '1.3rem'}}>Registro</h2>
        <div className="auth-divider" style={{margin: '0 -2rem 1.25rem'}} />

        {!isSupabaseEnabled && (
          <div className="demo-banner" role="status">
            🌐 Modo demo activo. Tus datos se guardarán solo en esta sesión.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <p className="required-note">
            Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
          </p>

          {fields.map(f => (
            <div className="form-group" key={f.key}>
              <label htmlFor={f.id} className="field-label">
                {f.label} <span className="required-asterisk">*</span>
              </label>
              <input
                id={f.id}
                type={f.type}
                className="input-field"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => update(f.key, e.target.value)}
                autoComplete={f.autocomplete}
                required
              />
            </div>
          ))}

          {error && <p className="form-error" role="alert">{error}</p>}

          <label className="form-check">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} required />
            <span>
              Acepto los{' '}
              <button type="button" className="link-btn" style={{fontSize:'inherit'}} onClick={() => speak('Términos y condiciones de uso de DayGlow.')}>
                términos y condiciones de uso
              </button>
              {' '}<span className="required-asterisk">*</span>
            </span>
          </label>
          <label className="form-check">
            <input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} required />
            <span>
              Autorizo el tratamiento de mis datos personales conforme a la{' '}
              <button type="button" className="link-btn" style={{fontSize:'inherit'}} onClick={() => speak('Política de privacidad de DayGlow.')}>
                Política de Privacidad
              </button>
              {' '}<span className="required-asterisk">*</span>
            </span>
          </label>

          <button type="submit" className="btn-primary auth-submit" style={{marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Registrando…' : 'Registrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{' '}
          <button className="link-btn" onClick={() => setCurrentPage('login')}>Inicia sesión</button>
        </p>

        <button
          className="audio-label-btn"
          onClick={() => speak('Formulario de registro. Completa nombre, email, celular, contraseña y acepta los términos para crear tu cuenta.')}
        >
          🔊 Escuchar instrucciones
        </button>
      </div>
    </div>
  );
}