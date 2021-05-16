import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import 'dotenv/config';
// import { lists } from './schema';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { Stock } from './schemas/Stock';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { CartItem } from './schemas/CartItem';

let sessionSecret = process.env.SESSION_SECRET;
const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['nombre', 'email', 'password'],
  },
});

export default auth.withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: process.env.DATABASE_URL
      ? {
          provider: 'postgresql',
          url: process.env.DATABASE_URL,
          enableLogging: true,
        }
      : {
          provider: 'sqlite',
          url: databaseURL,
        },

    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists: createSchema({
      User,
      Product,
      ProductImage,
      Stock,
      Role,
      OrderItem,
      CartItem,
      Order,
    }),

    session: withItemData(
      statelessSessions({
        maxAge: sessionMaxAge,
        secret: sessionSecret,
      }),
      { User: `id nombre email rol { ${permissionsList.join(' ')} }` }
    ),
  })
);
