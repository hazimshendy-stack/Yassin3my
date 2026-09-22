import './Chip.module.css';

export function Chip({ active = false, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={['chip', active ? 'chip--active' : '', className].filter(Boolean).join(' ')}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Chip;
