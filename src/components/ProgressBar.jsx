export function ProgressBar({ value = 0, className = '' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <span className={'pb ' + className} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span className="pb__fill" style={{ width: v + '%' }} />
    </span>
  );
}
export default ProgressBar;
