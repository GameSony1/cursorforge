import type { CursorShape } from '@cursor-customizer/shared';

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface DrawShapeOptions {
  /** Extra uniform scale applied around the shape's center (1 = default fit). */
  zoom?: number;
  /** Outline width in output pixels. */
  strokeWidth?: number;
  /** Fill/stroke opacity, 0-1. */
  opacity?: number;
}

export function drawShapeToCanvas(shape: CursorShape, color: string, size: number, options: DrawShapeOptions = {}): HTMLCanvasElement {
  const { zoom = 1, strokeWidth = 1.5, opacity = 1 } = options;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');

  const [vbW, vbH] = shape.viewBox;
  const scale = (size / Math.max(vbW, vbH)) * zoom;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-vbW / 2, -vbH / 2);
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(10, 10, 20, 0.6)';
  ctx.lineJoin = 'round';
  ctx.lineWidth = strokeWidth / scale;

  for (const prim of shape.primitives) {
    if (prim.type === 'path') {
      const path2d = new Path2D(prim.d);
      ctx.fill(path2d);
      ctx.stroke(path2d);
      continue;
    }
    ctx.beginPath();
    if (prim.type === 'polygon') {
      const [first, ...rest] = prim.points;
      ctx.moveTo(first[0], first[1]);
      for (const [x, y] of rest) ctx.lineTo(x, y);
      ctx.closePath();
    } else if (prim.type === 'circle') {
      ctx.arc(prim.cx, prim.cy, prim.r, 0, Math.PI * 2);
    } else if (prim.type === 'rect') {
      roundRectPath(ctx, prim.x, prim.y, prim.w, prim.h, prim.rx ?? 0);
    }
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  return canvas;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImageCached(url: string): Promise<HTMLImageElement> {
  let promise = imageCache.get(url);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    imageCache.set(url, promise);
  }
  return promise;
}

export interface DrawImageOptions {
  zoom?: number;
  opacity?: number;
}

export async function drawImageUrlToCanvas(url: string, size: number, options: DrawImageOptions = {}): Promise<HTMLCanvasElement> {
  const { zoom = 1, opacity = 1 } = options;
  const img = await loadImageCached(url);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');

  const scale = (size / Math.max(img.naturalWidth, img.naturalHeight)) * zoom;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;

  ctx.globalAlpha = opacity;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  return canvas;
}

export function canvasToPngBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl.slice(dataUrl.indexOf(',') + 1);
}

export function shapeToDataUrl(shape: CursorShape, color: string, size: number, options?: DrawShapeOptions): string {
  return drawShapeToCanvas(shape, color, size, options).toDataURL('image/png');
}
