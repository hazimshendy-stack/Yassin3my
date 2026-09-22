import './Tabs.module.css';

export function Tabs({ tabs = [], value, onChange, className = '' }) {
  return (
    <div role="tablist" className={['tabs', className].filter(Boolean).join(' ')}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            className={`tabs__tab ${active ? 'is-active' : ''}`}
            onClick={() => onChange?.(t.value)}
          >
            {t.icon ? <span className="tabs__icon">{t.icon}</span> : null}
            <span>{t.label}</span>
            {typeof t.count === 'number' ? <span className="tabs__count">{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
