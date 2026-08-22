import logo from '../assets/logo.png';

export type TabId = 'library' | 'settings';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  serverOnline: boolean | null;
}

const ICONS: Record<TabId, JSX.Element> = {
  library: (
    <svg viewBox="0 0 18 18">
      <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="10" y="2.5" width="5.5" height="5.5" rx="1" />
      <rect x="2.5" y="10" width="5.5" height="5.5" rx="1" />
      <rect x="10" y="10" width="5.5" height="5.5" rx="1" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 18 18">
      <line x1="3" y1="5" x2="15" y2="5" />
      <circle cx="11" cy="5" r="1.8" />
      <line x1="3" y1="9" x2="15" y2="9" />
      <circle cx="7" cy="9" r="1.8" />
      <line x1="3" y1="13" x2="15" y2="13" />
      <circle cx="12" cy="13" r="1.8" />
    </svg>
  )
};

const ITEMS: { id: TabId; label: string }[] = [
  { id: 'library', label: 'Библиотека' },
  { id: 'settings', label: 'Настройки' }
];

export function Sidebar({ active, onChange, serverOnline }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img className="sidebar-brand-icon" src={logo} alt="" />
          <span className="sidebar-brand-name">
            CURSOR
            <span>FORGE</span>
          </span>
        </div>

        <div className="sidebar-items">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              <span className="sidebar-icon">{ICONS[item.id]}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <span className={`sync-dot ${serverOnline ? 'online' : serverOnline === false ? 'offline' : ''}`} />
        <div>
          <div className="sync-label">{serverOnline === null ? 'Проверка связи…' : serverOnline ? 'Сервер скинов онлайн' : 'Сервер недоступен'}</div>
        </div>
      </div>
    </nav>
  );
}
