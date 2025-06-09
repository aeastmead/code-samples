import { IPerson } from '../../types';
import NormalizerUtility from './normalizer';

describe('Normalizer', () => {
  describe('normalPeople', () => {
    it('should be undefined for empty array', () => {
      const people: IPerson[] = [];

      expect(NormalizerUtility.normalPeople(people)).toEqual(undefined);
    });

    it('should ignore duplicate people', function () {
      const person1: IPerson = {
        id: 1,
        name: 'Person 1'
      };

      const person2: IPerson = {
        id: 2,
        name: 'Person 2'
      };

      const idBuckets: (number[] | undefined)[] = [[person1.id], [person2.id, person1.id]];

      const allPeople = [person1, person2];

      expect(NormalizerUtility.normalPeople([person1], [person2, person1])).toEqual({
        idBuckets,
        allPeople
      });
    });
  });
});
