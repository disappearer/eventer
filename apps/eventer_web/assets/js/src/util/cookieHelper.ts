import Cookies from 'js-cookie';

export const getCookieToken = () => Cookies.get('token');
