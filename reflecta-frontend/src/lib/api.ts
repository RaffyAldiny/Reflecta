export class AuthError extends Error { constructor(msg='Unauthenticated'){ super(msg); this.name='AuthError'; } }
export class ApiError extends Error { status:number; constructor(s:number,m='API Error'){ super(m); this.status=s; this.name='ApiError'; } }

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, '')) ||
  'http://127.0.0.1:8000';

function defaultHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
}

async function refreshAccessCookie(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch { return false; }
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: defaultHeaders(init),
    cache: 'no-store',
  });

  if (res.status === 401) {
    if (attempt === 0 && await refreshAccessCookie()) return apiFetch<T>(path, init, 1);
    throw new AuthError();
  }

  if (res.status === 204) return undefined as T;

  let data: any;
  try { data = await res.json(); } catch { throw new ApiError(res.status, `Non-JSON response (${res.status})`); }
  if (!res.ok) throw new ApiError(res.status, data?.detail || data?.message || `HTTP ${res.status}`);
  return data as T;
}

export type User = { id: number; username: string; email?: string };

export const authApi = {
  me(): Promise<User> { return apiFetch<User>('/api/auth/me'); },
  login(identifier: string, password: string): Promise<User> {
    // backend accepts username OR email via "username" field
    return apiFetch<User>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: identifier, password }) });
  },
  register(username: string, email: string, password: string): Promise<User> {
    return apiFetch<User>('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) });
  },
  logout(): Promise<void> { return apiFetch('/api/auth/logout', { method: 'POST' }); },
};
