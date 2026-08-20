export type TabId = 'library' | 'editor' | 'animations' | 'characters' | 'collections' | 'mine' | 'favorites' | 'settings';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  serverOnline: boolean | null;
}

const ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: 'library', label: 'Библиотека', icon: '▤' },
  { id: 'editor', label: 'Редактор', icon: '✏' },
  { id: 'animations', label: 'Анимации', icon: '◐' },
  { id: 'characters', label: 'Персонажи', icon: '☺' },
  { id: 'collections', label: 'Коллекции', icon: '▦' },
  { id: 'mine', label: 'Мои курсоры', icon: '⬒' },
  { id: 'favorites', label: 'Избранное', icon: '★' },
  { id: 'settings', label: 'Настройки', icon: '⚙' }
];

export function Sidebar({ active, onChange, serverOnline }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">◆</span>
        <span className="sidebar-brand-name">CursorForge</span>
      </div>

      <div className="sidebar-items">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
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
