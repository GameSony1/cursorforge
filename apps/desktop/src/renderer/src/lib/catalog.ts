import { BASE_SHAPES, type CursorRoleId, type CursorShape, type Skin } from '@cursor-customizer/shared';

export type CatalogSection = 'classic' | 'colored' | 'character' | 'unique';

export interface CatalogImage {
  idleUrl: string;
  pressedUrl?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  section: CatalogSection;
  role: CursorRoleId;
  free: boolean;
  /** Vector representation — absent when `image` is set instead. */
  shape?: CursorShape;
  color?: string;
  pressedShape?: CursorShape;
  pressedColor?: string;
  /** Raster (user-supplied art) representation — takes precedence over `shape` when present. */
  image?: CatalogImage;
}

const CLASSIC_ITEMS: CatalogItem[] = [
  { id: 'base-arrow', name: 'Указатель', section: 'classic', role: 'Arrow', shape: BASE_SHAPES.Arrow, color: '#e8ecff', free: true },
  { id: 'base-hand', name: 'Рука', section: 'classic', role: 'Hand', shape: BASE_SHAPES.Hand, color: '#e8ecff', free: true },
  { id: 'base-ibeam', name: 'Текст', section: 'classic', role: 'IBeam', shape: BASE_SHAPES.IBeam, color: '#e8ecff', free: true },
  { id: 'base-wait', name: 'Ожидание', section: 'classic', role: 'Wait', shape: BASE_SHAPES.Wait, color: '#e8ecff', free: true }
];

const COLOR_PRESETS: { name: string; color: string }[] = [
  { name: 'Неон розовый', color: '#ff2d95' },
  { name: 'Неон синий', color: '#4dd2ff' },
  { name: 'Неон зелёный', color: '#39ff88' },
  { name: 'Фиолетовый', color: '#8b5cf6' },
  { name: 'Оранжевый', color: '#ff8a3d' }
];

const COLORED_ITEMS: CatalogItem[] = COLOR_PRESETS.map((preset, i) => ({
  id: `colored-${i}`,
  name: preset.name,
  section: 'colored',
  role: 'Arrow',
  shape: BASE_SHAPES.Arrow,
  color: preset.color,
  free: true
}));

export const SECTION_LABELS: Record<CatalogSection, string> = {
  classic: 'Классические',
  colored: 'Цветные',
  character: 'Персонажи',
  unique: 'Уникальные'
};

export function buildCatalog(skins: Skin[], serverUrl: string): CatalogItem[] {
  const skinItems: CatalogItem[] = skins.map((skin) => ({
    id: `skin-${skin.id}`,
    name: skin.name,
    section: skin.category === 'character' ? 'character' : 'unique',
    role: 'Arrow',
    free: skin.free,
    shape: skin.shape,
    color: skin.defaultColor,
    pressedShape: skin.pressedShape,
    pressedColor: skin.pressedColor,
    image: skin.image
      ? {
          idleUrl: `${serverUrl}${skin.image.idleUrl}`,
          pressedUrl: skin.image.pressedUrl ? `${serverUrl}${skin.image.pressedUrl}` : undefined
        }
      : undefined
  }));

  return [...CLASSIC_ITEMS, ...COLORED_ITEMS, ...skinItems];
}
