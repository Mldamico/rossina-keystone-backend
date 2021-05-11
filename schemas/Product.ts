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
        return item.nombre.split(' ').join('-').toLowerCase();
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
    tipoDePrenda: select({
      options: [
        { label: 'Corseteria', value: 'Corseteria' },
        { label: 'Lenceria', value: 'Lenceria' },
      ],
    }),
    stock: relationship({
      ref: 'Stock',
      many: true,
      ui: {
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    marca: select({
      options: [
        { label: 'Selu', value: 'Selu' },
        { label: 'Mora', value: 'Mora' },
        { label: 'Mc Cartney', value: 'Mc Cartney' },
        { label: 'Peter Pan', value: 'Peter Pan' },
        { label: 'Silvana', value: 'Silvana' },
        { label: 'Giordana', value: 'Giordana' },
        { label: 'Promesse', value: 'Promesse' },
        { label: 'Arlen', value: 'Arlen' },
        { label: 'Puedo Querer', value: 'Puedo Querer' },
        { label: 'Cecil', value: 'Cecil' },
        { label: 'Delledonne', value: 'Delledonne' },
        { label: 'Deville', value: 'Deville' },
        { label: 'Perlea', value: 'Perlea' },
      ],
      defaultValue: 'Selu',
    }),
  },
});
