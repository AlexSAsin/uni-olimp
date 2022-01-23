import Koa from 'koa';
import Router from 'koa-router';
import requireDir from 'require-dir';
import urljoin from 'url-join';
import error from 'koa-json-error';

interface RouteConfig {
  prefix: string;
}

interface Context {
  app: Koa;
}

interface Dir {
  [path: string]: any;
}

export default function registerRoutes(ctx: Context, router: Router) {
  const { app } = ctx;

  app.use(
    error({
      postFormat: (err, formattedError) => {
        return {
          // Copy some attributes from the original error
          status: formattedError?.status,
          message: err.message,
          // ...or add some custom ones
          success: false,
          reason: 'Unexpected',
        };
      },
    }),
  );

  const dir = requireDir('./', { recurse: true });
  registerDir(dir, ctx, {
    prefix: process.env.ROUTES_PREFIX,
  });

  // fix infinite load if request path doesn't exist
  router.all('(.*)', (koaContext) => {
    koaContext.throw(404);
  });

  app.use(router.routes());
}

function registerDir(dir: Dir, ctx: Context, config: RouteConfig) {
  const { app } = ctx;
  Object.keys(dir).forEach((key) => {
    let routePrefix = urljoin(config.prefix, key);
    if (routePrefix.endsWith('/index')) {
      routePrefix = routePrefix.slice(0, -'/index'.length);
    }
    const router = new Router({ prefix: routePrefix });
    const required = dir[key];

    if (required.default !== undefined && typeof required.default === 'function') {
      required.default(router);
      console.info('route added: ', routePrefix);
      app.use(router.routes());
      return;
    }
    if (typeof required === 'object') {
      registerDir(required, ctx, {
        prefix: routePrefix,
      });
      return;
    }
    throw new Error(`route file is incorrect: ${routePrefix}`);
  });
}
