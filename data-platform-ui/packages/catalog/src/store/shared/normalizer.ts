import { IPerson } from '../../types';
import isNil from 'lodash/isNil';

function normalPeople(...peoples: (IPerson[] | undefined)[]): INormalizedPeopleResult | undefined {
  if (peoples.length <= 0 || isNil(peoples[0]) || peoples[0].length <= 0) {
    return undefined;
  }
  const allPeople: IPerson[] = [];

  const idMemo: List<boolean> = {};

  const idBuckets: (number[] | undefined)[] = [];

  for (const people of peoples) {
    if (isNil(people) || people.length <= 0) {
      idBuckets.push(undefined);
      continue;
    }

    const peopleIds: number[] = [];

    for (const person of people) {
      const id: number = person.id;
      peopleIds.push(id);

      if (!idMemo[id]) {
        idMemo[id] = true;

        allPeople.push(person);
      }
    }
    idBuckets.push(peopleIds);
  }

  return {
    allPeople,
    idBuckets
  };
}

export default {
  normalPeople
} as INormalizer;

export interface INormalizer {
  normalPeople(...peoples: (IPerson[] | undefined)[]): INormalizedPeopleResult | undefined;
}

export interface INormalizedPeopleResult {
  idBuckets: (number[] | undefined)[];
  allPeople: IPerson[];
}
