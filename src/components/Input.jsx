import { useId } from 'react';
export function Input({ label, hint, error, leading, id, className = '', ...rest }) {
  const aid = useId();
  const iid = id || 'in-' + aid;
  return (
    <label className={'field ' + className} htmlFor={iid}>
      {label ? <span className="field__label">{label}</span> : null}
      <span className={'field__wrap' + (error ? ' field__wrap--err' : '')}>
        {leading ? <span className="field__lead">{leading}</span> : null}
        <input id={iid} className="field__input" {...rest} />
      </span>
      {hint && !error ? <span className="field__hint">{hint}</span> : null}
      {error ? <span className="field__err">{error}</span> : null}
    </label>
  );
}
export default Input;
