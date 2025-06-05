export interface ResultWithOutData {
  isErr: boolean;
}

export type Result<TData, TError> =
  | ({
      isErr: false;
      data: TData;
    } & ResultWithOutData)
  | ({
      isErr: true;
      error: TError;
    } & ResultWithOutData);

export function Ok<TData, TError>(data: TData): Result<TData, TError> {
  return {
    isErr: false,
    data,
  };
}

export function Err<TData, TError>(error: TError): Result<TData, TError> {
  return {
    isErr: true,
    error,
  };
}
