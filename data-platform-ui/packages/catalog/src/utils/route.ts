import H from 'history';
import qs from 'qs';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

export default class RouteUtil {
  public static readonly HOME_PATH = '/';

  public static readonly LOGIN_PATH = '/bsso/login';

  public static getQueryString<T = any>(input: string | undefined): T | undefined {
    if (isNil(input) || isEmpty(input)) {
      return undefined;
    }

    return qs.parse(input.replace('?', '')) as any;
  }
  public static parseSearch(location: H.Location): string | undefined {
    if (isNil(location)) {
      return undefined;
    }
    return location.search;
  }
  public static createQueryString<T = any>(obj: T): string;
  public static createQueryString(obj: undefined): undefined;
  public static createQueryString<T = any>(obj: T | undefined): string | undefined {
    if (isNil(obj)) {
      return undefined;
    }
    return `?${qs.stringify(obj, { encodeValuesOnly: true })}`;
  }

  public static createBSSOUrl(originalUrl?: string | undefined): string {
    const qString = !isNil(originalUrl) ? this.createQueryString({ originalUrl }) : '';
    return `${RouteUtil.LOGIN_PATH}${qString}`;
  }
}
