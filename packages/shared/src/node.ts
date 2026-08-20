// Node-only exports (uses Buffer / the "to-ico" package). Import this from the
// Electron main process or the server — never from renderer code, which only
// has DOM types in scope.
export * from './curEncoder';
