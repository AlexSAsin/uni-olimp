// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwt } from '../../../middlewares/jwt';

import Comments from '../../../db/models/Comments.model';

export default function registerRoute(router: Router) {
  interface CommentsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwt, async (ctx: CommentsGetCtx) => {
    const commentId: number = parseInt(ctx.params.id);
    if (commentId == null || isNaN(commentId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Comments.findByPk(commentId)) == null) {
      ctx.throw(404, 'Comment not Found');
    }

    const curComments = await Comments.scope('detail').findAll({
      where: {
        parentCommentId: commentId,
      },
    });

    const resComments = curComments.map((c) => {
      let resJson: any = c.toJSON();

      resJson['childsCommentsCount'] = c.childsComments.length;
      delete resJson.childsComments;

      return resJson;
    });
    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = resComments;
  });
}
