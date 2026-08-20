import { useEffect, useState } from 'react';
import type { CatalogItem } from '../lib/catalog';
import { ShapePreview } from './ShapePreview';
import { applyCursorVariants, applyImageCursorVariants } from '../lib/cursorApply';
import type { StatusMessage } from './StatusToast';

const PRESSED_ZOOM_FACTOR = 0.82;

interface Props {
  item: CatalogItem | null;
  favorite: boolean;
  onToggleFavorite: () => void;
  onStatus: (status: StatusMessage) => void;
  onOpenSettings: () => void;
}

const COLOR_SWATCHES = ['#8b5cf6', '#4dd2ff', '#39ff88', '#ffd23f', '#ff8a3d', '#ff5e5e', '#ffffff'];
const TOOL_ICONS = ['↖', '✏', '⬡', '✨', '🪣', 'A', '⌫'];
type PropTab = 'properties' | 'effects' | 'sounds';

function soon(onStatus: Props['onStatus']) {
  onStatus({ kind: 'info', text: 'Эта функция появится в одном из следующих обновлений' });
}

export function InspectorPanel({ item, favorite, onToggleFavorite, onStatus, onOpenSettings }: Props) {
  const [color, setColor] = useState(item?.color ?? '#8b5cf6');
  const [size, setSize] = useState(32);
  const [thickness, setThickness] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [trail, setTrail] = useState(false);
  const [trailLength, setTrailLength] = useState(25);
  const [tab, setTab] = useState<PropTab>('properties');
  const [applying, setApplying] = useState(false);
  const [clickSwapEnabled, setClickSwapEnabled] = useState(true);

  useEffect(() => {
    if (item?.color) setColor(item.color);
  }, [item?.id]);

  if (!item) {
    return (
      <aside className="inspector empty">
        <p className="page-subtitle">Выбери курсор в библиотеке слева, чтобы настроить его здесь.</p>
      </aside>
    );
  }

  const isImage = Boolean(item.image);
  const zoom = size / 32;
  const supportsClickSwap = item.role === 'Arrow';
  const pressedShape = item.pressedShape ?? item.shape;
  const pressedColor = item.pressedColor ?? color;
  const pressedImageUrl = item.image?.pressedUrl ?? item.image?.idleUrl;

  function renderPreview(size: number, pressed: boolean, opacityOverride?: number) {
    const op = opacityOverride ?? opacity / 100;
    if (item!.image) {
      const url = pressed ? pressedImageUrl! : item!.image.idleUrl;
      return (
        <img
          src={url}
          alt=""
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            opacity: op,
            transform: `scale(${pressed ? zoom * PRESSED_ZOOM_FACTOR : zoom})`
          }}
        />
      );
    }
    return (
      <ShapePreview
        shape={pressed ? pressedShape! : item!.shape!}
        color={pressed ? pressedColor : color}
        size={size}
        zoom={pressed ? zoom * PRESSED_ZOOM_FACTOR : zoom}
        strokeWidth={thickness}
        opacity={op}
        glow={!pressed}
      />
    );
  }

  async function handleApply() {
    if (!item) return;
    setApplying(true);
    try {
      const usePressed = supportsClickSwap && clickSwapEnabled;
      if (item.image) {
        await applyImageCursorVariants(
          item.role,
          { url: item.image.idleUrl, options: { zoom, opacity: opacity / 100 } },
          usePressed ? { url: pressedImageUrl!, options: { zoom: zoom * PRESSED_ZOOM_FACTOR, opacity: opacity / 100 } } : undefined
        );
      } else {
        const idleVariant = { shape: item.shape!, color, options: { zoom, strokeWidth: thickness, opacity: opacity / 100 } };
        const pressedVariant = usePressed
          ? { shape: pressedShape!, color: pressedColor, options: { zoom: zoom * PRESSED_ZOOM_FACTOR, strokeWidth: thickness, opacity: opacity / 100 } }
          : undefined;
        await applyCursorVariants(item.role, idleVariant, pressedVariant);
      }
      onStatus({ kind: 'success', text: `Курсор «${item.name}» применён` });
    } catch (err) {
      onStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Не удалось применить курсор' });
    } finally {
      setApplying(false);
    }
  }

  return (
    <aside className="inspector">
      <h2 className="inspector-title">Текущий курсор</h2>

      <div className="inspector-body">
        <div className="tool-rail">
          {TOOL_ICONS.map((icon, i) => (
            <button key={i} className={`tool-icon ${i === 0 ? 'active' : ''}`} onClick={() => (i === 0 ? undefined : soon(onStatus))}>
              {icon}
            </button>
          ))}
        </div>

        <div className="inspector-main">
          <div className="inspector-preview">
            <div className="trail-stack">
              {trail &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="trail-ghost"
                    style={{
                      transform: `translate(${-(i + 1) * (trailLength / 8)}px, ${-(i + 1) * (trailLength / 8)}px)`
                    }}
                  >
                    {renderPreview(130, false, (opacity / 100) * (0.35 - i * 0.07))}
                  </div>
                ))}
              {renderPreview(130, false)}
            </div>
          </div>

          <div className="inspector-tabs">
            <button className={tab === 'properties' ? 'active' : ''} onClick={() => setTab('properties')}>
              Свойства
            </button>
            <button className={tab === 'effects' ? 'active' : ''} onClick={() => setTab('effects')}>
              Эффекты
            </button>
            <button className={tab === 'sounds' ? 'active' : ''} onClick={() => setTab('sounds')}>
              Звуки
            </button>
          </div>

          {tab === 'properties' && (
            <div className="inspector-fields">
              {isImage ? (
                <p className="hint-text">Цвет и толщина заданы автором картинки и здесь не редактируются.</p>
              ) : (
                <>
                  <div className="field-row">
                    <label>Цвет</label>
                    <span className="hex-value">{color}</span>
                  </div>
                  <div className="swatch-row">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        className={`swatch ${swatch === color ? 'active' : ''}`}
                        style={{ background: swatch }}
                        onClick={() => setColor(swatch)}
                      />
                    ))}
                    <input type="color" className="swatch swatch-custom" value={color} onChange={(e) => setColor(e.target.value)} />
                  </div>

                  <div className="field-row">
                    <label>Толщина</label>
                    <span>{thickness} px</span>
                  </div>
                  <input type="range" min={0} max={6} value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
                </>
              )}

              <div className="field-row">
                <label>Размер</label>
                <span>{size} px</span>
              </div>
              <input type="range" min={16} max={48} value={size} onChange={(e) => setSize(Number(e.target.value))} />

              <div className="field-row">
                <label>Прозрачность</label>
                <span>{opacity}%</span>
              </div>
              <input type="range" min={20} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />

              {supportsClickSwap && (
                <>
                  <div className="field-row">
                    <label>Эффект нажатия</label>
                    <label className="switch">
                      <input type="checkbox" checked={clickSwapEnabled} onChange={(e) => setClickSwapEnabled(e.target.checked)} />
                      <span className="switch-track" />
                    </label>
                  </div>
                  {clickSwapEnabled && (
                    <div className="press-preview-row">
                      <div className="press-preview-item">
                        {renderPreview(40, false)}
                        <span>обычный</span>
                      </div>
                      <span className="press-arrow">→</span>
                      <div className="press-preview-item">
                        {renderPreview(40, true)}
                        <span>нажат</span>
                      </div>
                    </div>
                  )}
                  <p className="hint-text">
                    Пока зажата левая кнопка мыши, курсор визуально сжимается — работает системно, в любом приложении Windows.
                  </p>
                </>
              )}

              <div className="field-row">
                <label>След</label>
                <label className="switch">
                  <input type="checkbox" checked={trail} onChange={(e) => setTrail(e.target.checked)} />
                  <span className="switch-track" />
                </label>
              </div>
              {trail && (
                <>
                  <div className="field-row">
                    <label>Длина следа</label>
                    <span>{trailLength}</span>
                  </div>
                  <input type="range" min={5} max={50} value={trailLength} onChange={(e) => setTrailLength(Number(e.target.value))} />
                  <p className="hint-text">Предпросмотр эффекта в приложении. Экспорт следа в системный курсор — скоро.</p>
                </>
              )}
            </div>
          )}

          {tab === 'effects' && <p className="page-subtitle">Эффекты (свечение, искры, клик-анимация) появятся в одном из следующих обновлений.</p>}
          {tab === 'sounds' && <p className="page-subtitle">Звуки курсора появятся в одном из следующих обновлений.</p>}

          <button className="primary-btn wide" disabled={applying} onClick={handleApply}>
            {applying ? 'Применяем…' : 'Применить курсор'}
          </button>
        </div>
      </div>

      <div className="inspector-footer">
        <button onClick={onOpenSettings} title="Настройки">
          ⚙
        </button>
        <button onClick={() => soon(onStatus)} title="Дублировать">
          ⧉
        </button>
        <button onClick={() => soon(onStatus)} title="Предпросмотр">
          👁
        </button>
        <button className={favorite ? 'active' : ''} onClick={onToggleFavorite} title="Избранное">
          ♥
        </button>
      </div>
    </aside>
  );
}
