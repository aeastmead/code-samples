function parseFieldError(fieldMeta: ParseFieldErrorOptions): string | undefined;
function parseFieldError(touched: boolean, error: string | undefined): string | undefined;
function parseFieldError(...args: [boolean, string | undefined] | [ParseFieldErrorOptions]): string | undefined {
  const { touched, error }: ParseFieldErrorOptions =
    typeof args[0] === 'boolean' ? { touched: args[0], error: args[1] } : args[0];
  return touched && typeof error === 'string' ? error : undefined;
}

type ParseFieldErrorOptions = {
  touched: boolean;
  error?: string | undefined;
};

export default {
  parseFieldError
};
