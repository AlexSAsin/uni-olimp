const env = process.env;

export const apiUrl =
  env.NODE_ENV === 'development'
    ? env.REACT_APP_DEV_API_URL
    : env.REACT_APP_API_PREFIX;
