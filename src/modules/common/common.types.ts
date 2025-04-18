export namespace CommonTypes {
  export type PaginatedQuery = {
    pageSize: number;
    pageToken: string;
  };

  export type PaginatedResult<T> = {
    pageToken: string | undefined;
    results: T[];
  };
}
