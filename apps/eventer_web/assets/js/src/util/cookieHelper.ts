import Cookies from 'js-cookie';

export const getCookieToken = () => Cookies.get('token');

export const setRedirectCookie = (path: string) =>
  Cookies.set('redirect', path);

export const getRedirectCookie = () => Cookies.get('redirect');

export const clearRedirectCookie = () => Cookies.remove('redirect');
