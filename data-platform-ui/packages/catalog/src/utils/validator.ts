import isNil from 'lodash/isNil';

export type ValidatorFn = (value: any) => string | void;

export default class Validator {
  private static REQUIRED_MESSAGE = 'This is a required field.';

  public static minLength(min: number): ValidatorFn {
    return (value?: string) => {
      if (!isNil(value) && value.length < min) {
        return `Must be at least ${min} character(s)`;
      }
      return undefined;
    };
  }

  public static maxLength(max: number): ValidatorFn {
    return (value?: string) => {
      if (!isNil(value) && value.length > max) {
        return `Must be less than or equal to ${max} characters`;
      }
      return undefined;
    };
  }

  public static minValue(value: any, limit: number): string | void {
    if (isNil(value)) {
      return undefined;
    }

    const num: number = parseInt(value);
    if (isNaN(num) || num < limit) {
      return `Must be greater than ${limit}`;
    }
    return undefined;
  }

  public static min(limit: number): ValidatorFn {
    return (value: any) => Validator.minValue(value, limit);
  }

  static compose(validatorFn: ValidatorFn[]): ValidatorFn;
  static compose(...validatorFns: ValidatorFn[]): ValidatorFn;
  static compose(...args: any[]): ValidatorFn {
    if (args.length <= 0) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
    const validatorFns: ValidatorFn[] = args.length > 1 ? args : args[0];

    return (value?: any): string | void => {
      for (const validatorFn of validatorFns) {
        const msg: string | void = validatorFn(value);

        if (typeof msg === 'string') {
          return msg;
        }
      }
    };
  }

  public static isEmpty(value?: any): value is null | undefined {
    return isNil(value) || value.toString().trim().length <= 0;
  }

  public static required(value?: any): string | void {
    if (Validator.isEmpty(value)) {
      return Validator.REQUIRED_MESSAGE;
    }
  }
  static largeDescription(value?: any): string | void {
    if (Validator.isEmpty(value)) {
      return Validator.REQUIRED_MESSAGE;
    }

    if (value.length < 5) {
      return `Must be at least 5 characters`;
    }

    if (value.length > 4000) {
      return `Must be less than or equal to 4,000 characters`;
    }
  }

  static description(value?: any): string | void {
    if (Validator.isEmpty(value)) {
      return Validator.REQUIRED_MESSAGE;
    }

    if (value.length < 5) {
      return `Must be at least 5 characters`;
    }

    if (value.length > 500) {
      return `Must be less than or equal to 500 characters`;
    }
  }

  static drqsGroup(value?: unknown): string | void {
    if (Validator.isEmpty(value)) {
      return Validator.REQUIRED_MESSAGE;
    }

    return Validator.minValue(value, 8);
  }

  static entityName(value?: string): string | void {
    if (Validator.isEmpty(value)) {
      return Validator.REQUIRED_MESSAGE;
    }

    const len = value.trim().length;

    if (len < 5) {
      return `Must be at least 5 characters`;
    }

    if (len > 120) {
      return `Must be less than or equal to 120 characters`;
    }
  }
}
