import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(__dirname, './src/lib/prisma/.env'),
});

export default {
  schema: './src/lib/prisma/schema.prisma',
};
