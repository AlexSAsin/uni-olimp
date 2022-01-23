import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const user = {
  id: Joi.number().min(1),
  login: Joi.string().min(5).max(30),
  password: Joi.string().min(3).max(30),
  roleName: Joi.number().min(1).max(3),
};

// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const auth = {
  body: Joi.object({
    login: user.login.required(),
    password: user.password.required(),
  }).required(),
};

export const joiValidateAuth = validateMiddleware.create(auth, errorCallback);
type AuthType = Joi.extractType<typeof auth>;
export interface IAuthReq extends Request {
  body?: AuthType['body'];
}
