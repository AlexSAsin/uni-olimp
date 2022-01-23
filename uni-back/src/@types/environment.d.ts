declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';

      PORT: string;
      ROUTES_PREFIX: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DIALECT: string;

      JWT_SECRET_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
