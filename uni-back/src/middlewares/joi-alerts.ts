import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { Context, Request } from 'koa';
const validateMiddleware = require('koa-joi-validate-middleware');

const alert = {
  viewed: Joi.boolean(),
};

// вынести в отдельную функцию
// call on validation error
function errorCallback(ctx: Context, error: Joi.ValidationError) {
  ctx.throw(400, error.message);
}

const alertsIdPatch = {
  body: Joi.object({
    viewed: alert.viewed,
  }).required(),
};

export const joiValidateAlertsIdPatch = validateMiddleware.create(alertsIdPatch, errorCallback);
type AlertsIdPatchType = Joi.extractType<typeof alertsIdPatch>;
export interface IAlertsIdPatchReq extends Request {
  body?: AlertsIdPatchType['body'];
}
