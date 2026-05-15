import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as db from '../lib/db';
import StarRating from './StarRating';
import './ProductReviews.css';

export default function ProductReviews({ productId }) {
  const { user, profile, speak } = useApp();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(true);

  // Cargar reseñas al montar
  const loadData = async () => {
    setReloading(true);
    const { data: reviewData } = await db.getReviews(productId);
    setReviews(reviewData);

    if (user?.id) {
      const purchased = await db.hasUserPurchased(user.id, productId);
      setHasPurchased(purchased);

      const { data: userR } = await db.getUserReview(user.id, productId);
      if (userR) {
        setUserReview(userR);
        setRating(userR.rating);
        setComment(userR.comment || '');
      }
    }
    setReloading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user?.id]);

  // Calcular promedio
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating === 0) {
      setError('Por favor selecciona una calificación.');
      return;
    }
    setLoading(true);

    let result;
    if (userReview) {
      result = await db.updateReview(userReview.id, rating, comment);
    } else {
      result = await db.createReview(
        user.id,
        profile?.full_name || user.email,
        productId,
        rating,
        comment
      );
    }
    setLoading(false);

    if (result.error) {
      setError('Error al guardar tu reseña. Intenta de nuevo.');
      return;
    }
    setShowForm(false);
    await loadData();
  };

  const handleDelete = async () => {
    if (!userReview) return;
    if (!window.confirm('¿Estás segura de eliminar tu reseña?')) return;
    await db.deleteReview(userReview.id);
    setUserReview(null);
    setRating(0);
    setComment('');
    setShowForm(false);
    await loadData();
  };

  if (reloading) {
    return <div className="reviews-loading">Cargando reseñas…</div>;
  }

  return (
    <section className="product-reviews" aria-label="Reseñas del producto">
      <div className="reviews-header">
        <h2 className="reviews-title">
          Reseñas
          <button
            className="audio-inline-btn"
            onClick={() => speak(`Este producto tiene ${reviews.length} reseñas con un promedio de ${avgRating.toFixed(1)} estrellas de 5.`)}
            aria-label="Escuchar resumen de reseñas"
          >🔊</button>
        </h2>

        {reviews.length > 0 ? (
          <div className="reviews-summary">
            <StarRating rating={avgRating} readOnly size="md" />
            <span className="rating-avg">{avgRating.toFixed(1)}</span>
            <span className="rating-count">({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})</span>
          </div>
        ) : (
          <p className="no-reviews">Aún no hay reseñas. ¡Sé la primera en opinar!</p>
        )}
      </div>

      {/* Botón para reseñar */}
      {user && hasPurchased && !showForm && (
        <button
          className="btn-primary review-cta"
          onClick={() => setShowForm(true)}
        >
          {userReview ? '✏️ Editar mi reseña' : '⭐ Escribir reseña'}
        </button>
      )}

      {user && !hasPurchased && (
        <p className="purchase-required">
          💡 Solo los usuarios que han comprado este producto pueden reseñarlo.
        </p>
      )}

      {!user && (
        <p className="purchase-required">
          💡 Inicia sesión y compra este producto para poder reseñarlo.
        </p>
      )}

      {/* Formulario */}
      {showForm && (
        <form className="review-form card fade-in" onSubmit={handleSubmit}>
          <h3 className="form-title">
            {userReview ? 'Editar tu reseña' : 'Comparte tu opinión'}
          </h3>

          <div className="form-group">
            <label className="field-label">
              Tu calificación <span className="required-asterisk">*</span>
            </label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="rating-label">
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="review-comment" className="field-label">
              Tu comentario
            </label>
            <textarea
              id="review-comment"
              className="input-field"
              placeholder="¿Qué te pareció el producto? Comparte tu experiencia…"
              rows="4"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength="500"
            />
            <p className="char-count">{comment.length} / 500</p>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando…' : userReview ? 'Actualizar' : 'Publicar reseña'}
            </button>
          </div>

          {userReview && (
            <button
              type="button"
              className="btn-delete-review"
              onClick={handleDelete}
            >
              🗑️ Eliminar mi reseña
            </button>
          )}
        </form>
      )}

      {/* Lista de reseñas */}
      {reviews.length > 0 && (
        <ul className="reviews-list" aria-label="Lista de reseñas">
          {reviews.map(r => (
            <li key={r.id} className="review-item card">
              <div className="review-head">
                <div className="review-author">
                  <div className="avatar" aria-hidden="true">
                    {r.user_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="author-name">{r.user_name || 'Usuario'}</p>
                    <p className="review-date">
                      {new Date(r.created_at).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={r.rating} readOnly size="sm" />
              </div>
              {r.comment && <p className="review-comment">{r.comment}</p>}
              {userReview?.id === r.id && (
                <span className="own-review-tag">Tu reseña</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}