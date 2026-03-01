import { handleApi } from '@/lib/utils/handleApi';
import { uploadImage, deleteImage, UploadType } from '@/lib/upload/service';
import { ok } from '@/lib/utils/apiResponse';
import { BadRequest } from '@/lib/utils/httpErrors';

export const POST = handleApi(async ({ req }) => {
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const type = formData.get('type') as UploadType;

  if (!file || !type) {
    throw new BadRequest('File and type are required');
  }

  // Convert File → buffer → base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await uploadImage(base64, type);

  return ok({
    url: result.secure_url,
    publicId: result.public_id,
  });
});
export const DELETE = handleApi(async ({ req }) => {
  const body = await req.json();
  const { publicId } = body;

  if (!publicId) throw new BadRequest('Public ID is required');

  await deleteImage(publicId);

  return ok(null, { message: 'Image deleted successfully' });
});
