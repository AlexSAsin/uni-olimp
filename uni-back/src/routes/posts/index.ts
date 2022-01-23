// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import {
  IPostsPostReq,
  joiValidatePostsGet,
  joiValidatePostsPost,
  PostsGetQueryType,
} from '../../middlewares/joi-posts';
import { IJWTState, jwt } from '../../middlewares/jwt';

import Posts from '../../db/models/Posts.model';
import PostsVerifications from '../../db/models/PostsVerifications.model';

const TFN = (str: 'true' | 'false' | 'null'): boolean | null => (str == 'true' ? true : str == 'false' ? false : null);

export default function registerRoute(router: Router) {
  interface PostsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', joiValidatePostsGet, jwt, async (ctx: PostsGetCtx) => {
    const verificationResult = (ctx.request.query as PostsGetQueryType).verificationResult;

    if ((verificationResult == 'false' || verificationResult == 'null') && ctx.state.user.roleName != 'admin') {
      ctx.throw(403, 'You cannot manage new posts');
    }

    let posts = await Posts.scope('view').findAll({
      where: {},
      order: ['updatedAt'],
    });

    let res: { id: number }[] = [];

    posts.forEach((post) => {
      if (
        (post.lastVerification != null || verificationResult != 'null') &&
        (post.lastVerification == null || post.lastVerification.result != TFN(verificationResult))
      )
        return;

      let curJson: any = post.toJSON();
      delete curJson.likes;
      delete curJson.verification;
      delete curJson.lastVerification;
      delete curJson.comments;

      curJson['likesSum'] = post.likes.reduce((p, c) => p + c.value, 0);
      let selfLike = post.likes.filter((like) => like.userId == ctx.state.user.id);
      curJson['selfLikeValue'] = selfLike.length == 0 ? 0 : selfLike[0].value;

      curJson['commentsCount'] = post.comments.length;

      res.push(curJson);
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = res;
  });

  interface PostsPostCtx extends Context {
    state: IJWTState;
    request: IPostsPostReq;
  }
  router.post('/', joiValidatePostsPost, jwt, async (ctx: PostsPostCtx) => {
    if (ctx.request.body.withoutVerification && ctx.state.user.roleName != 'admin') {
      ctx.throw(403, 'You cannot create a post without verification');
    }

    const newPost = await Posts.create({
      title: ctx.request.body.title,
      content: ctx.request.body.content,
      ownerId: ctx.state.user.id,
    });

    if (ctx.request.body.withoutVerification) {
      await PostsVerifications.create({
        postId: newPost.id,
        result: true,
        reason: 'Without verification',
      });
    }

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = {
      id: newPost.id,
    };
  });
}
