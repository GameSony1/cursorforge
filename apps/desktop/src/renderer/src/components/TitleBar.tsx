export function TitleBar() {
  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <span className="titlebar-logo">◆</span>
        <span className="titlebar-title">CURSOR FORGE</span>
      </div>
      <div className="titlebar-controls">
        <button aria-label="Свернуть" onClick={() => window.cursorApi.window.minimize()}>
          &#8211;
        </button>
        <button aria-label="Развернуть" onClick={() => window.cursorApi.window.maximizeToggle()}>
          &#9633;
        </button>
        <button aria-label="Закрыть" className="danger" onClick={() => window.cursorApi.window.close()}>
          &#10005;
        </button>
      </div>
    </div>
  );
}
