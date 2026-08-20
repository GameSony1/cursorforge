import koffi from 'koffi';
import { uIOhook } from 'uiohook-napi';

// Windows has no native "cursor while button is held" concept, so we fake it
// with a global mouse hook that hot-swaps the live Arrow cursor via
// SetSystemCursor. This is a per-session, in-memory override — it never
// touches the registry, so it doesn't affect the persisted scheme written by
// cursorManager.applyCursor and disappears on logoff/explorer restart.
const user32 = koffi.load('user32.dll');
const LoadImageW = user32.func('void* LoadImageW(void* hinst, str16 name, uint32 type, int cx, int cy, uint32 fuLoad)');
const SetSystemCursor = user32.func('bool SetSystemCursor(void* hcur, uint32 id)');

const IMAGE_CURSOR = 2;
const LR_LOADFROMFILE = 0x10;
const OCR_NORMAL = 32512;
const LEFT_BUTTON = 1;

let idlePath: string | null = null;
let pressedPath: string | null = null;
let hookStarted = false;

function setArrowCursorFromFile(filePath: string): void {
  const handle = LoadImageW(null, filePath, IMAGE_CURSOR, 0, 0, LR_LOADFROMFILE);
  if (handle) SetSystemCursor(handle, OCR_NORMAL);
}

function ensureHookStarted(): void {
  if (hookStarted) return;
  hookStarted = true;
  uIOhook.on('mousedown', (e) => {
    if (e.button !== LEFT_BUTTON || !pressedPath) return;
    setArrowCursorFromFile(pressedPath);
  });
  uIOhook.on('mouseup', (e) => {
    if (e.button !== LEFT_BUTTON || !idlePath) return;
    setArrowCursorFromFile(idlePath);
  });
  uIOhook.start();
}

export function setClickSwap(idleCurPath: string, pressedCurPath: string): void {
  idlePath = idleCurPath;
  pressedPath = pressedCurPath;
  ensureHookStarted();
}

export function clearClickSwap(): void {
  idlePath = null;
  pressedPath = null;
}

export function stopClickCursorEngine(): void {
  if (!hookStarted) return;
  uIOhook.stop();
  hookStarted = false;
}
