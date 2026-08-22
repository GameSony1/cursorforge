import { useEffect, useMemo, useState } from 'react';
import type { Skin } from '@cursor-customizer/shared';
import { buildCatalog, SECTION_LABELS, type CatalogItem, type CatalogSection } from '../lib/catalog';
import { CursorCard } from '../components/CursorCard';
import { InspectorPanel } from '../components/InspectorPanel';
import type { StatusMessage } from '../components/StatusToast';

const FAVORITES_KEY = 'cursorforge:favorites';
const SECTION_ORDER: CatalogSection[] = ['classic', 'colored', 'character', 'unique'];

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

interface Props {
  serverUrl: string;
  onStatus: (status: StatusMessage) => void;
  onServerOnlineChange: (online: boolean) => void;
  onOpenSettings: () => void;
}

export function LibraryPage({ serverUrl, onStatus, onServerOnlineChange, onOpenSettings }: Props) {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

  useEffect(() => {
    let cancelled = false;
    fetch(`${serverUrl}/api/skins`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Skin[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setSkins(data);
        setLoadError(false);
        onServerOnlineChange(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        onServerOnlineChange(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serverUrl]);

  const catalog = useMemo(() => buildCatalog(skins, serverUrl), [skins, serverUrl]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((item) => !q || item.name.toLowerCase().includes(q));
  }, [catalog, search]);

  const grouped = useMemo(() => {
    const map = new Map<CatalogSection, CatalogItem[]>();
    for (const item of visible) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return map;
  }, [visible]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const selectedItem = catalog.find((c) => c.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="library-layout">
      <div className="library-main">
        <div className="library-topbar">
          <h1 className="page-title">Библиотека курсоров</h1>
        </div>
        <p className="page-subtitle">Выбери курсор и настрой его в панели справа — изменения применяются ко всей системе Windows.</p>

        <div className="library-toolbar">
          <input
            className="text-input search-input"
            placeholder="Поиск курсоров…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select-input" disabled>
            <option>Все категории</option>
          </select>
          <select className="select-input" disabled>
            <option>Популярные</option>
          </select>
          <button className="ghost-btn" onClick={() => onStatus({ kind: 'info', text: 'Фильтры появятся позже' })}>
            ▾ Фильтры
          </button>
        </div>

        {loadError && (
          <p className="page-subtitle status-error-text">
            Не удалось загрузить каталог с сервера ({serverUrl}). Показаны только встроенные курсоры.
          </p>
        )}

        {visible.length === 0 && (
          <p className="page-subtitle" style={{ marginTop: 24 }}>
            Ничего не найдено.
          </p>
        )}

        {SECTION_ORDER.filter((section) => grouped.has(section)).map((section) => (
          <section key={section} className="cursor-section">
            <div className="cursor-section-head">
              <h3>{SECTION_LABELS[section]}</h3>
            </div>
            <div className="cursor-grid">
              {grouped.get(section)!.map((item) => (
                <CursorCard
                  key={item.id}
                  item={item}
                  selected={selectedItem?.id === item.id}
                  favorite={favorites.has(item.id)}
                  onSelect={() => setSelectedId(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <InspectorPanel
        item={selectedItem}
        favorite={selectedItem ? favorites.has(selectedItem.id) : false}
        onToggleFavorite={() => selectedItem && toggleFavorite(selectedItem.id)}
        onStatus={onStatus}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
