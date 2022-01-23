// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';
import Alerts from '../../db/models/Alerts.model';
import Comments from '../../db/models/Comments.model';
import Posts from '../../db/models/Posts.model';

import { IJWTState, jwt } from '../../middlewares/jwt';

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwt, async (ctx: PostsGetCtx) => {
    const alerts = await Alerts.findAll({
      attributes: ['id', 'title', 'level', 'reason', 'updatedAt'],
      include: [
        {
          model: Posts.scope('alert'),
          paranoid: false,
        },
        {
          model: Comments.scope('alert'),
          as: 'comment1',
          paranoid: false,
        },
        {
          model: Comments.scope('alert'),
          as: 'comment2',
          paranoid: false,
        },
      ],
      where: {
        userId: ctx.state.user.id,
        viewed: false,
      },
    });

    const res = alerts.map((a) => {
      let aJson: any = a.toJSON();
      delete aJson.post?.lastVerification;
      return aJson;
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = res;
  });
}
