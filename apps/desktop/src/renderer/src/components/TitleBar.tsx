import logo from '../assets/logo-small.png';

export function TitleBar() {
  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <img className="titlebar-logo" src={logo} alt="" />
        <span className="titlebar-title">CURSOR FORGE</span>
      </div>
      <div className="titlebar-controls">
        <button aria-label="Свернуть" onClick={() => window.cursorApi.window.minimize()}>
          <svg viewBox="0 0 10 10">
            <line x1="1" y1="5" x2="9" y2="5" />
          </svg>
        </button>
        <button aria-label="Развернуть" onClick={() => window.cursorApi.window.maximizeToggle()}>
          <svg viewBox="0 0 10 10">
            <rect x="1.5" y="1.5" width="7" height="7" />
          </svg>
        </button>
        <button aria-label="Закрыть" className="danger" onClick={() => window.cursorApi.window.close()}>
          <svg viewBox="0 0 10 10">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
