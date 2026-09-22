import './Skeleton.module.css';

export function Skeleton({ width = '100%', height = 14, radius = 6, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius, ...(style || {}) }}
    />
  );
}

export default Skeleton;
