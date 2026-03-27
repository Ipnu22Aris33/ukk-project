// lib/utils/parseQuery.ts

type FilterType = 'string' | 'number';

type ParseQueryOptions = {
  filters?: Record<string, FilterType>;
};

export function parseQuery(url: URL, options?: ParseQueryOptions) {
  const rawPage = Number(url.searchParams.get('page'));
  const rawLimit = Number(url.searchParams.get('limit'));
  const rawSearch = url.searchParams.get('search');
  const rawOrderBy = url.searchParams.get('orderBy');
  const rawOrderDir = url.searchParams.get('orderDir');

  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 10;
  const orderDir: 'asc' | 'desc' =
    rawOrderDir === 'asc' || rawOrderDir === 'desc' ? rawOrderDir : 'desc';

  // 🔥 helper parser
  const parseMulti = (value: string, type: FilterType) => {
    const arr = value.split(',').map(v => v.trim()).filter(Boolean);

    if (type === 'number') {
      return arr.map(v => Number(v)).filter(v => !Number.isNaN(v));
    }

    return arr;
  };

  // 🔥 dynamic filters
  const filters: Record<string, any> = {};

  if (options?.filters) {
    for (const key in options.filters) {
      const value = url.searchParams.get(key);
      if (!value) continue;

      filters[key] = parseMulti(value, options.filters[key]);
    }
  }

  return {
    page,
    limit,
    search: rawSearch?.trim() || undefined,
    orderBy: rawOrderBy || undefined,
    orderDir,
    filters,
  };
}