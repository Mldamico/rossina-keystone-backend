import { KeystoneContext } from '@keystone-next/types';
import { OrderCreateInput } from '../node_modules/.keystone/types';

const graphql = String.raw;

interface Arguments {
  amount: number;
  id: string;
}

async function checkout(
  root: any,
  { amount, id }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  console.log(amount);
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
  const cartItems = user.cart.filter((cartItem) => cartItem.producto);

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
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      nombre: cartItem.producto.nombre,
      descripcion: cartItem.producto.descripcion,
      precio: cartItem.producto.precio,
      cantidad: cartItem.cantidad,
      imagen: { connect: { id: cartItem.producto.imagen.id } },
    };
    return orderItem;
  });
  console.log(orderItems);
  console.log('gonna create the order');
  // 5. Create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: amount,
      charge: id,
      items: { create: orderItems },
      usuario: { connect: { id: userId } },
    },
    resolveFields: false,
  });
  // 6. Clean up any old cart item
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  console.log('finishing removing items');
  return order;
}

export default checkout;
