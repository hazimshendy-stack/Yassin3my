export function Chip({ active, className = '', children, ...rest }) {
  return <button type="button" className={'chip' + (active ? ' chip--on' : '') + ' ' + className} {...rest}>{children}</button>;
}
export default Chip;
