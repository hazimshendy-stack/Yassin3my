import { Inbox } from 'lucide-react';
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty" role="status">
      <div className="empty__icon">{icon || <Inbox size={22} />}</div>
      <h3 className="empty__title">{title}</h3>
      {description ? <p className="empty__desc">{description}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
export default EmptyState;
