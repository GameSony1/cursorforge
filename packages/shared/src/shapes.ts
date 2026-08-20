import type { CursorRoleId } from './cursorRoles';

export type ShapePrimitive =
  | { type: 'polygon'; points: [number, number][] }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
  | { type: 'path'; d: string };

export interface CursorShape {
  viewBox: [number, number];
  primitives: ShapePrimitive[];
  /** Hotspot as a fraction of width/height; defaults to the role's own hotspot when omitted. */
  hotspotRatio?: { x: number; y: number };
}

/** Built-in silhouettes used for the plain color-customization roles. */
export const BASE_SHAPES: Record<CursorRoleId, CursorShape> = {
  Arrow: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'polygon',
        points: [
          [6, 3],
          [6, 46],
          [16, 37],
          [24, 56],
          [32, 52],
          [24, 34],
          [38, 34]
        ]
      }
    ]
  },
  Hand: {
    viewBox: [64, 64],
    primitives: [
      { type: 'rect', x: 24, y: 8, w: 8, h: 30, rx: 4 },
      { type: 'rect', x: 34, y: 12, w: 8, h: 28, rx: 4 },
      { type: 'rect', x: 44, y: 16, w: 8, h: 26, rx: 4 },
      {
        type: 'polygon',
        points: [
          [14, 34],
          [24, 26],
          [24, 60],
          [46, 60],
          [52, 40],
          [40, 40],
          [40, 34]
        ]
      }
    ],
    hotspotRatio: { x: 0.35, y: 0.1 }
  },
  IBeam: {
    viewBox: [64, 64],
    primitives: [
      { type: 'rect', x: 28, y: 6, w: 8, h: 52, rx: 2 },
      { type: 'rect', x: 18, y: 6, w: 28, h: 6, rx: 2 },
      { type: 'rect', x: 18, y: 52, w: 28, h: 6, rx: 2 }
    ],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  Wait: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'polygon',
        points: [
          [16, 8],
          [48, 8],
          [48, 14],
          [32, 32],
          [48, 50],
          [48, 56],
          [16, 56],
          [16, 50],
          [32, 32],
          [16, 14]
        ]
      }
    ],
    hotspotRatio: { x: 0.5, y: 0.5 }
  }
};

const star = (cx: number, cy: number, outerR: number, innerR: number, points: number, rotationDeg: number): [number, number][] => {
  const coords: [number, number][] = [];
  const step = Math.PI / points;
  const rotation = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2 + rotation;
    coords.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return coords.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
};

/** Built-in geometric "character" shapes, mirroring what the skin server would deliver. */
export const SKIN_SHAPES: Record<string, CursorShape> = {
  star: {
    viewBox: [64, 64],
    primitives: [{ type: 'polygon', points: star(32, 32, 28, 12, 5, 0) }],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  shuriken: {
    viewBox: [64, 64],
    primitives: [{ type: 'polygon', points: star(32, 32, 28, 10, 4, 0) }],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  paw: {
    viewBox: [64, 64],
    primitives: [
      { type: 'circle', cx: 32, cy: 42, r: 16 },
      { type: 'circle', cx: 14, cy: 22, r: 8 },
      { type: 'circle', cx: 24, cy: 10, r: 8 },
      { type: 'circle', cx: 40, cy: 10, r: 8 },
      { type: 'circle', cx: 50, cy: 22, r: 8 }
    ],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  ghost: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'path',
        d: 'M 12 32 C 12 14, 52 14, 52 32 L 52 56 L 44 48 L 36 56 L 28 48 L 20 56 L 12 48 Z'
      }
    ],
    hotspotRatio: { x: 0.5, y: 0.4 }
  },
  lightning: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'polygon',
        points: [
          [36, 4],
          [16, 36],
          [30, 36],
          [12, 60],
          [50, 24],
          [32, 24]
        ]
      }
    ],
    hotspotRatio: { x: 0.5, y: 0.1 }
  },
  gem: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'polygon',
        points: [
          [32, 4],
          [52, 20],
          [44, 60],
          [20, 60],
          [12, 20]
        ]
      }
    ],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  garlicArrow: {
    viewBox: [64, 64],
    primitives: [{ type: 'polygon', points: [[6, 3], [6, 46], [16, 37], [24, 56], [32, 52], [24, 34], [38, 34]] }]
  },
  garlicBulb: {
    viewBox: [64, 64],
    primitives: [
      {
        type: 'path',
        d: 'M32 6 C35 6 36 11 34 15 C33 16 33 17 34 18 C48 21 55 30 55 41 C55 52 45 59 32 59 C19 59 9 52 9 41 C9 30 16 21 30 18 C31 17 31 16 30 15 C28 11 29 6 32 6 Z'
      }
    ],
    hotspotRatio: { x: 0.5, y: 0.5 }
  },
  splashArrow: {
    viewBox: [64, 64],
    primitives: [
      { type: 'polygon', points: [[6, 3], [6, 46], [16, 37], [24, 56], [32, 52], [24, 34], [38, 34]] },
      { type: 'circle', cx: 10, cy: 52, r: 4 },
      { type: 'circle', cx: 18, cy: 58, r: 3 },
      { type: 'circle', cx: 4, cy: 44, r: 2.5 }
    ]
  },
  pointingHand: {
    viewBox: [64, 64],
    primitives: [
      { type: 'rect', x: 24, y: 6, w: 10, h: 32, rx: 5 },
      { type: 'polygon', points: [[16, 34], [44, 34], [48, 60], [12, 60]] }
    ],
    hotspotRatio: { x: 0.45, y: 0.1 }
  },
  glossyArrow: {
    viewBox: [64, 64],
    primitives: [{ type: 'polygon', points: [[6, 3], [6, 46], [16, 37], [24, 56], [32, 52], [24, 34], [38, 34]] }]
  }
};
