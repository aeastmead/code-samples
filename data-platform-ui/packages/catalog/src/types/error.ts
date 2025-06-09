export interface IError<TCause extends Record<string, any> = Record<string, any>> {
  readonly isUIError: boolean;
  readonly type: UIErrorType;
  readonly message: string;
  readonly cause?: TCause | string | undefined;
}

export enum UIErrorType {
  NOT_FOUND = 'UIError/NotFound',
  API = 'UIError/APIError',
  API_SAVE = 'UIError/APISaveError',
  RESOURCE_VERIFY_ERROR = 'UIError/ResourceVerifyError'
}
