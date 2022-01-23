const DB_CONFIG = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT,
  migrationStorageTableName: '_migrations_',
  define: {
    schema: 'public',
    underscored: true,
  },
  seederStorageTableName: '_seeders_',
  seederStorage: 'sequelize',
  logging: false,
};

// enable logging queries
const DB_DEV_CONFIG = {
  ...DB_CONFIG,
  logging: true,
};

module.exports = {
  development: DB_DEV_CONFIG,
  test: DB_CONFIG,
  production: DB_CONFIG,
};
