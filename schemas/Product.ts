import {
  integer,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, permissions, rules } from '../access';

export const Product = list({
  access: {
    create: permissions.canManageProducts,
    read: rules.canReadProducts,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
  },
  ui: {
    hideCreate: (args) => !permissions.canManageProducts(args),
    hideDelete: (args) => !permissions.canManageProducts(args),
  },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return item.articulo;
      },
    }),
    articulo: text({ isRequired: true }),
    nombre: text({ isRequired: true }),
    slug: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        return `${item.nombre
          .split(' ')
          .join('-')
          .toLowerCase()}-${item.articulo.toLowerCase()}`;
      },
    }),
    descripcion: text({ ui: { displayMode: 'textarea' } }),
    imagen: relationship({
      ref: 'ProductImage',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      options: [
        { label: 'Disponible', value: 'DISPONIBLE' },
        { label: 'No Disponible', value: 'NO DISPONIBLE' },
        { label: 'Proximamente', value: 'PROXIMAMENTE' },
      ],
      defaultValue: 'DISPONIBLE',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    precio: integer({ isRequired: true }),
    tipoDePrenda: relationship({ ref: 'TipoDePrenda.producto' }),
    stock: relationship({
      ref: 'Stock',
      many: true,
      ui: {
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    marca: relationship({ ref: 'Brand.producto' }),
  },
});
