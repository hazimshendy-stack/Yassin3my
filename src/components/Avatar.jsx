import { initials } from '../lib/format.js';
export function Avatar({ src, name = '', size = 40, className = '' }) {
  return (
    <span className={'avatar ' + className} style={{ width: size, height: size, fontSize: Math.max(11, size * 0.35) }}>
      {src ? <img src={src} alt={name} /> : <span>{initials(name)}</span>}
    </span>
  );
}
export default Avatar;
