import Router from 'koa-router';

import { Context } from 'koa';

import { joiValidateAuth, IAuthReq } from '../middlewares/joi-users';
import { signTocken } from '../middlewares/jwt';

export default function registerRoute(router: Router) {
  interface AuthCtx extends Context {
    request: IAuthReq;
  }
  router.post('/login', joiValidateAuth, async (ctx: AuthCtx) => {
    // sign jwt token and return as response
    await signTocken(ctx);
  });
}
