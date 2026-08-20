import type { CursorRoleId } from './cursorRoles';
import type { CursorShape } from './shapes';

export interface SkinImageAsset {
  /** Path relative to the skin server root, e.g. "/assets/skins/striped-idle.png". */
  idleUrl: string;
  pressedUrl?: string;
}

/** A downloadable cursor skin (character/theme shape) served by the skin server. */
export interface Skin {
  id: string;
  name: string;
  description: string;
  category: string;
  free: boolean;
  /** Vector representation — omit when `image` is provided instead. */
  defaultColor?: string;
  shape?: CursorShape;
  /** Optional authored "mouse button held down" variant; falls back to a generated squish effect when absent. */
  pressedShape?: CursorShape;
  pressedColor?: string;
  /** Raster representation (user-supplied art) — takes precedence over `shape` when present. */
  image?: SkinImageAsset;
}

export interface CursorImageSource {
  size: number;
  /** base64-encoded PNG data (no data: prefix). */
  pngBase64: string;
}

export interface ApplyCursorRequest {
  role: CursorRoleId;
  images: CursorImageSource[];
  /**
   * "Mouse button held down" variant. Only meaningful for the Arrow role:
   * while supplied, a global mouse hook swaps the live system cursor to this
   * image on button-down and back to `images` on button-up.
   */
  pressedImages?: CursorImageSource[];
}

export interface ApplyCursorResult {
  ok: boolean;
  error?: string;
}
