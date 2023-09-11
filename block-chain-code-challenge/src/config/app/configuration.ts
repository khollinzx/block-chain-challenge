import { registerAs } from '@nestjs/config';
import * as process from "process";

/* Please note that the name 'app' needs to be unique for each configuration.
 * So, for something like mail, you could use 'mail' or 'mongo' for your mongoDB database.
 */
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  workers: process.env.APP_WORKERS,
  saltOrRounds: process.env.JWT_SALT,
  jwtSecret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
  jwtExpTime: process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
}));
