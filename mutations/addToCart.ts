import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  CartItemsUpdateInput,
} from '../node_modules/.keystone/types';
import { Session } from '../types';
import { CartItem } from '../schemas/CartItem';

async function addToCart(
  _root: unknown,
  {
    productId,
    color,
    talle,
  }: { productId: string; color: string; talle: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  const sesh = context.session as Session;

  if (!sesh.itemId) {
    throw new Error('Tenes que estar logueado para realizar esta accion.');
  }

  type AllCartItems = CartItemCreateInput[] & CartItemsUpdateInput[];

  const allCartItems = (await context.lists.CartItem.findMany({
    where: {
      usuario: {
        id: sesh.itemId,
      },
      producto: {
        id: productId,
      },
    },
    resolveFields: 'id,cantidad,talleSeleccionado, colorSeleccionado',
  })) as AllCartItems;

  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    if (existingCartItem.cantidad > 2) {
      return;
    }
    return context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        cantidad: existingCartItem.cantidad + 1,
      },
      resolveFields: false,
    });
  }

  return context.lists.CartItem.createOne({
    data: {
      producto: {
        connect: { id: productId },
      },
      usuario: {
        connect: { id: sesh.itemId },
      },
      talleSeleccionado: talle,
      colorSeleccionado: color,
    },
    resolveFields: 'id,cantidad, colorSeleccionado, talleSeleccionado',
  });
}

export default addToCart;
