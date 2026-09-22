import './EmptyState.module.css';

export function EmptyState({ icon = null, title, description, action = null, className = '' }) {
  return (
    <div className={['empty', className].filter(Boolean).join(' ')} role="status">
      {icon ? <div className="empty__icon">{icon}</div> : null}
      <h4 className="empty__title">{title}</h4>
      {description ? <p className="empty__desc">{description}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
