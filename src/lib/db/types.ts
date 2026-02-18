export type JoinOperator = '=' | '>' | '<' | '>=' | '<=';

export type JoinOnCondition = {
  left: string;
  operator?: JoinOperator;
  right: string;
};

export type JoinOnOption = JoinOnCondition | { AND: JoinOnOption[] } | { OR: JoinOnOption[] };

export type JoinOption = {
  type?: 'INNER' | 'LEFT' | 'RIGHT';
  table: string;
  alias?: string;
  on: JoinOnOption;
};

export type CountOptions = {
  joins?: JoinOption[];
};

export type ComparisonOperator = '=' | '>' | '<' | '>=' | '<=' | 'ILIKE';

export type WhereOption =
  | {
      column: string;
      operator?: ComparisonOperator;
      value?: any;
      isNull?: boolean;
      isNotNull?: boolean;
    }
  | {
      AND: WhereOption[];
    }
  | {
      OR: WhereOption[];
    };

export type QueryOptions = {
  select?: string | string[];
  joins?: JoinOption[];
  orderBy?: string;
  limit?: number;
  offset?: number;
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
