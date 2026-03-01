import cloudinary from './cloudinary';

export type UploadType = 'cover' | 'avatar';

const folderMap: Record<UploadType, string> = {
  cover: 'books/covers',
  avatar: 'users/avatars',
};

export const uploadImage = async (file: string, type: UploadType) => {
  const folder = folderMap[type];

  return cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'image',
    format: 'webp',
    transformation: [
      {
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
  });
};

export const deleteImage = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });
};
