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
    categoria: select({
      options: [
        { label: 'Soutien', value: 'Soutien' },
        { label: 'Bombacha', value: 'Bombacha' },
        { label: 'Pijama', value: 'Pijama' },
        { label: 'Camison', value: 'Camison' },
        { label: 'Bata', value: 'Bata' },
        { label: 'Camiseta', value: 'Camiseta' },
        { label: 'Boxer', value: 'Boxer' },
        { label: 'Media', value: 'Media' },
      ],
      defaultValue: 'Soutien',
    }),
    stock: relationship({
      ref: 'Stock.producto',
      many: true,
      // ui: {
      //   itemView: { fieldMode: 'hidden' },
      //   listView: { fieldMode: 'hidden' },
      // },
      ui: {
        displayMode: 'cards',
        cardFields: ['color', 'nombreTalle1', 'cantidadTalle1'],
        inlineCreate: {
          fields: [
            'color',
            'nombreTalle1',
            'cantidadTalle1',
            'nombreTalle2',
            'cantidadTalle2',
            'nombreTalle3',
            'cantidadTalle3',
            'nombreTalle4',
            'cantidadTalle4',
            'nombreTalle5',
            'cantidadTalle5',
            'nombreTalle6',
            'cantidadTalle6',
            'nombreTalle7',
            'cantidadTalle7',
          ],
        },
        inlineEdit: {
          fields: [
            'color',
            'nombreTalle1',
            'cantidadTalle1',
            'nombreTalle2',
            'cantidadTalle2',
            'nombreTalle3',
            'cantidadTalle3',
            'nombreTalle4',
            'cantidadTalle4',
            'nombreTalle5',
            'cantidadTalle5',
            'nombreTalle6',
            'cantidadTalle6',
            'nombreTalle7',
            'cantidadTalle7',
          ],
        },
      },
    }),
    marca: relationship({ ref: 'Brand.producto' }),
  },
});
