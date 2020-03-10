import { getCookieToken } from './cookie_helper';

export async function get<returnT>(path: string): Promise<returnT> {
  const token = getCookieToken();
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function post<returnT, bodyT>(
  path: string,
  data: bodyT,
): Promise<returnT> {
  const token = getCookieToken();
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return { ...responseData, ok: response.ok };
}
