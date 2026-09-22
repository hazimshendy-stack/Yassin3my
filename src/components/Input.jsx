import { forwardRef, useId } from 'react';
import './Field.module.css';

export const Input = forwardRef(function Input(
  { label, hint, error, leading = null, trailing = null, id, className = '', ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || `in-${autoId}`;
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
        {leading ? <span className="field__lead">{leading}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className="field__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
        {trailing ? <span className="field__trail">{trailing}</span> : null}
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

export default Input;
