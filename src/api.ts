import { API_BASE } from './config';
export async function fetchJSON<T>(path: string, opts: RequestInit = {}): Promise<T>{
  const res = await fetch(`${API_BASE}${path}`, { headers: {'Content-Type': 'application/json'}, ...opts });
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
export { API_BASE };
