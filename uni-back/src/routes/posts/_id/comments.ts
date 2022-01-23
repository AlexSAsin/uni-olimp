// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwt } from '../../../middlewares/jwt';

import { ICommentsPostReq, joiValidateCommentsPost } from '../../../middlewares/joi-comments';
import Posts from '../../../db/models/Posts.model';
import Alerts from '../../../db/models/Alerts.model';
import Comments from '../../../db/models/Comments.model';

export default function registerRoute(router: Router) {
  interface CommentsPostCtx extends Context {
    state: IJWTState;
    request: ICommentsPostReq;
  }
  router.post('/', joiValidateCommentsPost, jwt, async (ctx: CommentsPostCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    const curPost = await Posts.findByPk(postId);

    if (curPost == null) {
      ctx.throw(404, 'Post not Found');
    }

    const parentComment =
      ctx.request.body.parentCommentId === undefined ? null : await Comments.findByPk(ctx.request.body.parentCommentId);

    if (ctx.request.body.parentCommentId !== undefined && parentComment == null) {
      ctx.throw(404, 'Parent comment not Found');
    }

    const newComment = await Comments.create({
      postId: postId,
      ownerId: ctx.state.user.id,
      content: ctx.request.body.content,
      parentCommentId: ctx.request.body.parentCommentId,
    });

    const newCommentScoped = await Comments.scope('detail').findByPk(newComment.id);
    const resComments: any = newCommentScoped.toJSON();
    resComments['childsCommentsCount'] = newCommentScoped.childsComments.length;
    delete resComments.childsComments;

    if (ctx.request.body.parentCommentId !== undefined) {
      await Alerts.create({
        title: 'Your comment has been commented',
        level: 'info',
        postId: postId,
        userId: parentComment.owner.id,
        comment1Id: ctx.request.body.parentCommentId,
        comment2Id: newCommentScoped.id,
      });
    } else {
      await Alerts.create({
        title: 'Your post has been commented',
        level: 'info',
        userId: curPost.ownerId,
        postId: postId,
        comment1Id: newCommentScoped.id,
      });
    }

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = resComments;
  });

  interface CommentsGetCtx extends Context {
    state: IJWTState;
  }
  router.get('/', jwt, async (ctx: CommentsGetCtx) => {
    const postId: number = parseInt(ctx.params.id);
    if (postId == null || isNaN(postId)) {
      ctx.throw(400, 'Id must be number');
    }

    if ((await Posts.findByPk(postId)) == null) {
      ctx.throw(404, 'Post not Found');
    }

    const curComments = await Comments.scope('detail').findAll({
      where: {
        postId: postId,
        parentCommentId: null,
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
