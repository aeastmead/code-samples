import { OptionValue } from '../common.types';

export interface SearchFilter {
  id: string;
  label: string;
  options: SearchFilter.Option[];
}

export namespace SearchFilter {
  export interface Option extends OptionValue<string> {}
}

export interface SearchLocationState {
  filters: Record<string, string[]>;
  q: string | undefined;
  page: number;
  pageSize: number;
}

export interface SearchURLParams extends Partial<Omit<SearchLocationState, 'pageSize'>> {
  page_size?: number;
}

export interface SearchBarFormModel {
  entityType: string | undefined;
  q: string | undefined;
}
