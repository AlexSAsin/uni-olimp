// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IPostPostLikeReq, joiValidatePostPostLike } from '../../../middlewares/joi-posts';
import { IJWTState, jwt } from '../../../middlewares/jwt';

import Posts from '../../../db/models/Posts.model';
import PostsLikes from '../../../db/models/PostsLikes.model';

const TFN = (str: 'true' | 'false' | 'null'): boolean | null => (str == 'true' ? true : str == 'false' ? false : null);

export default function registerRoute(router: Router) {
  interface PostPostLikeCtx extends Context {
    state: IJWTState;
    request: IPostPostLikeReq;
  }
  router.post('/', joiValidatePostPostLike, jwt, async (ctx: PostPostLikeCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Posts.findOne({ where: { id: postId } })) == null) {
      ctx.throw(404, 'Post not Found');
    }

    const prevLike = await PostsLikes.findOne({
      where: {
        userId: ctx.state.user.id,
        postId: postId,
      },
    });

    let currentSelfLikeValue;

    if (prevLike == null) {
      await PostsLikes.create({
        userId: ctx.state.user.id,
        postId: postId,
        value: ctx.request.body.value,
      });
      currentSelfLikeValue = ctx.request.body.value;
    } else if (prevLike.value === ctx.request.body.value) {
      await PostsLikes.destroy({
        where: { postId: postId, userId: ctx.state.user.id },
      });
      currentSelfLikeValue = 0;
    } else {
      await PostsLikes.update(
        {
          value: ctx.request.body.value,
        },
        {
          where: { postId: postId, userId: ctx.state.user.id },
        },
      );
      currentSelfLikeValue = ctx.request.body.value;
    }

    const currentSumLikes = await PostsLikes.sum('value', {
      where: {
        postId: postId,
      },
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      currentSumLikes: isNaN(currentSumLikes) ? 0 : currentSumLikes,
      currentSelfLikeValue: currentSelfLikeValue,
    };
  });
}
