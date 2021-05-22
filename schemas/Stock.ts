import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Stock = list({
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver: function (item) {
        console.log(item);
        return item.color;
      },
    }),
    producto: relationship({
      ref: 'Product.stock',
    }),

    color: text({ isRequired: true }),
    // cantidadTalle0: integer({ label: 'Talle 80' }),
    nombreTalle1: text({ label: 'Nombre del talle' }),
    cantidadTalle1: integer({ label: 'Talle 1 | 85 | S' }),
    nombreTalle2: text({ label: 'Nombre del talle' }),
    cantidadTalle2: integer({ label: 'Talle 2 | 90 | M' }),
    nombreTalle3: text({ label: 'Nombre del talle' }),
    cantidadTalle3: integer({ label: 'Talle 3 | 95 | L' }),
    nombreTalle4: text({ label: 'Nombre del talle' }),
    cantidadTalle4: integer({ label: 'Talle 4 | 100 | XL' }),
    nombreTalle5: text({ label: 'Nombre del talle' }),
    cantidadTalle5: integer({ label: 'Talle 5 | 105 | XXL' }),
    nombreTalle6: text({ label: 'Nombre del talle' }),
    cantidadTalle6: integer({ label: 'Talle 6 | 110' }),
    nombreTalle7: text({ label: 'Nombre del talle' }),
    cantidadTalle7: integer({ label: 'Talle 115' }),
  },
});
