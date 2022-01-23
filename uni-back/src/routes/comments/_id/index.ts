// import { number } from 'joi';
import { Context } from 'koa';
import Router from 'koa-router';

import { IJWTState, jwt } from '../../../middlewares/jwt';

import {
  CommentsDeleteQueryType,
  ICommentsChildsDeleteReq,
  joiValidateCommentsDelete,
} from '../../../middlewares/joi-comments';
import Posts from '../../../db/models/Posts.model';
import Comments from '../../../db/models/Comments.model';
import Alerts from '../../../db/models/Alerts.model';

const recurseAlertAndDeleteChilds4Comment = async (parent: Comments): Promise<void> => {
  const childs = await Comments.findAll({
    where: {
      parentCommentId: parent.id,
    },
  });

  for (let child of childs) {
    await Alerts.create({
      title: 'Comment has been deleted',
      level: 'error',
      reason: 'Parent comment has been deleted',
      userId: child.owner.id,
      postId: child.postId,
      comment1Id: child.id,
    });

    await recurseAlertAndDeleteChilds4Comment(child);

    await child.destroy();
  }
};

export default function registerRoute(router: Router) {
  interface CommentsDeleteCtx extends Context {
    state: IJWTState;
  }
  router.delete('/', joiValidateCommentsDelete, jwt, async (ctx: CommentsDeleteCtx) => {
    const commentId: number = parseInt(ctx.params.id);
    const reason = (ctx.request.query as CommentsDeleteQueryType).reason;

    if (commentId == null || isNaN(commentId)) {
      ctx.throw(400, 'Id must be number');
    }

    const comment2delete = await Comments.findByPk(commentId);

    if (comment2delete == null) {
      ctx.throw(404, 'Comment not Found');
    }

    await Alerts.create({
      title: 'Comment has been deleted',
      level: 'error',
      reason: reason,
      userId: comment2delete.owner.id,
      postId: comment2delete.postId,
      comment1Id: comment2delete.id,
    });

    await recurseAlertAndDeleteChilds4Comment(comment2delete);

    await comment2delete.destroy();

    ctx.status = 200;
  });

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
