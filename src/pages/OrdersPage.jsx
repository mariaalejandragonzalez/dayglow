import { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as db from '../lib/db';
import './OrdersPage.css';

export default function OrdersPage() {
  const { orders, setCurrentPage, user, speak } = useApp();
  const [issueItem, setIssueItem] = useState(null);
  const [description, setDescription] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const handleSubmitIssue = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    await db.reportIssue(user?.id, issueItem?.id, description);
    setSubmitting(false);
    setConfirmed(true);
    setDescription('');
  };

  const closeIssueModal = () => {
    setIssueItem(null);
    setConfirmed(false);
    setDescription('');
  };

  if (orders.length === 0) {
    return (
      <main className="orders-page page-container fade-in">
        <button className="back-btn" onClick={() => setCurrentPage('profile')}>← Volver</button>
        <h1 className="orders-title">Mis pedidos</h1>
        <div className="empty-orders">
          <span aria-hidden="true">📦</span>
          <p>Aún no has realizado pedidos.</p>
          <button className="btn-primary" onClick={() => setCurrentPage('catalog')}>
            Explorar productos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page page-container fade-in" aria-label="Mis pedidos">
      <button className="back-btn" onClick={() => setCurrentPage('profile')}>← Volver</button>
      <h1 className="orders-title">
        Mis pedidos
        <button
          className="audio-inline-btn"
          onClick={() => speak(`Tienes ${orders.length} pedidos en tu historial.`)}
          aria-label="Escuchar resumen"
        >🔊</button>
      </h1>

      <div className="orders-list">
        {orders.map(order => (
          <article className="order-card card slide-up" key={order.id}>
            <div className="order-header">
              <span className="order-status">
                {order.status || 'Entregado'} el {formatDate(order.created_at)}
              </span>
              <span className="order-total">${order.total?.toLocaleString('es-CO')}</span>
            </div>

            {(order.order_items || []).map((item, i) => (
              <div className="order-item" key={i}>
                <div className="order-item-img">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} />
                  ) : (
                    <div className="order-img-fallback">{item.product_name?.[0]}</div>
                  )}
                </div>
                <div className="order-item-info">
                  <h3>{item.product_name}</h3>
                  <p>Descripción: color {item.color}</p>
                  <p>Cantidad: {item.quantity}</p>
                </div>
                <div className="order-item-price">
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </div>
                <button
                  className="btn-soft order-issue-btn"
                  onClick={() => setIssueItem(item)}
                >
                  Problema con el producto
                </button>
              </div>
            ))}
          </article>
        ))}
      </div>

      {/* Issue modal */}
      {issueItem && (
        <div className="modal-overlay" onClick={closeIssueModal} role="dialog" aria-modal="true">
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeIssueModal} aria-label="Cerrar">✕</button>
            <h2 className="modal-title">¿PROBLEMAS CON EL PRODUCTO?</h2>

            {!confirmed ? (
              <>
                <p className="modal-desc">
                  Si tuviste un problema con algún producto, especifícanos por favor qué tipo de problema tuviste y envíanos evidencia de ello.
                </p>
                <textarea
                  className="input-field"
                  rows="6"
                  placeholder="Describe tu problema aquí…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  aria-label="Descripción del problema"
                />
                <button
                  className="btn-primary"
                  style={{width:'100%', marginTop:'1rem'}}
                  onClick={handleSubmitIssue}
                  disabled={submitting || !description.trim()}
                >
                  {submitting ? 'Enviando…' : 'Confirmar'}
                </button>
              </>
            ) : (
              <div className="confirm-msg">
                <p>
                  Lamentamos que hayas tenido inconvenientes, sabremos cómo ayudarte y mejorar.
                  Debido al inconveniente te regalamos 10% de descuento en cualquier producto.
                </p>
                <button className="btn-primary" style={{width:'100%', marginTop:'1rem'}} onClick={closeIssueModal}>
                  Volver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
