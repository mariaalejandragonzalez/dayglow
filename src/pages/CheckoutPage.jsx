import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Checkout.css';

export default function CheckoutPage() {
  const { setCurrentPage, cartTotal, cart, profile, orderInfo, setOrderInfo, speak } = useApp();
  const [form, setForm] = useState({
    name: orderInfo.contact?.name || profile?.full_name || '',
    phone: orderInfo.contact?.phone || profile?.phone || '',
    city: orderInfo.address?.city || profile?.city || 'Ibagué',
    address: orderInfo.address?.address || '',
    notes: orderInfo.address?.notes || '',
  });
  const [error, setError] = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    setOrderInfo({
      ...orderInfo,
      contact: { name: form.name, phone: form.phone },
      address: { city: form.city, address: form.address, notes: form.notes },
    });
    setCurrentPage('payment');
  };

  const taxIncluded = cartTotal - (cartTotal / 1.19);

  return (
    <main className="checkout-page page-container fade-in" aria-label="Datos de entrega">
      <button className="back-btn" onClick={() => setCurrentPage('cart')}>← Volver</button>

      <h1 className="checkout-title">
        Datos de entrega
        <button
          className="audio-inline-btn"
          onClick={() => speak('Datos de entrega. Completa tu información de contacto y dirección.')}
          aria-label="Escuchar instrucciones"
        >🔊</button>
      </h1>

      <form onSubmit={handleNext} className="checkout-form" noValidate>
        <p className="required-note">
          Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
        </p>

        <section className="checkout-section">
          <h2 className="section-h2">Información de contacto</h2>

          <div className="form-group">
            <label htmlFor="ch-name" className="field-label">
              Nombre <span className="required-asterisk">*</span>
            </label>
            <input
              id="ch-name"
              type="text"
              className="input-field"
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ch-phone" className="field-label">
              Teléfono de contacto <span className="required-asterisk">*</span>
            </label>
            <input
              id="ch-phone"
              type="tel"
              className="input-field"
              placeholder="300 123 4567"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              required
            />
          </div>
        </section>

        <section className="checkout-section">
          <h2 className="section-h2">Dirección de entrega</h2>

          <div className="form-group">
            <label htmlFor="ch-city" className="field-label">
              Ciudad <span className="required-asterisk">*</span>
            </label>
            <input
              id="ch-city"
              type="text"
              className="input-field"
              placeholder="Ej: Ibagué"
              value={form.city}
              onChange={e => update('city', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ch-address" className="field-label">
              Dirección <span className="required-asterisk">*</span>
            </label>
            <input
              id="ch-address"
              type="text"
              className="input-field"
              placeholder="Calle, número, apartamento…"
              value={form.address}
              onChange={e => update('address', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ch-notes" className="field-label">
              Instrucciones adicionales
            </label>
            <textarea
              id="ch-notes"
              className="input-field"
              placeholder="Ej: dejar en portería, llamar al llegar…"
              rows="3"
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
            />
          </div>
        </section>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="checkout-summary card">
          <div className="cart-line">
            <span>Subtotal ({cart.length})</span>
            <strong>${cartTotal.toLocaleString('es-CO')}</strong>
          </div>
          <div className="cart-line">
            <span>Total de envío</span>
            <strong className="free-tag">Gratis</strong>
          </div>
          <div className="cart-line">
            <span>IVA incluido</span>
            <strong>${taxIncluded.toLocaleString('es-CO', {maximumFractionDigits: 2})}</strong>
          </div>
          <div className="cart-line cart-total">
            <span>Total</span>
            <strong>${cartTotal.toLocaleString('es-CO')}</strong>
          </div>
        </div>

        <button type="submit" className="btn-dark">Continuar al pago</button>
      </form>
    </main>
  );
}