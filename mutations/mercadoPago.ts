import { KeystoneContext } from '@keystone-next/types';

import { Session } from '../types';
import mercadopago from 'mercadopago';
const graphql = String.raw;

interface Arguments {
  amount: number;
  id: string;
}

async function mercadoPago(root: any, {}: Arguments, context: KeystoneContext) {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!');
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      nombre
      apellido
      telefono
      email
      cart {
        id
        cantidad
        producto {
          nombre
          articulo
          precio
          descripcion
          id
          imagen {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });

  // 2. calc the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);

  console.log(cartItems);
  const items = cartItems.map((item) => {
    return {
      title: item.producto.nombre,
      unit_price: item.producto.precio,
      quantity: item.cantidad,
    };
  });
  console.log(items);
  mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
  let preference = {
    items,
    back_urls: {
      success: `http://localhost:7777/order/approved-order`,
      pending: `http://localhost:7777/`,
      failure: `http://localhost:7777/`,
    },
    auto_return: 'approved',
  };

  console.log(preference);

  const response = await mercadopago.preferences.create(preference);

  console.log(response.body.init_point);
  return response.body.init_point;

  // 3. create the charge with the stripe library
  // const charge = await stripeConfig.paymentIntents
  //   .create({
  //     amount,
  //     currency: 'USD',
  //     confirm: true,
  //     payment_method: token,
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     throw new Error(err.message);
  //   });
  // console.log(charge);
  // 4. Convert the cartItems to OrderItems
}

export default mercadoPago;
