export type CursorRoleId = 'Arrow' | 'Hand' | 'IBeam' | 'Wait';

export interface CursorRoleDef {
  id: CursorRoleId;
  registryName: string;
  label: string;
  /** Hotspot position as a fraction of the image width/height (0..1). */
  hotspotRatio: { x: number; y: number };
}

export const CURSOR_ROLES: CursorRoleDef[] = [
  { id: 'Arrow', registryName: 'Arrow', label: 'Указатель', hotspotRatio: { x: 0.1, y: 0.05 } },
  { id: 'Hand', registryName: 'Hand', label: 'Рука (ссылки)', hotspotRatio: { x: 0.35, y: 0.05 } },
  { id: 'IBeam', registryName: 'IBeam', label: 'Текстовый курсор', hotspotRatio: { x: 0.5, y: 0.5 } },
  { id: 'Wait', registryName: 'Wait', label: 'Ожидание', hotspotRatio: { x: 0.5, y: 0.5 } }
];

export const CURSOR_SIZES = [32, 48, 64, 96, 128] as const;

export function findCursorRole(id: string): CursorRoleDef | undefined {
  return CURSOR_ROLES.find((role) => role.id === id);
}
