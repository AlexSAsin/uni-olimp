import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const comment = {
  id: Joi.number().min(1),
  postId: Joi.number().min(1),
  content: Joi.string().min(3),
  query: {
    verificationResult: Joi.string().valid('true', 'false', 'null'),
  },
};
// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const commentsPost = {
  body: Joi.object({
    content: comment.content.required(),
    parentCommentId: comment.id,
  }).required(),
};

export const joiValidateCommentsPost = validateMiddleware.create(commentsPost, errorCallback);
type CommentsPostType = Joi.extractType<typeof commentsPost>;
export interface ICommentsPostReq extends Request {
  body?: CommentsPostType['body'];
}

const commentsChildsDelete = {
  body: Joi.object({
    reason: Joi.string().required(),
  }).required(),
};

export const joiValidateCommentsChildsDelete = validateMiddleware.create(commentsChildsDelete, errorCallback);
type CommentsChildsDeleteType = Joi.extractType<typeof commentsChildsDelete>;
export interface ICommentsChildsDeleteReq extends Request {
  body?: CommentsChildsDeleteType['body'];
}

const commentsDelete = {
  query: {
    reason: Joi.string().required(),
  },
};

export const joiValidateCommentsDelete = validateMiddleware.create(commentsDelete, errorCallback);
export type CommentsDeleteQueryType = Joi.extractType<typeof commentsDelete['query']>;
