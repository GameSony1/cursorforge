import { useEffect, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar, type TabId } from './components/Sidebar';
import { StatusToast, type StatusMessage } from './components/StatusToast';
import { UpdateBanner, type UpdateState } from './components/UpdateBanner';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';

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
              onStatus={setStatus}
              onServerOnlineChange={setServerOnline}
              onOpenSettings={() => setTab('settings')}
            />
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
