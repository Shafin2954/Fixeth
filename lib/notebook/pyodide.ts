// Real in-browser Python execution via Pyodide (loaded from the official CDN).
//
// Pyodide compiles CPython to WebAssembly, so learners run genuine Python
// (and pandas/numpy via micropip) entirely client-side — no server kernel.

const PYODIDE_VERSION = "0.27.2";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: { get: (k: string) => unknown };
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const tag = document.createElement("script");
    tag.src = src;
    tag.async = true;
    tag.onload = () => resolve();
    tag.onerror = () => reject(new Error("Failed to load Pyodide runtime."));
    document.head.appendChild(tag);
  });
}

/** Lazily boot the Pyodide runtime. Subsequent calls reuse the same instance. */
export function getPyodide(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    if (!window.loadPyodide) throw new Error("Pyodide loader unavailable.");
    return window.loadPyodide({ indexURL: PYODIDE_CDN });
  })();
  return pyodidePromise;
}

export type RunResult = {
  stdout: string;
  stderr: string;
  result: string | null;
  ok: boolean;
};

/** Execute a single code cell and capture stdout/stderr plus the last value. */
export async function runPython(code: string): Promise<RunResult> {
  const py = await getPyodide();
  let stdout = "";
  let stderr = "";
  py.setStdout({ batched: (s) => (stdout += s + "\n") });
  py.setStderr({ batched: (s) => (stderr += s + "\n") });

  try {
    // Auto-install any imported packages bundled with Pyodide (numpy, pandas…).
    await py.loadPackagesFromImports(code);
    const value = await py.runPythonAsync(code);
    let result: string | null = null;
    if (value !== undefined && value !== null) {
      result = String(value);
    }
    return { stdout: stdout.trimEnd(), stderr: stderr.trimEnd(), result, ok: true };
  } catch (err) {
    return {
      stdout: stdout.trimEnd(),
      stderr: (stderr + "\n" + (err as Error).message).trim(),
      result: null,
      ok: false
    };
  }
}
