require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database/development.sqlite',
    migrationStorageTableName: 'sequelize_meta',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: './database/test.sqlite',
    migrationStorageTableName: 'sequelize_meta',
    logging: false,
  },
  production: {
    use_env_variable: 'DB_HOST',
    dialect: process.env.DATABASE_DIALECT,
    dialectModule: require('pg'),
    dialectOptions: {
      ssl: true,
    },
    migrationStorageTableName: 'sequelize_meta',
    logging: false,
  },
};
