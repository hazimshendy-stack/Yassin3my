import { Link } from 'react-router-dom';
export function Button({ to, href, variant = 'primary', size = 'md', block, className = '', children, ...rest }) {
  const cls = ['btn', 'btn--' + variant, 'btn--' + size, block ? 'btn--block' : '', className].filter(Boolean).join(' ');
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
export default Button;
