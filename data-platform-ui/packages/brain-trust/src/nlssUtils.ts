namespace NLSSUtils {
  export function isEmptyString(value: string | undefined): value is undefined {
    return value === undefined || value === null || /^\s*$/.test(value);
  }

  export function notEmptyString(value: string | undefined | null): boolean;
  /**
   * Added to remove an extra undefined or null check.
   * @param value
   * @param enableTypeGuard
   */
  export function notEmptyString(value: string | undefined | null, enableTypeGuard: true): value is string;
  export function notEmptyString(value: string | undefined | null, _?: boolean): boolean {
    return typeof value === 'string' && !/^\s*$/.test(value);
  }

  export function stripToUndefined(value: string | undefined | null, trim?: boolean): string | undefined {
    if (notEmptyString(value, true)) {
      return trim !== false ? value.trim() : value;
    }
    return undefined;
  }

  export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  // eslint-disable-next-line
  export function noopFn(...args: any[]): void {}

  /**
   * Creates iterator base unique string generate. Used by components may have multiple instances on a view and needs a unique id value.
   * Example is attach form field to label via aria-labelledby
   * @param defaultPrefix
   */
  export function createSimpleUniqGen(defaultPrefix: string): SimpleUniqueGenerator {
    let iterator = 0;

    return () => `${defaultPrefix}-${++iterator}`;
  }

  export interface SimpleUniqueGenerator {
    (): string;
  }
}

export default NLSSUtils;
