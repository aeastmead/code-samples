import { SearchFilterLookupState } from './types';
import searchFilterLookupReducer, {
  SearchFilterLookupActionType,
  SearchFilterLookupActionUnion,
} from './searchFilterLookup.slice';
import { AsyncStatus } from '../../store';

describe('searchFilterLookupSlice', () => {
  type ReducerTestCase = {
    label: string;
    initialState: SearchFilterLookupState;
    action: SearchFilterLookupActionUnion;
    expectedState: SearchFilterLookupState;
  };

  it.each<ReducerTestCase>([
    {
      label: 'update status to `fetching`',
      initialState: { status: AsyncStatus.UNINITIALIZED, entities: {}, ids: [] },
      action: { type: SearchFilterLookupActionType.FETCH_REQUEST, payload: undefined },
      expectedState: { status: AsyncStatus.FETCHING, entities: {}, ids: [] },
    },
    {
      label: 'replace previous entities',
      initialState: {
        status: AsyncStatus.SUCCEEDED,
        entities: {
          personal: {
            id: 'personal',
            label: 'Personal',
            optionByValue: { ['1']: { value: '1', label: 'Label 1' }, ['2']: { value: '1', label: 'Label 1' } },
            optionValues: ['1', '2'],
          },
        },
        ids: ['personal'],
      },
      action: {
        type: SearchFilterLookupActionType.FETCH_SUCCEEDED,
        payload: [
          {
            id: 'resource_tags',
            label: 'Tags',
            optionByValue: { ['1']: { value: '1', label: 'Label 1' }, ['2']: { value: '1', label: 'Label 1' } },
            optionValues: ['1', '2'],
          },
        ],
      },
      expectedState: {
        status: AsyncStatus.SUCCEEDED,
        entities: {
          resource_tags: {
            id: 'resource_tags',
            label: 'Tags',
            optionByValue: { ['1']: { value: '1', label: 'Label 1' }, ['2']: { value: '1', label: 'Label 1' } },
            optionValues: ['1', '2'],
          },
        },
        ids: ['resource_tags'],
      },
    },
  ])('reducer should $label', ({ initialState, action, expectedState }: ReducerTestCase) => {
    expect(searchFilterLookupReducer(initialState, action)).toEqual(expectedState);
  });
});
