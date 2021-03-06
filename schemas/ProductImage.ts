import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import 'dotenv/config';
import { permissions } from '../access';
export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  apiKey: process.env.CLOUDINARY_KEY!,
  apiSecret: process.env.CLOUDINARY_SECRET!,
  folder: 'rossina',
};

export const ProductImage = list({
  access: {
    create: permissions.canManageProducts,
    read: () => true,
    update: permissions.canManageProducts,
    delete: permissions.canManageProducts,
  },
  fields: {
    image: cloudinaryImage({ cloudinary, label: 'Source' }),
    altText: text(),
  },
  ui: {
    listView: {
      initialColumns: ['image', 'altText'],
    },
  },
});
