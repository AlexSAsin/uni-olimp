// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IPostPatchVerificataionReq, joiValidatePostPatchVerificataion } from '../../../middlewares/joi-posts';
import { IJWTState, jwt } from '../../../middlewares/jwt';

import Posts from '../../../db/models/Posts.model';
import PostsVerifications from '../../../db/models/PostsVerifications.model';
import Alerts from '../../../db/models/Alerts.model';

export default function registerRoute(router: Router) {
  interface PostsPatchValideteCtx extends Context {
    request: IPostPatchVerificataionReq;
    state: IJWTState;
  }
  router.patch('/', joiValidatePostPatchVerificataion, jwt, async (ctx: PostsPatchValideteCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    if (ctx.state.user.roleName != 'admin') {
      ctx.throw(403, 'Forbidden for non admin');
    }

    const curPost = await Posts.findByPk(postId);

    if (curPost == null) {
      ctx.throw(404, 'Post not Found');
    }

    const newPostVerification = await PostsVerifications.create({
      postId: postId,
      result: ctx.request.body.result,
      reason: ctx.request.body.reason,
    });

    const alertTitle = ctx.request.body.result ? 'Your post has been accepted' : 'Your post has been declined';
    const alertLevel = ctx.request.body.result ? 'success' : 'error';

    await Alerts.create({
      title: alertTitle,
      level: alertLevel,
      userId: curPost.ownerId,
      reason: ctx.request.body.reason,
      postId: postId,
    });

    ctx.status = 200;
    ctx.type = 'json';
  });
}
