import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  CartItemsUpdateInput,
} from '../node_modules/.keystone/types';
import { Session } from '../types';
import { CartItem } from '../schemas/CartItem';

async function addToCart(
  _root: unknown,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  const sesh = context.session as Session;

  if (!sesh.itemId) {
    throw new Error('Tenes que estar logueado para realizar esta accion.');
  }

  type AllCartItems = CartItemCreateInput[] & CartItemsUpdateInput[];

  const allCartItems = (await context.lists.CartItem.findMany({
    where: {
      user: {
        id: sesh.itemId,
      },
      product: {
        id: productId,
      },
    },
    resolveFields: 'id,cantidad',
  })) as AllCartItems;

  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    return context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { cantidad: existingCartItem.cantidad + 1 },
      resolveFields: false,
    });
  }

  return context.lists.CartItem.createOne({
    data: {
      product: {
        connect: { id: productId },
      },
      user: {
        connect: { id: sesh.itemId },
      },
    },
    resolveFields: 'id,cantidad',
  });
}

export default addToCart;
