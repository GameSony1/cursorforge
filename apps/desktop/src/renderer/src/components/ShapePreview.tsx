import type { CursorShape } from '@cursor-customizer/shared';

interface Props {
  shape: CursorShape;
  color: string;
  size?: number;
  glow?: boolean;
  zoom?: number;
  strokeWidth?: number;
  opacity?: number;
}

const STROKE = 'rgba(8, 8, 18, 0.65)';

export function ShapePreview({ shape, color, size = 96, glow = true, zoom = 1, strokeWidth = 1.5, opacity = 1 }: Props) {
  const [w, h] = shape.viewBox;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        opacity,
        filter: glow ? `drop-shadow(0 0 10px ${color}99)` : undefined,
        overflow: 'visible'
      }}
    >
      <g transform={`translate(${w / 2} ${h / 2}) scale(${zoom}) translate(${-w / 2} ${-h / 2})`}>
        {shape.primitives.map((p, i) => {
          if (p.type === 'polygon') {
            return (
              <polygon
                key={i}
                points={p.points.map(([x, y]) => `${x},${y}`).join(' ')}
                fill={color}
                stroke={STROKE}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
              />
            );
          }
          if (p.type === 'circle') {
            return <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} stroke={STROKE} strokeWidth={strokeWidth} />;
          }
          if (p.type === 'rect') {
            return (
              <rect
                key={i}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={p.rx ?? 0}
                fill={color}
                stroke={STROKE}
                strokeWidth={strokeWidth}
              />
            );
          }
          return <path key={i} d={p.d} fill={color} stroke={STROKE} strokeWidth={strokeWidth} strokeLinejoin="round" />;
        })}
      </g>
    </svg>
  );
}
