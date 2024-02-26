export type OptionType = {
  value: string;
  label: string;
};

export type OptionTypeTram = {
  id: string;
  ten: string;
};

export type OptionTypeUser = {
  id: string;
  email: string;
  ten: string;
};

export interface ResponseInfo<T> {
  elements: T[];
  metadata: { page: number; perPage: number; pageCount: number; total: number };
  status: {
    code: number;
    errors: any;
    success: boolean;
  };
}

export interface PaginatorInfo<T> extends ResponseInfo<T> {}

export interface PaginationQueryOptions {
  size: number;
  page: number;
}

export interface IHead {
  id: string;
  value: string;
  label: string;
  checked?: boolean;
  format?: string;
  type?: string | 'Date' | 'Array' | 'Price';
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  minWidth?: number;
}

export type IHeadGroupColumn = {
  id: string;
  colSpan: number;
  label: string;
};

export type IColumnMapping = {
  [key: string]: string;
};

export type IKeyValuePair = {
  key: string;
  value: OptionTypeTram | null | string;
};
