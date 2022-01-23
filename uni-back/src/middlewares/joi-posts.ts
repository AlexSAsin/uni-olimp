import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const post = {
  id: Joi.number().min(1),
  title: Joi.string().min(5).max(50),
  content: Joi.string().min(3),
  result: Joi.boolean(),
  withoutVerification: Joi.boolean().default(false),
  query: {
    verificationResult: Joi.string().valid('true', 'false', 'null'),
  },
  like: {
    value: Joi.number().valid(-1, 1),
  },
};
// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const postsPost = {
  body: Joi.object({
    title: post.title.required(),
    content: post.content.required(),
    withoutVerification: post.withoutVerification,
  }).required(),
};

export const joiValidatePostsPost = validateMiddleware.create(postsPost, errorCallback);
type PostsPostType = Joi.extractType<typeof postsPost>;
export interface IPostsPostReq extends Request {
  body?: PostsPostType['body'];
}

const postsGet = {
  query: {
    verificationResult: post.query.verificationResult.required(),
  },
};

export const joiValidatePostsGet = validateMiddleware.create(postsGet, errorCallback);
export type PostsGetQueryType = Joi.extractType<typeof postsGet['query']>;

const postPatchVerificataion = {
  body: Joi.object({
    result: post.result.required(),
    reason: Joi.string(),
  }),
};

export const joiValidatePostPatchVerificataion = validateMiddleware.create(postPatchVerificataion, errorCallback);
type PostPatchVerificataionType = Joi.extractType<typeof postPatchVerificataion>;
export interface IPostPatchVerificataionReq extends Request {
  body?: PostPatchVerificataionType['body'];
}

const postPostLike = {
  body: Joi.object({
    value: post.like.value.required(),
  }),
};

export const joiValidatePostPostLike = validateMiddleware.create(postPostLike, errorCallback);
type PostPostLikeType = Joi.extractType<typeof postPostLike>;
export interface IPostPostLikeReq extends Request {
  body?: PostPostLikeType['body'];
}
