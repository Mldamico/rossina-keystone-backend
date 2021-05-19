import {
  integer,
  text,
  relationship,
  virtual,
  select,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Brand = list({
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
        return item.marca;
      },
    }),
    marca: text(),
    slug: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return `${item.marca.split(' ').join('-').toLowerCase()}`;
      },
    }),
    tipoDePrenda: relationship({ ref: 'TipoDePrenda', many: true }),
    producto: relationship({ ref: 'Product.marca', many: true }),
  },
});
