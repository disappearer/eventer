import { getCookieToken } from './cookieHelper';

export type getReturnT<dataT> = {
  ok: boolean;
  status: number;
  data: dataT;
};

export async function get<returnDataT>(
  path: string,
): Promise<getReturnT<returnDataT>> {
  const token = getCookieToken();

  const response = await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const { ok, status } = response;
  const data = await response.json();
  return { ok, status, data };
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
