// Loads the SQLite WebAssembly build once, shared by every sandbox on the page.
// The .wasm file ships with the site (Vite copies it), so nothing is fetched
// from a CDN and the sandbox keeps working on a flaky classroom network.

import initSqlJs, { type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { SqlEngine } from './engine';

let loading: Promise<SqlJsStatic> | null = null;

export function loadSql(): Promise<SqlJsStatic> {
  if (!loading) {
    loading = initSqlJs({ locateFile: () => wasmUrl }).catch(e => {
      loading = null;
      throw e;
    });
  }
  return loading;
}

export async function newEngine(): Promise<SqlEngine> {
  return new SqlEngine(await loadSql());
}
