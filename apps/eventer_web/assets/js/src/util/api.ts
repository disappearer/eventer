import { getCookieToken } from './cookie_helper';

export async function get<T>(path: string): Promise<T> {
  const token = getCookieToken();
  const response = await fetch('/api/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json();
  return data;
}
