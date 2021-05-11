import { integer, text, virtual } from '@keystone-next/fields';
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

    color: text({ isRequired: true }),
    cantidadTalle0: integer({ label: 'Talle 80' }),
    cantidadTalle1: integer({ label: 'Talle 1 | 85 | S' }),
    cantidadTalle2: integer({ label: 'Talle 2 | 90 | M' }),
    cantidadTalle3: integer({ label: 'Talle 3 | 95 | L' }),
    cantidadTalle4: integer({ label: 'Talle 4 | 100 | XL' }),
    cantidadTalle5: integer({ label: 'Talle 5 | 105 | XXL' }),
    cantidadTalle6: integer({ label: 'Talle 6 | 110' }),
    cantidadTalle7: integer({ label: 'Talle 115' }),
  },
});
