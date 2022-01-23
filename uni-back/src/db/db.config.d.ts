import { Options } from 'sequelize';

type Configs = {
  [k in typeof process.env.NODE_ENV]: Options;
};

declare const configs: Configs;
export default configs;
