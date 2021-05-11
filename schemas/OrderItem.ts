import {
  integer,
  select,
  text,
  relationship,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const OrderItem = list({
  access: {
    create: isSignedIn,
    read: rules.canManageOrderItems,
    update: () => false,
    delete: () => false,
  },
  fields: {
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
    talle: text({ isRequired: true }),
    color: text({ isRequired: true }),
    cantidad: integer({ isRequired: true }),
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
    orden: relationship({ ref: 'Order.items' }),
  },
});
