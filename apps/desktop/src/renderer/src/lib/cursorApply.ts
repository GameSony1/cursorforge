import { CURSOR_SIZES, type CursorRoleId, type CursorShape } from '@cursor-customizer/shared';
import { canvasToPngBase64, drawImageUrlToCanvas, drawShapeToCanvas, type DrawImageOptions, type DrawShapeOptions } from './cursorCanvas';

export interface CursorVariant {
  shape: CursorShape;
  color: string;
  options?: DrawShapeOptions;
}

function renderVariant(variant: CursorVariant) {
  return CURSOR_SIZES.map((size) => ({
    size,
    pngBase64: canvasToPngBase64(drawShapeToCanvas(variant.shape, variant.color, size, variant.options))
  }));
}

/**
 * Applies a vector cursor, optionally with a distinct "mouse button held down"
 * look (only meaningful for the Arrow role — see clickCursorEngine on the main side).
 */
export async function applyCursorVariants(role: CursorRoleId, idle: CursorVariant, pressed?: CursorVariant): Promise<void> {
  const result = await window.cursorApi.applyCursor({
    role,
    images: renderVariant(idle),
    pressedImages: pressed ? renderVariant(pressed) : undefined
  });
  if (!result.ok) {
    throw new Error(result.error ?? 'Не удалось применить курсор');
  }
}

export interface ImageVariant {
  url: string;
  options?: DrawImageOptions;
}

async function renderImageVariant(variant: ImageVariant) {
  return Promise.all(
    CURSOR_SIZES.map(async (size) => ({
      size,
      pngBase64: canvasToPngBase64(await drawImageUrlToCanvas(variant.url, size, variant.options))
    }))
  );
}

/** Same as {@link applyCursorVariants} but for user-supplied raster art. */
export async function applyImageCursorVariants(role: CursorRoleId, idle: ImageVariant, pressed?: ImageVariant): Promise<void> {
  const [images, pressedImages] = await Promise.all([
    renderImageVariant(idle),
    pressed ? renderImageVariant(pressed) : Promise.resolve(undefined)
  ]);

  const result = await window.cursorApi.applyCursor({ role, images, pressedImages });
  if (!result.ok) {
    throw new Error(result.error ?? 'Не удалось применить курсор');
  }
}
