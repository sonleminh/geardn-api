import { Request } from 'express';

export function getCartTokenFromCookies(req: Request) {
  const cookies = req.headers?.cookie;
  return cookies
    ?.split('; ')
    ?.find((cookie) => cookie.startsWith('cart_token='))
    ?.split('=')[1];
}
