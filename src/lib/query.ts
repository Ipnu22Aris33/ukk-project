export function parseQuery(url: URL) {
  const orderDir = url.searchParams.get('orderDir');
  return {
    page: Number(url.searchParams.get('page') || 1),
    limit: Number(url.searchParams.get('limit') || 10),
    search: url.searchParams.get('search') || undefined,
    orderBy: url.searchParams.get('orderBy') || undefined,
    orderDir: orderDir === 'asc' || orderDir === 'desc' 
      ? (orderDir as 'asc' | 'desc') 
      : undefined,
  };
}