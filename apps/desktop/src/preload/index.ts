import { contextBridge, ipcRenderer } from 'electron';
import type { ApplyCursorRequest, ApplyCursorResult } from '@cursor-customizer/shared';

const api = {
  applyCursor: (request: ApplyCursorRequest): Promise<ApplyCursorResult> =>
    ipcRenderer.invoke('cursor:apply', request),
  restoreDefaults: (): Promise<ApplyCursorResult> => ipcRenderer.invoke('cursor:restore-defaults'),
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximizeToggle: () => ipcRenderer.send('window:maximize-toggle'),
    close: () => ipcRenderer.send('window:close')
  },
  updates: {
    check: () => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.send('update:install'),
    onEvent: (listener: (payload: { status: string; data?: unknown }) => void) => {
      const handler = (_event: unknown, payload: { status: string; data?: unknown }) => listener(payload);
      ipcRenderer.on('update:event', handler);
      return () => ipcRenderer.removeListener('update:event', handler);
    }
  }
};

contextBridge.exposeInMainWorld('cursorApi', api);

export type CursorApi = typeof api;
