import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from './Spinner.jsx';
import './Button.module.css';

/**
 * Button — variants: primary | ghost | outline | danger (rendered as green-dim)
 * sizes: sm | md | lg
 */
export const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    className = '',
    type = 'button',
    children,
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? <Spinner size={size === 'sm' ? 14 : 16} className="btn__spinner" /> : leftIcon}
      <span className="btn__label">{children}</span>
      {!loading && rightIcon ? <span className="btn__right">{rightIcon}</span> : null}
    </>
  );

  const shared = {
    ref,
    className: classes,
    disabled: disabled || loading,
    'aria-busy': loading || undefined,
    ...rest,
  };

  if (to) {
    return (
      <Link to={to} {...shared}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} {...shared}>
        {content}
      </a>
    );
  }
  if (as) {
    const Tag = as;
    return (
      <Tag type={Tag === 'button' ? type : undefined} {...shared}>
        {content}
      </Tag>
    );
  }
  return (
    <button type={type} {...shared}>
      {content}
    </button>
  );
});

export default Button;
