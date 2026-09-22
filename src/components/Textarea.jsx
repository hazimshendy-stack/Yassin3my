import { forwardRef, useId } from 'react';
import './Field.module.css';

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, id, rows = 4, className = '', ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || `ta-${autoId}`;
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
      <div className={`field__control field__control--multiline ${error ? 'has-error' : ''}`}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className="field__input field__input--area"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
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

export default Textarea;
