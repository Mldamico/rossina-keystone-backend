import { integer, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
  ui: {
    listView: {
      initialColumns: ['producto', 'cantidad', 'usuario'],
    },
  },
  fields: {
    cantidad: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    colorSeleccionado: text(),
    talleSeleccionado: text(),
    producto: relationship({ ref: 'Product' }),
    usuario: relationship({ ref: 'User.cart' }),
  },
});
