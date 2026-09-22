import './Spinner.module.css';

export function Spinner({ size = 18, className = '', label }) {
  return (
    <span
      role="status"
      aria-label={label || 'loading'}
      className={`spinner ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="spinner__circle" />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

export default Spinner;
