import { SearchLocationState, SearchURLParams } from './search.types';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';
import isString from 'lodash/isString';
import isObjectLike from 'lodash/isObjectLike';
import castArray from 'lodash/castArray';
import nlssUtils from '../nlssUtils';

export const SEARCH_PAGE_SIZES: readonly number[] = [10, 20, 40, 60, 100];

export const DEFAULT_SEARCH_PAGE_SIZE: number = SEARCH_PAGE_SIZES[1];

function getInitLocationState(): SearchLocationState {
  return {
    filters: {},
    q: undefined,
    page: 1,
    pageSize: DEFAULT_SEARCH_PAGE_SIZE,
  };
}

function parseQS(queryStr: string = ''): SearchLocationState {
  const result: SearchLocationState = getInitLocationState();
  if (nlssUtils.isEmptyString(queryStr)) {
    return result;
  }
  const queryObj: Record<string, any> = qs.parse(queryStr, {
    allowDots: true,
    parseArrays: true,
    ignoreQueryPrefix: true,
  });

  if ('q' in queryObj && isString(queryObj.q) && !nlssUtils.isEmptyString(queryObj.q)) {
    result.q = queryObj.q;
  }

  if (!isNil(queryObj.page)) {
    const value = parseInt(queryObj.page);

    if (!isNaN(value) && value > 0) {
      result.page = value;
    }
  }

  if (!isNil(queryObj.page_size)) {
    const value = parseInt(queryObj.page_size);
    if (SEARCH_PAGE_SIZES.includes(value)) {
      result.pageSize = value;
    }
  }

  if (!isNil(queryObj.filters) && isObjectLike(queryObj.filters)) {
    for (const filterId in queryObj.filters) {
      result.filters[filterId] = castArray(queryObj.filters[filterId]);
    }
  }

  return result;
}

function stringifyQS(queryObj: Partial<SearchLocationState> = {}): string {
  const obj: SearchURLParams = {};

  let hasValues = false;

  if (!isNil(queryObj.q) && !nlssUtils.isEmptyString(queryObj.q)) {
    hasValues = true;
    obj.q = queryObj.q.trim();
  }

  if (queryObj.page !== undefined) {
    hasValues = true;

    obj.page = queryObj.page;
  }
  if (queryObj.pageSize !== undefined) {
    hasValues = true;
    obj.page_size = queryObj.pageSize;
  }

  if (!isNil(queryObj.filters) && !isEmpty(queryObj.filters)) {
    hasValues = true;
    obj.filters = { ...queryObj.filters };
  }
  if (!hasValues) {
    return '';
  }

  return qs.stringify(obj, {
    arrayFormat: 'brackets',
    allowDots: true,
    addQueryPrefix: true,
    encodeValuesOnly: true,
  });
}

const RESULT_ROUTE_MATCH = /^\/?(search|catalog)(\/\s*)?$/i;

function createSearchResultPath(input: Partial<SearchLocationState> = {}): string {
  return '/search' + stringifyQS(input);
}

function isSearchResultPath(pathname: string = ''): boolean {
  return RESULT_ROUTE_MATCH.test(pathname);
}

export default {
  parseQS,
  stringifyQS,
  createSearchResultPath,
  isSearchResultPath,
  getInitLocationState,
  SEARCH_PAGE_SIZES,
};
