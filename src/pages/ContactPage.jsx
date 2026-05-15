import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import './ContactPage.css';

export default function ContactPage() {
  const { setCurrentPage, user, profile, speak } = useApp();
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    email: profile?.email || '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    setLoading(true);

    if (isSupabaseEnabled()) {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user?.id || null,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        });
      if (dbError) {
        setError('Error al enviar el mensaje. Intenta de nuevo.');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccess(true);
    setForm({ name: profile?.full_name || '', email: profile?.email || '', subject: '', message: '' });
  };

  return (
    <main className="contact-page page-container fade-in" aria-label="Contáctanos">
      <button className="back-btn" onClick={() => setCurrentPage('catalog')}>← Volver</button>

      <h1 className="contact-title">
        CONTÁCTANOS
        <button
          className="audio-inline-btn"
          onClick={() => speak('Página de contacto DayGlow. Puedes escribirnos por email, llamarnos o enviarnos un mensaje desde el formulario.')}
          aria-label="Escuchar instrucciones"
        >🔊</button>
      </h1>

      <p className="contact-intro">
        ¿Tienes preguntas, sugerencias o algún reclamo? Estamos aquí para ayudarte o escucharte. 
      </p>

      <div className="contact-grid">
        {/* Información de contacto */}
        <section className="contact-info card" aria-label="Información de contacto">
          <h2 className="info-title">Información de contacto</h2>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true"></span>
            <div>
              <p className="info-label">Email</p>
              <a href="email:dayglow@gmail.com" className="info-value">dayglow@gmail.com</a>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true"></span>
            <div>
              <p className="info-label">Teléfono</p>
              <a href="tel:+5712345678" className="info-value">+57 (1) 234 5678</a>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true"></span>
            <div>
              <p className="info-label">WhatsApp</p>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="info-value">+57 300 123 4567</a>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true"></span>
            <div>
              <p className="info-label">Dirección</p>
              <p className="info-value">Ibagué, Tolima, Colombia</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true"></span>
            <div>
              <p className="info-label">Horario de atención</p>
              <p className="info-value">Lun - Vie: 9:00 AM - 6:00 PM<br />Sáb: 9:00 AM - 1:00 PM</p>
            </div>
          </div>

          <div className="social-section">
            <p className="social-title">Síguenos en redes</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="TikTok">🎵</a>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section className="contact-form-wrap card" aria-label="Formulario de contacto">
          <h2 className="info-title">Envíanos un mensaje</h2>

          {success && (
            <div className="form-success fade-in" role="status">
               ¡Tu mensaje fue enviado con éxito! Te responderemos pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <p className="required-note">
              Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
            </p>

            <div className="form-group">
              <label htmlFor="contact-name" className="field-label">
                Nombre <span className="required-asterisk">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                className="input-field"
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="field-label">
                Email <span className="required-asterisk">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                className="input-field"
                placeholder="ejemplo@correo.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject" className="field-label">
                Asunto
              </label>
              <input
                id="contact-subject"
                type="text"
                className="input-field"
                placeholder="¿Sobre qué quieres hablar?"
                value={form.subject}
                onChange={e => update('subject', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message" className="field-label">
                Mensaje <span className="required-asterisk">*</span>
              </label>
              <textarea
                id="contact-message"
                className="input-field"
                placeholder="Cuéntanos en qué podemos ayudarte..."
                rows="5"
                value={form.message}
                onChange={e => update('message', e.target.value)}
                required
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button type="submit" className="btn-primary contact-submit" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar mensaje'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}