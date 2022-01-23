// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwt } from '../../../middlewares/jwt';

import Posts from '../../../db/models/Posts.model';
import { IPostPostLikeReq } from '../../../middlewares/joi-posts';

export default function registerRoute(router: Router) {
  interface PostPostIncrementView extends Context {
    state: IJWTState;
    request: IPostPostLikeReq;
  }
  router.post('/', jwt, async (ctx: PostPostIncrementView) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    const curPost = await Posts.findOne({
      where: {
        id: postId,
      },
    });

    if (curPost == null) {
      ctx.throw(404, 'Post not Found');
    }

    await curPost.increment('viewsCount', { silent: true });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      currentViewsCount: curPost.viewsCount,
    };
  });
}
