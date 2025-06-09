import isNil from 'lodash/isNil';
import isObjectLike from 'lodash/isObjectLike';
import axios from 'axios';

export interface NLSSErrorPOJO {
  readonly code: string;
  readonly message: string;
}

abstract class BaseError<T extends NLSSErrorPOJO> extends Error {
  public readonly code: string;

  public override readonly message: string;
  protected constructor(options: NLSSError.Options = {}) {
    super();
    this.code = options.code ?? 'NLSSError';
    this.message = options.message || 'Sorry an error has occurred.';
  }

  public get isNLSSError(): true {
    return true;
  }

  public abstract toJSON(): T;
}

export class NLSSError extends BaseError<NLSSErrorPOJO> {
  public constructor(options?: NLSSError.Options) {
    super(options);
  }

  public override toJSON(): NLSSErrorPOJO {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

interface ClientErrorPOJO extends NLSSErrorPOJO {
  status: number;
  isSecurityError: boolean;
  isClientError: boolean;
}

export class NLSSClientError extends BaseError<ClientErrorPOJO> {
  public readonly status: number;

  public readonly isSecurityError: boolean;

  public constructor(options: NLSSClientError.Options) {
    super({ ...options, code: options.code ?? 'NLSSClientError' });
    this.status = options.status ?? -1;
    this.isSecurityError = this.status === 401 || this.status === 403;
  }

  public get isClientError(): true {
    return true;
  }

  public override toJSON(): ClientErrorPOJO {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      isSecurityError: this.isSecurityError,
      isClientError: true,
    };
  }
}

export namespace NLSSError {
  export interface Options {
    code?: string;
    message?: string;
  }

  export function isNlSSError(value: any): value is NLSSError {
    return !isNil(value) && 'isNlSSError' in value && value.isNLSSError;
  }

  export function fromError(cause: any): NLSSError {
    if (isNil(cause) || !isObjectLike(cause)) {
      return new NLSSError();
    }
    if (axios.isAxiosError(cause)) {
      const options: NLSSClientError.Options = { message: cause.message };

      if (!isNil(cause.response)) {
        options.status = cause.response.status;
        options.statusText = cause.response.statusText;
      }

      return new NLSSClientError(options);
    }

    if (NLSSError.isNlSSError(cause)) {
      return cause;
    }

    return new NLSSError({ code: cause.code ?? cause.name, message: cause.message });
  }
}

export namespace NLSSErrorPOJO {
  export interface NLSSClientErrorPOJO extends ClientErrorPOJO {}
}

export namespace NLSSClientError {
  export interface Options extends NLSSError.Options {
    status?: number;
    statusText?: string;
  }
}
