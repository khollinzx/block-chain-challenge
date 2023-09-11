import { registerAs } from '@nestjs/config';

/* Please note that the name 'mongo' needs to be unique for each configuration.
 * So, for something like mail, you could use 'mail' or 'mysql' for your MySQL database.
 */
export default registerAs('mongo', () => ({
  uri: process.env.MONGO_URI,
}));
