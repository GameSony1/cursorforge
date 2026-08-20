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
  }
};

contextBridge.exposeInMainWorld('cursorApi', api);

export type CursorApi = typeof api;
