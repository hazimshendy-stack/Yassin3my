export function Skeleton({ width = '100%', height = 14, radius = 6, className = '', style }) {
  return <span aria-hidden className={'skl ' + className} style={{ width, height, borderRadius: radius, ...(style || {}) }} />;
}
export default Skeleton;
