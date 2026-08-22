import { useEffect, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar, type TabId } from './components/Sidebar';
import { StatusToast, type StatusMessage } from './components/StatusToast';
import { UpdateBanner, type UpdateState } from './components/UpdateBanner';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ComingSoonPage } from './pages/ComingSoonPage';

export function App() {
  const [tab, setTab] = useState<TabId>('library');
  const [serverUrl, setServerUrl] = useState('http://localhost:4000');
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [updateState, setUpdateState] = useState<UpdateState | null>(null);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 3200);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    return window.cursorApi.updates.onEvent((payload) => {
      const data = (payload.data ?? {}) as { version?: string; percent?: number; message?: string };
      setUpdateState({ status: payload.status as UpdateState['status'], ...data });
    });
  }, []);

  return (
    <div className="app-shell">
      <TitleBar />
      <UpdateBanner state={updateState} />
      <div className="app-body">
        <Sidebar active={tab} onChange={setTab} serverOnline={serverOnline} />
        <main className="app-content">
          {tab === 'library' && (
            <LibraryPage
              serverUrl={serverUrl}
              title="Библиотека курсоров"
              subtitle="Выбери курсор и настрой его во панели справа — изменения применяются ко всей системе Windows."
              filter="all"
              onStatus={setStatus}
              onServerOnlineChange={setServerOnline}
              onOpenSettings={() => setTab('settings')}
            />
          )}
          {tab === 'characters' && (
            <LibraryPage
              serverUrl={serverUrl}
              title="Персонажи"
              subtitle="Курсоры-компаньоны, скачанные с сервера."
              filter="character"
              onStatus={setStatus}
              onServerOnlineChange={setServerOnline}
              onOpenSettings={() => setTab('settings')}
            />
          )}
          {tab === 'favorites' && (
            <LibraryPage
              serverUrl={serverUrl}
              title="Избранное"
              subtitle="Курсоры, отмеченные звёздочкой."
              filter="favorites"
              onStatus={setStatus}
              onServerOnlineChange={setServerOnline}
              onOpenSettings={() => setTab('settings')}
            />
          )}
          {tab === 'editor' && (
            <ComingSoonPage title="Редактор" description="Рисование собственного курсора с нуля появится в одном из следующих обновлений." />
          )}
          {tab === 'animations' && (
            <ComingSoonPage title="Анимации" description="Анимированные курсоры (.ani) и живой след за курсором появятся в одном из следующих обновлений." />
          )}
          {tab === 'collections' && (
            <ComingSoonPage title="Коллекции" description="Тематические наборы курсоров появятся в одном из следующих обновлений." />
          )}
          {tab === 'mine' && (
            <ComingSoonPage title="Мои курсоры" description="История и сохранённые собственные пресеты появятся в одном из следующих обновлений." />
          )}
          {tab === 'settings' && (
            <SettingsPage serverUrl={serverUrl} onServerUrlChange={setServerUrl} onStatus={setStatus} />
          )}
        </main>
      </div>
      <StatusToast status={status} />
    </div>
  );
}
