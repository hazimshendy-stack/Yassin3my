import './Tooltip.module.css';

export function Tooltip({ label, children, side = 'top', className = '' }) {
  return (
    <span className={`tip tip--${side} ${className}`}>
      {children}
      <span role="tooltip" className="tip__bubble">
        {label}
      </span>
    </span>
  );
}

export default Tooltip;
