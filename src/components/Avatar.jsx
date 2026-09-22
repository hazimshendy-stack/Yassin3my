import { initials } from '../lib/format.js';
import './Avatar.module.css';

export function Avatar({ src, name = '', size = 40, className = '' }) {
  const style = { width: size, height: size, fontSize: Math.max(11, size * 0.36) };
  return (
    <span className={['avatar', className].filter(Boolean).join(' ')} style={style}>
      {src ? <img src={src} alt={name} loading="lazy" /> : <span aria-hidden="true">{initials(name)}</span>}
      {name ? <span className="sr-only">{name}</span> : null}
    </span>
  );
}

export default Avatar;
