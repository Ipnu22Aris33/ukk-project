// lib/utils/parseQuery.ts
export function parseQuery(url: URL) {
  const rawPage = Number(url.searchParams.get('page'));
  const rawLimit = Number(url.searchParams.get('limit'));
  const rawSearch = url.searchParams.get('search');
  const rawOrderBy = url.searchParams.get('orderBy');
  const rawOrderDir = url.searchParams.get('orderDir');
  
  // Generic filters
  const rawStatus = url.searchParams.get('status');
  const rawFromDate = url.searchParams.get('fromDate');
  const rawToDate = url.searchParams.get('toDate');
  const rawMemberId = url.searchParams.get('memberId');
  const rawBookId = url.searchParams.get('bookId');
  const rawUserId = url.searchParams.get('userId');

  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 10;
  const orderDir: 'asc' | 'desc' = rawOrderDir === 'asc' || rawOrderDir === 'desc' ? rawOrderDir : 'desc';

  return {
    page,
    limit,
    search: rawSearch?.trim() || undefined,
    orderBy: rawOrderBy || undefined,
    orderDir,
    
    filters: {
      status: rawStatus || undefined,
      fromDate: rawFromDate || undefined,
      toDate: rawToDate || undefined,
      memberId: rawMemberId ? Number(rawMemberId) : undefined,
      bookId: rawBookId ? Number(rawBookId) : undefined,
      userId: rawUserId ? Number(rawUserId) : undefined,
    }
  };
}