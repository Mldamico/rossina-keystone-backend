import { integer, text, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const TipoDePrenda = list({
  // access: {
  //   create: isSignedIn,
  //   read: rules.canOrder,
  //   update: () => false,
  //   delete: () => false,
  // },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return item.tipo;
      },
    }),
    tipo: text(),
    slug: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return `${item.tipo.split(' ').join('-').toLowerCase()}`;
      },
    }),
    producto: relationship({ ref: 'Product.tipoDePrenda', many: true }),
  },
});
