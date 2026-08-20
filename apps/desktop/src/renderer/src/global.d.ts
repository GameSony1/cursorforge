import type { ApplyCursorRequest, ApplyCursorResult } from '@cursor-customizer/shared';

export interface CursorApi {
  applyCursor(request: ApplyCursorRequest): Promise<ApplyCursorResult>;
  restoreDefaults(): Promise<ApplyCursorResult>;
  window: {
    minimize(): void;
    maximizeToggle(): void;
    close(): void;
  };
}

declare global {
  interface Window {
    cursorApi: CursorApi;
  }
}

export {};
