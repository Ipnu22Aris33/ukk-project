export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: unknown };

export async function run<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return { ok: false, error };
  }
}
