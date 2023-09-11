import { registerAs } from '@nestjs/config';

/* Please note that the name 'mongo' needs to be unique for each configuration.
 * So, for something like mail, you could use 'mail' or 'mysql' for your MySQL database.
 */
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  prefix: process.env.REDIS_PREFIX,
  ttl: process.env.REDIS_TTL,
}));
