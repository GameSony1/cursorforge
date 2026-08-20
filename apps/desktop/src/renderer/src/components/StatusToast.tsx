export interface StatusMessage {
  kind: 'success' | 'error' | 'info';
  text: string;
}

export function StatusToast({ status }: { status: StatusMessage | null }) {
  if (!status) return null;
  return <div className={`toast toast-${status.kind}`}>{status.text}</div>;
}
