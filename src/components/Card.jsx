import './Card.module.css';

export function Card({
  as: Tag = 'div',
  interactive = false,
  padded = true,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'card',
    interactive ? 'card--interactive' : '',
    padded ? 'card--padded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`card__header ${className}`}>
      <div className="card__heading">
        {title ? <h3 className="card__title">{title}</h3> : null}
        {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="card__action">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className = '', children }) {
  return <div className={`card__body ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}

export default Card;
