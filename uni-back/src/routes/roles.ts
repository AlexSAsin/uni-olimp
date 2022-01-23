// import { number } from 'joi';
import Router from 'koa-router';

import UserRoles from '../db/models/UserRoles.model';

export default function registerRoute(router: Router) {
  // list of users roles {id: number, name:string}[]
  router.get('/', async (ctx) => {
    const roles = await UserRoles.findAll({
      order: ['id'],
    });

    ctx.status = 200;
    ctx.type = 'json';
    ctx.body = roles;
  });
}
