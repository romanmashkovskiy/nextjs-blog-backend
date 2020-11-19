import { serialize, parse } from 'cookie';
import env from '../config/env';

const TOKEN_NAME = 'token';

export function setTokenCookie(res, token) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: env.JWT_EXPIRES_IN,
    expires: new Date(Date.now() + env.JWT_EXPIRES_IN * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getTokenCookie(req) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}
