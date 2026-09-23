export function Tabs({ tabs = [], value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.value} role="tab" type="button" aria-selected={t.value === value}
          className={'tabs__tab' + (t.value === value ? ' tabs__tab--on' : '')}
          onClick={() => onChange && onChange(t.value)}>
          {t.label}
          {typeof t.count === 'number' ? <span className="tabs__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
export default Tabs;
