// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';
import Alerts from '../../../db/models/Alerts.model';
import { joiValidateAlertsIdPatch } from '../../../middlewares/joi-alerts';

import { IJWTState, jwt } from '../../../middlewares/jwt';

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.patch('/', joiValidateAlertsIdPatch, jwt, async (ctx: PostsGetCtx) => {
    const alertId: number = parseInt(ctx.params.id);

    const curAlert = await Alerts.findByPk(alertId);

    if (curAlert == null) {
      ctx.throw(404, 'Alert not Found');
    }

    await curAlert.update({
      viewed: true,
    });

    ctx.status = 200;
    ctx.type = 'json';
  });
}
