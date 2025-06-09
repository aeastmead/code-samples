import { createSelector, ParametricSelector, Selector } from 'reselect';
import { DefaultRootState } from 'react-redux';
import type { ClassificationQuestionnaireState } from './type';
import {
  ClassificationQuestionnaireCategory,
  ClassificationQuestionnairePersonalDataType,
  ClassificationQuestionnaireUseCase
} from '../../types';
import { AsyncStateStatus } from '../shared';

type State = ClassificationQuestionnaireState;

const selectState: Selector<DefaultRootState, State> = (state: DefaultRootState) => state.classificationQuestionnaire;

const selectStatus: Selector<DefaultRootState, AsyncStateStatus> = (state: DefaultRootState) =>
  selectState(state).status;

export const _selectHasInitialized: Selector<DefaultRootState, boolean> = (state: DefaultRootState) =>
  selectStatus(state) !== AsyncStateStatus.UNINITIALIZED;

export const getLoading: (rootState: DefaultRootState) => boolean = createSelector(
  selectStatus,
  (status: AsyncStateStatus) => status === AsyncStateStatus.FETCHING
);
export function selectAllCategories(state: DefaultRootState): List<ClassificationQuestionnaireCategory> | undefined {
  return selectState(state).categories;
}

export const getCategoryIds: (rootState: DefaultRootState) => number[] | undefined = createSelector(
  (rootState: DefaultRootState): number[] | undefined => selectState(rootState).categoryIds,
  (categoryIds: number[] | undefined) => (categoryIds !== undefined ? [...categoryIds] : undefined)
);

export const getCategories: Selector<DefaultRootState, ClassificationQuestionnaireCategory[] | undefined> =
  createSelector(
    getCategoryIds,
    selectAllCategories,
    (categoryIds: number[] | undefined, categoriesMap: List<ClassificationQuestionnaireCategory> | undefined) => {
      if (categoryIds === undefined || categoriesMap === undefined) return undefined;

      return categoryIds.map((categoryId: number) => ({ ...categoriesMap[categoryId] }));
    }
  );

const selectAllPersonalDataTypes: Selector<
  DefaultRootState,
  List<ClassificationQuestionnairePersonalDataType> | undefined
> = (rootState: DefaultRootState) => selectState(rootState).personalDataTypes;

export const getPersonalDataTypes: Selector<
  DefaultRootState,
  ClassificationQuestionnairePersonalDataType[] | undefined
> = createSelector(
  (rootState: DefaultRootState) => selectState(rootState).personalDataTypeIds,
  selectAllPersonalDataTypes,
  (
    personalDataTypeIds: number[] | undefined,
    personalDataTypes: List<ClassificationQuestionnairePersonalDataType> | undefined
  ) => {
    if (personalDataTypes === undefined || personalDataTypeIds === undefined) return undefined;
    const result: ClassificationQuestionnairePersonalDataType[] = [];
    for (const id of personalDataTypeIds) {
      if (personalDataTypes[id] !== undefined) {
        result.push({ ...personalDataTypes[id] });
      }
    }
    return result.length > 0 ? result : undefined;
  }
);

export function makeGetCategory(): GetCategory {
  return createSelector(
    selectAllCategories,
    (_: DefaultRootState, props: ByIdParams) => props.entityId,
    (categories: List<ClassificationQuestionnaireCategory> | undefined, entityId: number) => {
      return categories !== undefined && categories[entityId] !== undefined
        ? {
            id: categories[entityId].id,
            name: categories[entityId].name,
            useCaseIds: [...categories[entityId].useCaseIds]
          }
        : undefined;
    }
  );
}

function selectAllUseCases(state: DefaultRootState): List<ClassificationQuestionnaireUseCase> | undefined {
  return selectState(state).useCases;
}

