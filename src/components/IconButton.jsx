import { forwardRef } from 'react';
import './IconButton.module.css';

export const IconButton = forwardRef(function IconButton(
  { size = 'md', variant = 'ghost', className = '', label, children, ...rest },
  ref
) {
  const classes = [
    'icon-btn',
    `icon-btn--${size}`,
    `icon-btn--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-label={label}
      {...rest}
    >
      {children}
    </button>
  );
});

export default IconButton;
