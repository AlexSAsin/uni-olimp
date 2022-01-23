import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import registerRoutes from './routes';
import Router from 'koa-router';
import { initDatabase } from './db';
import cors from '@koa/cors';

let formater = (formatter: string, ...args: (number | string)[]): string => {
  return args
    .reduce((p: string, c: string | number) => (c == undefined ? p : p.replace(/%s/, c.toString())), formatter)
    .toString();
};

export async function createApp() {
  const app = new Koa();

  console.log(process.env);

  /** Init Database */
  await initDatabase();

  /** Middlewares */
  app.use(json());

  if (process.env.NODE_ENV == 'development') {
    app.use(
      logger({
        transporter: (str, args: [string, string, string, number, string, string]) => {
          let [format, method, url, status, time, length] = args;

          // format date
          let date_ob = new Date();
          let hours = ('0' + date_ob.getHours()).slice(-2);
          let minutes = ('0' + date_ob.getMinutes()).slice(-2);
          let seconds = ('0' + date_ob.getSeconds()).slice(-2);
          let curTimeStr = `${hours}:${minutes}:${seconds}`;

          // log
          format = '\x1B[34m[%s]:\x1B[39m ' + format;
          console.log(formater(format, curTimeStr, method, url, status, time, length));
        },
      }),
    );

    app.use(
      cors({
        origin: '*',
      }),
    );
  }

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(ctx.request);
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        message: err.message,
        errors: err.errors ?? [],
      };
    }
  });

  /** Routes */
  const router = new Router();
  registerRoutes({ app }, router);

  return app;
}

export default async function main() {
  const app = await createApp();
  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT);
  console.info(`Server started: http://localhost:${PORT}`);
  await new Promise((resolve) => process.on('SIGINT', resolve));
  return 0;
}

if (require.main === module) {
  main()
    .then((code) => {
      process.exit(code);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
