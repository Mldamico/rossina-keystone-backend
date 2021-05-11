import { integer, text, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return item.total;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.orden', many: true }),
    usuario: relationship({ ref: 'User.ordenes' }),
    charge: integer(), //Revisar esto luego
  },
});
