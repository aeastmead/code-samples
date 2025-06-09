import util from 'util';
import { IError, IResourceFailedVerification, UIErrorType } from '../types';

export default abstract class ErrorsUtil {
  /**
   * Builds not found error
   * @param {string} message
   * @param msgParams
   * @return {IError}
   */
  public static entityNotFound<T extends Record<string, any> = Record<string, any>>(
    message: string,
    ...msgParams: any[]
  ): IError<T> {
    const msg: string = util.format(message, ...msgParams);
    return {
      isUIError: true,
      type: UIErrorType.NOT_FOUND,
      message: msg
    };
  }

  public static apiErrorWithCause<T extends Record<string, any> = Record<string, any>>(
    cause: any | undefined,
    message: string,
    ...msgParams: any[]
  ): IError<T> {
    const msg: string = util.format(message, ...msgParams);
    return {
      isUIError: true,
      type: UIErrorType.API,
      message: msg,
      cause
    };
  }

  public static apiError<T extends Record<string, any> = Record<string, any>>(
    message: string,
    ...msgParams: any[]
  ): IError<T> {
    return ErrorsUtil.apiErrorWithCause(undefined, message, ...msgParams);
  }

  public static apiSaveError<T extends Record<string, any> = Record<string, any>>(cause: any): IError<T>;
  public static apiSaveError<T extends Record<string, any> = Record<string, any>>(
    cause: any,
    message: string,
    ...msgParams: any[]
  ): IError<T>;
  public static apiSaveError<T extends Record<string, any> = Record<string, any>>(
    cause: any,
    ...args: any[]
  ): IError<T> {
    if (cause.isUIError === true) {
      return cause;
    }

    let message: string = cause.message ?? 'Save failed';

    if (args.length > 0) {
      const [msg, ...params] = args;

      message = params.length <= 0 ? msg : util.format(msg, ...params);
    }
    return {
      isUIError: true,
      type: UIErrorType.API_SAVE,
      message,
      cause
    };
  }

  public static resourceVerifyError(response: IResourceFailedVerification): IError {
    return {
      isUIError: true,
      type: UIErrorType.RESOURCE_VERIFY_ERROR,
      message: response.message,
      cause: response.code
    };
  }
}
