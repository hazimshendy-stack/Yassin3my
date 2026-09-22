import './Badge.module.css';

export function Badge({ tone = 'neutral', size = 'md', className = '', children, ...rest }) {
  const classes = ['badge', `badge--${tone}`, `badge--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
