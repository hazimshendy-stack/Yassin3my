export function Card({ as: Tag = 'div', interactive, className = '', children, ...rest }) {
  const cls = ['card', interactive ? 'card--hover' : '', className].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
export default Card;
