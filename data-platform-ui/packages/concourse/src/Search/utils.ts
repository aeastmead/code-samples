import { searchLocationService, SearchLocationState } from '@nlss/brain-trust';
import memoizeOne from 'memoize-one';

export type SearchEntityType = 'DATASET' | 'RESOURCE';

export const SearchEntityType = {
  DATASET: 'DATASET',
  RESOURCE: 'RESOURCE',
} as const;

export const getLocationState: (queryString: string | undefined) => SearchLocationState = memoizeOne(
  searchLocationService.parseQS
);
