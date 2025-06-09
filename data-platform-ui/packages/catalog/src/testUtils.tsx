import '@testing-library/jest-dom';
import {
  ByRoleOptions,
  Matcher,
  MatcherOptions,
  screen,
  SelectorMatcherOptions,
  waitForOptions
} from '@testing-library/react';
import { boundQueries } from './__utils__/custom-queries';

export function byRole<T extends HTMLElement = HTMLElement>(
  id: Matcher,
  defaultOptions: ByRoleOptions = {},
  defaultFindWaitOptions: waitForOptions = {}
): SelectorResult<T, ByRoleOptions> {
  return {
    get: (options: ByRoleOptions = {}) => screen.getByRole(id, { ...defaultOptions, ...options }),
    query: (options: ByRoleOptions = {}) => screen.queryByRole(id, { ...defaultOptions, ...options }),
    find: (options: ByRoleOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findByRole(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions }),
    getAll: (options: ByRoleOptions = {}) => screen.getAllByRole(id, { ...defaultOptions, ...options }),
    queryAll: (options: ByRoleOptions = {}) => screen.queryAllByRole(id, { ...defaultOptions, ...options }),
    findAll: (options: ByRoleOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findAllByRole(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions })
  };
}

export function byText<T extends HTMLElement = HTMLElement>(
  id: Matcher,
  defaultOptions: SelectorMatcherOptions = {},
  defaultFindWaitOptions: waitForOptions = {}
): SelectorResult<T> {
  return {
    get: (options: SelectorMatcherOptions = {}) => screen.getByText(id, { ...defaultOptions, ...options }),
    query: (options: SelectorMatcherOptions = {}) => screen.queryByText(id, { ...defaultOptions, ...options }),
    find: (options: SelectorMatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findByText(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions }),
    getAll: (options: SelectorMatcherOptions = {}) => screen.getAllByText(id, { ...defaultOptions, ...options }),
    queryAll: (options: SelectorMatcherOptions = {}) => screen.queryAllByText(id, { ...defaultOptions, ...options }),
    findAll: (options: SelectorMatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findAllByText(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions })
  };
}

export function byLabelText<T extends HTMLElement = HTMLElement>(
  id: Matcher,
  defaultOptions: SelectorMatcherOptions = {},
  defaultFindWaitOptions: waitForOptions = {}
): SelectorResult<T> {
  return {
    get: (options: SelectorMatcherOptions = {}) => screen.getByLabelText(id, { ...defaultOptions, ...options }),
    query: (options: SelectorMatcherOptions = {}) => screen.queryByLabelText(id, { ...defaultOptions, ...options }),
    find: (options: SelectorMatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findByLabelText(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions }),
    getAll: (options: SelectorMatcherOptions = {}) => screen.getAllByLabelText(id, { ...defaultOptions, ...options }),
    queryAll: (options: SelectorMatcherOptions = {}) =>
      screen.queryAllByLabelText(id, { ...defaultOptions, ...options }),
    findAll: (options: SelectorMatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      screen.findAllByLabelText(
        id,
        { ...defaultOptions, ...options },
        { ...defaultFindWaitOptions, ...findWaitOptions }
      )
  };
}

/**
 * By form field name
 * @param id
 * @param defaultOptions
 * @param defaultFindWaitOptions
 */
export function byName<T extends HTMLElement = HTMLElement>(
  id: Matcher,
  defaultOptions: MatcherOptions = {},
  defaultFindWaitOptions: waitForOptions = {}
): SelectorResult<T> {
  return {
    get: (options: MatcherOptions = {}) => boundQueries.getByName(id, { ...defaultOptions, ...options }),
    query: (options: MatcherOptions = {}) => boundQueries.queryByName(id, { ...defaultOptions, ...options }),
    find: (options: MatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      boundQueries.findByName(id, { ...defaultOptions, ...options }, { ...defaultFindWaitOptions, ...findWaitOptions }),
    getAll: (options: MatcherOptions = {}) => boundQueries.getAllByName(id, { ...defaultOptions, ...options }),
    queryAll: (options: MatcherOptions = {}) => boundQueries.queryAllByName(id, { ...defaultOptions, ...options }),
    findAll: (options: MatcherOptions = {}, findWaitOptions: waitForOptions = {}) =>
      boundQueries.findAllByName(
        id,
        { ...defaultOptions, ...options },
        { ...defaultFindWaitOptions, ...findWaitOptions }
      )
  };
}

export interface SelectorResult<T extends HTMLElement = HTMLElement, O extends MatcherOptions = MatcherOptions> {
  get(options?: O): T;
  query(options?: O): T | null;
  find(options?: O, waitForElementOptions?: waitForOptions): Promise<T>;
  getAll(options?: O): T[];
  queryAll(options?: O): T[];
  findAll(options?: O, waitForElementOptions?: waitForOptions): Promise<T[]>;
}

export * from '@testing-library/react';
export { default as render, CustomRenderResult as RenderResult } from './__utils__/custom-render';
