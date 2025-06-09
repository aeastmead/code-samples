import { SearchLocationState } from './search.types';
import searchLocationService from './searchLocation.service';

describe('searchLocationService', () => {
  describe('stringifyQS', () => {
    it('should return empty string when input is undefined', () => {
      expect(searchLocationService.stringifyQS()).toEqual('');
    });

    type StringifyTestCase = {
      label: string;
      query: Partial<SearchLocationState>;
      expected: (string | RegExp)[];
    };

    const testCauses: StringifyTestCase[] = [
      { label: 'when object.q is an empty string then ignore', query: { q: '  ' }, expected: [''] },
      { label: 'ignore empty filters object', query: { filters: {} }, expected: [''] },
      {
        label: 'convert filters to dot path string',
        query: { filters: { entityTypes: ['id_1'] }, q: 'foo' },
        expected: ['filters.entityTypes[]=id_1', 'q=foo', /^\?.+/],
      },
    ];

    it.each<StringifyTestCase>(testCauses)('should $label', ({ query, expected }: StringifyTestCase) => {
      const result: string = searchLocationService.stringifyQS(query);
      for (const str of expected) {
        if (typeof str === 'string') {
          expect(result).toContain(str);
        } else {
          expect(result).toMatch(str);
        }
      }
    });
  });

  describe('parseQS', () => {
    it('should return default search object value', () => {
      expect(searchLocationService.parseQS()).toEqual({
        filters: {},
        q: undefined,
        page: 1,
        pageSize: 20,
      });
    });

    type ParseTestCase = {
      label: string;
      query: string;
      expected: SearchLocationState;
    };

    const testCases: ParseTestCase[] = [
      {
        label: 'ignore "q" property with empty string',
        query: 'q=  ',
        expected: { filters: {}, page: 1, q: undefined, pageSize: 20 },
      },
      {
        label: 'handle "filters.*" paths containing single value',
        query: 'filters.category=3',
        expected: { filters: { category: ['3'] }, page: 1, q: undefined, pageSize: 20 },
      },

      {
        label: 'handle "filters.*" array values',
        query: 'filters.category[]=3&filters.category[]=resource_12',
        expected: { filters: { category: ['3', 'resource_12'] }, page: 1, q: undefined, pageSize: 20 },
      },
      {
        label: 'ignore invalid page size',
        query: 'page_size=29',
        expected: { filters: {}, page: 1, q: undefined, pageSize: 20 },
      },
      {
        label: 'handle page size',
        query: 'page_size=60',
        expected: { filters: {}, page: 1, q: undefined, pageSize: 60 },
      },
    ];

    it.each<ParseTestCase>(testCases)('should $label', ({ query, expected }: ParseTestCase) => {
      expect(searchLocationService.parseQS(query)).toEqual(expected);
    });
  });
});
