export interface UpdateState {
  status: 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';
  version?: string;
  percent?: number;
  message?: string;
}

export function UpdateBanner({ state }: { state: UpdateState | null }) {
  if (!state || state.status === 'not-available' || state.status === 'checking') return null;

  let text = '';
  if (state.status === 'available') text = `Доступно обновление ${state.version ?? ''} — загружается…`;
  if (state.status === 'downloading') text = `Загрузка обновления… ${Math.round(state.percent ?? 0)}%`;
  if (state.status === 'downloaded') text = `Обновление ${state.version ?? ''} готово к установке`;
  if (state.status === 'error') text = `Ошибка обновления: ${state.message ?? ''}`;

  return (
    <div className={`update-banner ${state.status}`}>
      <span>{text}</span>
      {state.status === 'downloaded' && (
        <button className="ghost-btn" onClick={() => window.cursorApi.updates.install()}>
          Перезапустить и установить
        </button>
      )}
    </div>
  );
}
