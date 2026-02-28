import { z, ZodType } from 'zod';

export function validateSchema<T extends ZodType>(schema: T, data: unknown): z.infer<T> {
  console.log('Validating data:', data);
  
  return schema.parse(data);
}

export function safeValidateSchema<T extends ZodType>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return { success: true, data: result.data };
}

export function parseResponse<T extends ZodType>(schema: T, data: unknown | unknown[]): z.infer<T> | z.infer<T>[] {
  if (Array.isArray(data)) {
    return data.map((item) => schema.parse(item)) as z.infer<T>[];
  }
  return schema.parse(data) as z.infer<T>;
}

export function safeParseResponse<T extends ZodType>(
  schema: T,
  data: unknown | unknown[]
): { success: boolean; data?: z.infer<T> | z.infer<T>[]; error?: any } {
  try {
    if (Array.isArray(data)) {
      const mapped = data.map((item) => schema.parse(item));
      return { success: true, data: mapped };
    }
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error };
  }
}
