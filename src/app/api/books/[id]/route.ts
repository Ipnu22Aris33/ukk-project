import { eq, and, isNull } from 'drizzle-orm';
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { slugify } from '@/lib/utils/slugify';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { bookResponseSchema, updateBookSchema } from '@/lib/schema/book';

/* ======================================================
   GET /api/books/[id]
====================================================== */
export const GET = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  if (!id || isNaN(id)) {
    throw new NotFound('Invalid book ID');
  }

  const book = await db.query.books.findFirst({
    where: and(eq(books.id, id), isNull(books.deletedAt)),
  });

  if (!book) {
    throw new NotFound('Book not found');
  }

  return ok(safeParseResponse(bookResponseSchema, book).data, { message: 'Book retrieved successfully' });
});

/* ======================================================
   PATCH /api/books/[id]
====================================================== */
export const PATCH = handleApi(async ({ req, params }) => {
  const id = Number(params?.id);
  if (!id || isNaN(id)) throw new BadRequest('ID Buku tidak valid');

  const body = await req.json();
  const data = validateSchema(updateBookSchema, body);

  const existing = await db.query.books.findFirst({
    where: and(eq(books.id, id), isNull(books.deletedAt)),
  });

  if (!existing) throw new NotFound('Buku tidak ditemukan');

  // Deklarasi konstanta untuk logika sinkronisasi
  const finalTotal = data.totalStock ?? existing.totalStock;
  const requestedAvailable = data.availableStock ?? existing.availableStock;

  // Pastikan available tidak melebihi total yang baru
  const finalAvailable = Math.min(requestedAvailable, finalTotal);

  const [updated] = await db
    .update(books)
    .set({
      ...data,
      totalStock: finalTotal,
      availableStock: finalAvailable,
      slug: data.title ? slugify(data.title) : existing.slug,
      updatedAt: new Date(),
    })
    .where(eq(books.id, id))
    .returning();

  return ok(safeParseResponse(bookResponseSchema, updated).data, { message: 'Buku berhasil diperbarui' });
});

/* ======================================================
   DELETE /api/books/[id]
====================================================== */
export const DELETE = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  if (!id || isNaN(id)) {
    throw new BadRequest('Invalid book ID');
  }

  const [deleted] = await db
    .update(books)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(books.id, id))
    .returning();

  if (!deleted) {
    throw new NotFound('Book not found');
  }

  return ok(null, { message: 'Book deleted successfully (soft delete)' });
});
