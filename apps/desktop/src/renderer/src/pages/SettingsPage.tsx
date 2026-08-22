import { useState } from 'react';
import type { StatusMessage } from '../components/StatusToast';

interface Props {
  serverUrl: string;
  onServerUrlChange: (url: string) => void;
  onStatus: (status: StatusMessage) => void;
}

export function SettingsPage({ serverUrl, onServerUrlChange, onStatus }: Props) {
  const [draftUrl, setDraftUrl] = useState(serverUrl);
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    try {
      const res = await fetch(`${draftUrl}/api/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onServerUrlChange(draftUrl);
      onStatus({ kind: 'success', text: 'Сервер скинов доступен' });
    } catch (err) {
      onStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Сервер недоступен' });
    } finally {
      setChecking(false);
    }
  }

  async function handleRestore() {
    try {
      await window.cursorApi.restoreDefaults();
      onStatus({ kind: 'info', text: 'Курсоры Windows сброшены на стандартные' });
    } catch (err) {
      onStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Не удалось сбросить курсоры' });
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Настройки</h1>

      <div className="settings-block">
        <label className="field-label" htmlFor="server-url">
          Адрес сервера скинов
        </label>
        <div className="server-row">
          <input
            id="server-url"
            className="text-input"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="http://localhost:4000"
          />
          <button className="ghost-btn" disabled={checking} onClick={handleCheck}>
            {checking ? 'Проверка…' : 'Проверить'}
          </button>
        </div>
      </div>

      <div className="settings-block">
        <label className="field-label">Системные курсоры</label>
        <p className="page-subtitle" style={{ marginBottom: 12 }}>
          Приложение записывает .cur-файлы и применяет их через реестр Windows (HKCU\Control Panel\Cursors).
        </p>
        <button className="ghost-btn" onClick={handleRestore}>
          Восстановить стандартные курсоры Windows
        </button>
      </div>

      <div className="settings-block">
        <label className="field-label">Обновления</label>
        <button className="ghost-btn" onClick={() => window.cursorApi.updates.check()}>
          Проверить обновления
        </button>
      </div>
    </div>
  );
}
