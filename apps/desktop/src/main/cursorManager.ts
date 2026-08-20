import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import { CURSOR_ROLES, findCursorRole, type ApplyCursorRequest, type CursorImageSource, type CursorRoleDef } from '@cursor-customizer/shared';
import { encodeCur } from '@cursor-customizer/shared/src/node';
import { clearClickSwap, setClickSwap } from './clickCursorEngine';

function run(command: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolvePromise) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      resolvePromise({ code: error && 'code' in error ? Number(error.code) || 1 : 0, stdout, stderr });
    });
  });
}

const CURSORS_REG_KEY = 'HKCU\\Control Panel\\Cursors';

function cursorsDir(): string {
  return path.join(app.getPath('userData'), 'cursors');
}

function refreshScript(): string {
  return path.join(app.getPath('userData'), 'refresh-cursors.ps1');
}

async function ensureRefreshScript(): Promise<string> {
  const scriptPath = refreshScript();
  const contents = [
    "Add-Type -Namespace Native -Name Cursor -MemberDefinition '",
    '[DllImport("user32.dll", CharSet=CharSet.Auto)]',
    'public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);',
    "'",
    '[Native.Cursor]::SystemParametersInfo(0x0057, 0, [IntPtr]::Zero, 0x03) | Out-Null'
  ].join('\n');
  await fs.writeFile(scriptPath, contents, 'utf-8');
  return scriptPath;
}

async function broadcastCursorRefresh(): Promise<void> {
  const scriptPath = await ensureRefreshScript();
  await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', scriptPath]);
}

async function buildCurFile(role: CursorRoleDef, sources: CursorImageSource[], tag: string): Promise<string> {
  const images = sources.map((img) => {
    const size = img.size;
    const hotspot = {
      x: Math.round(size * role.hotspotRatio.x),
      y: Math.round(size * role.hotspotRatio.y)
    };
    return { size, png: Buffer.from(img.pngBase64, 'base64'), hotspot };
  });

  const curBuffer = await encodeCur(images);

  const dir = cursorsDir();
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${role.id}-${tag}-${Date.now()}.cur`);
  await fs.writeFile(filePath, curBuffer);
  return filePath;
}

export async function applyCursor(request: ApplyCursorRequest): Promise<void> {
  const role = findCursorRole(request.role);
  if (!role) {
    throw new Error(`Unknown cursor role: ${request.role}`);
  }
  if (request.images.length === 0) {
    throw new Error('No images supplied for cursor');
  }

  const filePath = await buildCurFile(role, request.images, 'idle');

  const result = await run('reg', ['add', CURSORS_REG_KEY, '/v', role.registryName, '/t', 'REG_SZ', '/d', filePath, '/f']);
  if (result.code !== 0) {
    throw new Error(`Failed to write registry value for ${role.registryName}: ${result.stderr || result.stdout}`);
  }

  await broadcastCursorRefresh();

  // Click-swap only makes sense for the primary (Arrow) pointer — Windows
  // already handles the other roles contextually.
  if (role.id === 'Arrow') {
    if (request.pressedImages && request.pressedImages.length > 0) {
      const pressedPath = await buildCurFile(role, request.pressedImages, 'pressed');
      setClickSwap(filePath, pressedPath);
    } else {
      clearClickSwap();
    }
  }
}

export async function restoreDefaultCursors(): Promise<void> {
  for (const role of CURSOR_ROLES) {
    await run('reg', ['delete', CURSORS_REG_KEY, '/v', role.registryName, '/f']);
  }
  clearClickSwap();
  await broadcastCursorRefresh();
}
