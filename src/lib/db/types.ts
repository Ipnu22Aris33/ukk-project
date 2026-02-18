export type JoinOperator = '=' | '>' | '<' | '>=' | '<=';

export type JoinOption = {
  type?: 'INNER' | 'LEFT' | 'RIGHT';
  table: string;
  alias?: string;
  on: {
    left: string;
    operator?: JoinOperator;
    right: string;
  };
};

export type ComparisonOperator = '=' | '>' | '<' | '>=' | '<=' | 'ILIKE';

export type WhereOption =
  | {
      column: string;
      operator?: ComparisonOperator;
      value?: any;
      isNull?: true;
      isNotNull?: true;
    }
  | {
      AND: WhereOption[];
    }
  | {
      OR: WhereOption[];
    };

export type PaginateOption = {
  page?: number;
  limit?: number;
  select?: string | string[];
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  where?: WhereOption;
  joins?: JoinOption[];
  search?: string;
  searchable?: string[];
  sortable?: string[];
};

export type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    search: string | null;
    orderBy: string;
    orderDir: string;
  };
};

export type BulkInsertOption = {
  chunkSize?: number;
  conflictColumn?: string;
  ignoreDuplicates?: boolean;
};
