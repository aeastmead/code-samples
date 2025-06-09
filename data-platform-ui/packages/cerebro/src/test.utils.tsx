import React from 'react';
import {
  render,
  RenderOptions,
  screen,
  waitForOptions,
  Matcher,
  SelectorMatcherOptions,
  MatcherOptions,
  ByRoleOptions
} from '@testing-library/react';
import { BBUIApp } from '@bbnpm/bb-ui-framework';
import { nlssLightTheme } from './theme';

function TestWrapper({ children }: { children?: React.ReactNode }): React.ReactElement {
  return (
    <BBUIApp themes={[nlssLightTheme]} activeTheme="nlssLightTheme">
      {children}
    </BBUIApp>
  );
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestWrapper, ...options });

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

export interface SelectorResult<T extends HTMLElement = HTMLElement, O extends MatcherOptions = MatcherOptions> {
  get(options?: O): T;
  query(options?: O): T | null;
  find(options: O, waitForElementOptions?: waitForOptions): Promise<T>;
  getAll(options?: O): T[];
  queryAll(options?: O): T[];
  findAll(options?: O, waitForElementOptions?: waitForOptions): Promise<T[]>;
}

export * from '@testing-library/react';
export { renderHook, ReactHooksRenderer, RenderHookResult, ServerRenderHookResult } from '@testing-library/react-hooks';
export { customRender as render };
