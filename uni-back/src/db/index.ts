import { Sequelize } from 'sequelize-typescript';
import configs from './db.config';

const DB_CONFIG = configs[process.env.NODE_ENV];

const sequelize = new Sequelize(DB_CONFIG);

export async function initDatabase() {
  await sequelize.authenticate();
  sequelize.addModels([__dirname + '/**/*.model.ts', __dirname + '/**/*.model.js']);
}

export default sequelize;