export function makeGetUseCases(getCategorySelector?: GetCategory): GetUseCases {
  const _getCategory: GetCategory = getCategorySelector !== undefined ? getCategorySelector : makeGetCategory();
  return createSelector(
    selectAllUseCases,
    _getCategory,
    (
      useCases: List<ClassificationQuestionnaireUseCase> | undefined,
      category: ClassificationQuestionnaireCategory | undefined
    ) => {
      if (useCases === undefined || category === undefined || category.useCaseIds.length <= 0) return undefined;

      const results: ClassificationQuestionnaireUseCase[] = [];

      for (const id of category.useCaseIds) {
        if (useCases[id] !== undefined) {
          results.push({ ...useCases[id] });
        }
      }
      return results.length > 0 ? results : undefined;
    }
  );
}

export function makeCategorySelectors(): CategorySelectors {
  const getCategory: GetCategory = makeGetCategory();

  return {
    getCategory,
    getUseCases: makeGetUseCases(getCategory)
  };
}

export function createSelectUseCaseByIds(
  idsSelector: Selector<DefaultRootState, number[] | undefined>
): Selector<DefaultRootState, ClassificationQuestionnaireUseCase[] | undefined>;
export function createSelectUseCaseByIds<P>(
  idsSelector: ParametricSelector<DefaultRootState, P, number[] | undefined>
): ParametricSelector<DefaultRootState, P, ClassificationQuestionnaireUseCase[] | undefined>;
export function createSelectUseCaseByIds<P = any>(
  idsSelector:
    | Selector<DefaultRootState, number[] | undefined>
    | ParametricSelector<DefaultRootState, P, number[] | undefined>
):
  | Selector<DefaultRootState, ClassificationQuestionnaireUseCase[] | undefined>
  | ParametricSelector<DefaultRootState, P, ClassificationQuestionnaireUseCase[] | undefined> {
  return createSelector(
    selectAllUseCases,
    idsSelector,
    (
      useCaseMap: List<ClassificationQuestionnaireUseCase> | undefined,
      useCaseIds: number[] | undefined
    ): ClassificationQuestionnaireUseCase[] | undefined => {
      if (useCaseMap === undefined || useCaseIds === undefined || useCaseIds.length <= 0) return undefined;

      const useCases: ClassificationQuestionnaireUseCase[] = [];

      for (const ucId of useCaseIds) {
        if (useCaseMap[ucId] !== undefined) {
          useCases.push({
            ...useCaseMap[ucId]
          });
        }
      }

      return useCases.length > 0 ? useCases : undefined;
    }
  );
}

export function createSelectPDTByIds(
  idsSelector: Selector<DefaultRootState, number[] | undefined>
): Selector<DefaultRootState, ClassificationQuestionnairePersonalDataType[] | undefined>;
export function createSelectPDTByIds<P>(
  idsSelector: ParametricSelector<DefaultRootState, P, number[] | undefined>
): ParametricSelector<DefaultRootState, P, ClassificationQuestionnairePersonalDataType[] | undefined>;
export function createSelectPDTByIds(idsSelector) {
  return createSelector(
    selectAllPersonalDataTypes,
    idsSelector,
    (
      personalDataTypes: List<ClassificationQuestionnairePersonalDataType> | undefined,
      personalDataTypeIds: number[] | undefined
    ) => {
      if (personalDataTypes === undefined || personalDataTypeIds === undefined || personalDataTypeIds.length <= 0)
        return undefined;

      const result: ClassificationQuestionnairePersonalDataType[] = [];

      for (const id of personalDataTypeIds) {
        if (personalDataTypes[id] !== undefined) {
          result.push({
            ...personalDataTypes[id]
          });
        }
      }
      return result.length > 0 ? result : undefined;
    }
  );
}

export type ByIdParams = {
  entityId: number;
};

export type GetCategory = ParametricSelector<
  DefaultRootState,
  ByIdParams,
  ClassificationQuestionnaireCategory | undefined
>;

export type GetUseCases = ParametricSelector<
  DefaultRootState,
  ByIdParams,
  ClassificationQuestionnaireUseCase[] | undefined
>;

export type CategorySelectors = {
  getCategory: GetCategory;
  getUseCases: GetUseCases;
};
