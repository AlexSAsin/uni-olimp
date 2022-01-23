import { Context, DefaultState, Next } from 'koa';
import koaJwt from 'koa-jwt';
import compose from 'koa-compose';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import { IAuthReq } from './joi-users';

import Users from '../db/models/Users.model';

// validate jwt tocken
export const jwt = koaJwt({
  secret: process.env.JWT_SECRET_KEY,
  debug: true,
});

// apply requestor's user model to context state
const setUser2CtxByJWT = async (ctx: Context, next: Next) => {
  const userModel = await Users.findOne({
    where: {
      login: ctx.state.user.login,
    },
  });

  if (userModel == null) {
    ctx.throw(401, "Token isn't valid");
  }

  ctx.state.userModel = userModel;
  await next();
};

interface AuthContext extends Context {
  request: IAuthReq;
}
// sign tocken with users attributes
export async function signTocken(ctx: AuthContext) {
  // get requestor's user model
  const user = await Users.findOne({
    attributes: ['id', 'password', 'login', 'roleName'],
    where: {
      login: ctx.request.body.login,
    },
  });

  // checking if user exists
  if (user === null) {
    ctx.throw(401, 'Login not found');
  }

  // checking if entered requestor's password equal to his model
  if (!bcrypt.compareSync(ctx.request.body.password, user.password)) {
    ctx.throw(401, 'Password is incorrect');
  } else {
    const jsonUser: any = await user.toJSON();
    delete jsonUser.password;
    ctx.status = 200;
    ctx.body = {
      token: jsonwebtoken.sign(jsonUser, process.env.JWT_SECRET_KEY),
    };
  }

  return ctx;
}

export const jwtWithSetUserModel = compose([jwt, setUser2CtxByJWT]);

// interfaces for expanding context

export interface IJWTState extends DefaultState {
  user: {
    iat: number;
    id: number;
    login: string;
    roleName: string;
  };
}

export interface IJWTWithUserModelState extends IJWTState {
  userModel: Users;
}
