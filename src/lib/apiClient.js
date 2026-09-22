import { logger } from './logger.js';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  '';

function buildUrl(pathname, query) {
  const url = new URL(
    (BASE_URL || 'http://localhost') + pathname,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function request(method, pathname, { query, body, headers, timeoutMs = 12000 } = {}) {
  const url = buildUrl(pathname, query);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const finalHeaders = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : null),
    ...headers,
  };
  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      credentials: 'same-origin',
    });
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json().catch(() => null) : await res.text();
    if (!res.ok) {
      const err = new Error(
        (payload && payload.message) || `Request failed (${res.status})`
      );
      err.status = res.status;
      err.payload = payload;
      throw err;
    }
    return payload;
  } catch (e) {
    logger.warn('apiClient error', method, pathname, e.message);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...(opts || {}), body }),
  put: (path, body, opts) => request('PUT', path, { ...(opts || {}), body }),
  patch: (path, body, opts) => request('PATCH', path, { ...(opts || {}), body }),
  del: (path, opts) => request('DELETE', path, opts),
};

export default apiClient;
