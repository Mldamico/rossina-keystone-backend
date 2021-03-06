import { password, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    delete: permissions.canManageUsers,
  },
  ui: {
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  fields: {
    nombre: text({ isRequired: true }),
    apellido: text(),
    telefono: text(),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    rol: relationship({ ref: 'Role.asignado' }),
    cart: relationship({ ref: 'CartItem.usuario', many: true }),
    ordenes: relationship({ ref: 'Order.usuario', many: true }),
  },
});
