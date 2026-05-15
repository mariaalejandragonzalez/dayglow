import './StarRating.css';

/**
 * Componente de estrellas reutilizable.
 * - readOnly = true: solo muestra (con medias estrellas si el promedio no es entero)
 * - readOnly = false: interactivo, el usuario puede clickear para elegir
 */
export default function StarRating({ rating = 0, onChange, readOnly = false, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating ${size} ${readOnly ? 'readonly' : 'interactive'}`} role={readOnly ? 'img' : 'radiogroup'} aria-label={`Calificación: ${rating} de 5 estrellas`}>
      {stars.map(star => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            className={`star ${filled ? 'filled' : half ? 'half' : 'empty'}`}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={readOnly}
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
            aria-pressed={!readOnly && rating === star}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}