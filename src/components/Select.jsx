import { forwardRef, useId } from 'react';
import './Field.module.css';

export const Select = forwardRef(function Select(
  { label, hint, error, id, options = [], className = '', children, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || `sel-${autoId}`;
  const describedBy = [hint ? `${inputId}-hint` : null, error ? `${inputId}-err` : null]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={['field', className].filter(Boolean).join(' ')}>
      {label ? (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className={`field__control ${error ? 'has-error' : ''}`}>
        <select
          ref={ref}
          id={inputId}
          className="field__input field__input--select"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        >
          {children}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hint && !error ? (
        <p className="field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={`${inputId}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
