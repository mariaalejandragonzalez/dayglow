import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Checkout.css';

export default function PaymentPage() {
  const { setCurrentPage, cartTotal, cart, orderInfo, setOrderInfo, placeOrder, speak } = useApp();
  const [method, setMethod] = useState(orderInfo.payment?.method || 'tarjeta');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateCard = (k, v) => setCardForm(p => ({ ...p, [k]: v }));

  const taxIncluded = cartTotal - (cartTotal / 1.19);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    if (method === 'tarjeta') {
      if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) {
        setError('Completa los datos de la tarjeta.');
        return;
      }
    }
    setLoading(true);
    setOrderInfo({ ...orderInfo, payment: { method, card: cardForm } });
    const res = await placeOrder();
    setLoading(false);
    if (res.success) setCurrentPage('order-success');
    else setError(res.message || 'Error al procesar el pedido.');
  };

  return (
    <main className="payment-page page-container fade-in" aria-label="Método de pago">
      <button className="back-btn" onClick={() => setCurrentPage('checkout')}>← Volver</button>

      <h1 className="payment-title">
        Método de pago
        <button
          className="audio-inline-btn"
          onClick={() => speak('Selecciona tu método de pago: tarjeta, Addi o PSE.')}
          aria-label="Escuchar instrucciones"
        >🔊</button>
      </h1>

      <form onSubmit={handleConfirm} noValidate>
        <p className="required-note">
          Los campos marcados con <span className="required-asterisk">*</span> son obligatorios
        </p>

        <h2 className="section-h2-subtle">
          Selecciona método de pago <span className="required-asterisk">*</span>
        </h2>
        <div className="payment-methods" role="radiogroup" aria-label="Métodos de pago">
          {[
            { id: 'tarjeta', label: 'Tarjeta', iconClass: 'icon-card', iconText: 'CARD' },
            { id: 'addi', label: 'Addi', iconClass: 'icon-addi', iconText: 'A' },
            { id: 'pse', label: 'PSE', iconClass: 'icon-pse', iconText: 'PSE' },
          ].map(m => (
            <label key={m.id} className={`payment-method ${method === m.id ? 'selected' : ''}`}>
              <span className={`payment-icon ${m.iconClass}`} aria-hidden="true">{m.iconText}</span>
              <span className="payment-method-label">{m.label}</span>
              <input
                type="radio"
                name="payment"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                aria-label={m.label}
              />
            </label>
          ))}
        </div>

        {method === 'tarjeta' && (
          <div className="card-form fade-in">
            <div className="form-group">
              <label htmlFor="card-name" className="field-label">
                Nombre del titular <span className="required-asterisk">*</span>
              </label>
              <input
                id="card-name"
                type="text"
                className="input-field"
                placeholder="Como aparece en la tarjeta"
                value={cardForm.name}
                onChange={e => updateCard('name', e.target.value)}
                autoComplete="cc-name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="card-number" className="field-label">
                Número de la tarjeta <span className="required-asterisk">*</span>
              </label>
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                className="input-field"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                value={cardForm.number}
                onChange={e => updateCard('number', e.target.value.replace(/[^\d ]/g,''))}
                autoComplete="cc-number"
                required
              />
            </div>

            <div className="row">
              <div className="form-group">
                <label htmlFor="card-expiry" className="field-label">
                  Fecha vencimiento <span className="required-asterisk">*</span>
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  className="input-field"
                  placeholder="MM/AA"
                  maxLength="5"
                  value={cardForm.expiry}
                  onChange={e => updateCard('expiry', e.target.value)}
                  autoComplete="cc-exp"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv" className="field-label">
                  CVV <span className="required-asterisk">*</span>
                </label>
                <input
                  id="card-cvv"
                  type="text"
                  inputMode="numeric"
                  className="input-field"
                  placeholder="123"
                  maxLength="4"
                  value={cardForm.cvv}
                  onChange={e => updateCard('cvv', e.target.value.replace(/\D/g,''))}
                  autoComplete="cc-csc"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="checkout-summary card" style={{marginBottom: '1.25rem'}}>
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

        <button type="submit" className="btn-dark" disabled={loading}>
          {loading ? 'Procesando…' : 'Confirmar'}
        </button>
      </form>
    </main>
  );
}