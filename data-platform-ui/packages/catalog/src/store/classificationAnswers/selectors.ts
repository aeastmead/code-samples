import { createSelector, ParametricSelector } from 'reselect';
import { DefaultRootState } from 'react-redux';
import { AsyncState, AsyncStateStatus } from '../shared';
import { ClassificationAnswersState } from './types';
import {
  ClassificationAnswer,
  ClassificationAnsweredCategory,
  ClassificationQuestionnaireCategory,
  ClassificationQuestionnairePersonalDataType,
  ClassificationQuestionnaireUseCase
} from '../../types';
import { classificationQuestionnaireSelectors } from '../classificationQuestionnaire';

const selectState = (rootState: DefaultRootState): ClassificationAnswersState => rootState.classificationAnswers;

function selectStatus(rootState: DefaultRootState, entityId: number): AsyncStateStatus {
  const statusState: AsyncState | undefined = selectState(rootState).statuses[entityId];
  return statusState !== undefined ? statusState.status : AsyncStateStatus.UNINITIALIZED;
}

export function _selectHasInitialized(rootState: DefaultRootState, entityId: number): boolean {
  return selectStatus(rootState, entityId) !== AsyncStateStatus.UNINITIALIZED;
}

const selectEntityById = (rootState: DefaultRootState, entityId: number): ClassificationAnswer | undefined => {
  return selectState(rootState).entities[entityId];
};

export function makeGetLoading(withQuestionLoading: boolean = false): GetLoading {
  const selectLoading: GetLoading = createSelector(
    selectStatus,
    (status: AsyncStateStatus) => status === AsyncStateStatus.FETCHING || status === AsyncStateStatus.UNINITIALIZED
  );
  if (!withQuestionLoading) return selectLoading;

  return createSelector(
    selectLoading,
    classificationQuestionnaireSelectors.getLoading,
    (localLoading: boolean, questionsLoading: boolean) => localLoading || questionsLoading
  );
}

export function _selectBriForId(rootState: DefaultRootState, entityId: number): string | undefined {
  const entity: ClassificationAnswer | undefined = selectEntityById(rootState, entityId);

  return entity !== undefined ? entity.bri : undefined;
}

export function makeGetUseCaseIds(): GetSelectedIds {
  return createSelector(selectEntityById, (entity: ClassificationAnswer | undefined) =>
    entity !== undefined && entity.useCaseIds !== undefined ? [...entity.useCaseIds] : undefined
  );
}

export function makeGetPersonalDataTypeIds(): GetSelectedIds {
  return createSelector(selectEntityById, (entity: ClassificationAnswer | undefined) =>
    entity !== undefined && entity.personalDataTypeIds !== undefined ? [...entity.personalDataTypeIds] : undefined
  );
}

export function makeGetEntitySelections(): GetEntitySelections {
  return createSelector(
    selectEntityById,
    makeGetUseCaseIds(),
    (entity: ClassificationAnswer | undefined, useCaseIds: number[] | undefined) => {
      if (entity === undefined) return undefined;

      return {
        useCaseIds,
        personalDataTypeIds: entity.personalDataTypeIds !== undefined ? [...entity.personalDataTypeIds] : undefined
      };
    }
  );
}

export function makeGetGroupedUseCases(): GetGroupedUseCases {
  const selectUseCases: SelectUseCases = classificationQuestionnaireSelectors.createSelectUseCaseByIds(
    makeGetUseCaseIds()
  );

  return createSelector(
    selectUseCases,
    classificationQuestionnaireSelectors.selectAllCategories,
    (
      useCases: ClassificationQuestionnaireUseCase[] | undefined,
      categoryMap: List<ClassificationQuestionnaireCategory> | undefined
    ) => {
      if (useCases === undefined || categoryMap === undefined) return undefined;
      const nodeMap: List<UseCaseNode> = {};
      const categoryIds: number[] = [];

      for (const useCase of useCases) {
        const category: ClassificationQuestionnaireCategory | undefined = categoryMap[useCase.categoryId];
        if (category === undefined) {
          continue;
        }

        if (nodeMap[category.id] === undefined) {
          nodeMap[category.id] = {
            id: category.id,
            name: category.name,
            children: []
          };
          categoryIds.push(category.id);
        }

        nodeMap[category.id].children.push({ id: useCase.id, name: useCase.name });
      }

      if (categoryIds.length <= 0) return undefined;

      return categoryIds.map((catId: number) => nodeMap[catId]);
    }
  );
}

export function makeGetPersonalDataTypes(): GetPersonalDataTypes {
  return classificationQuestionnaireSelectors.createSelectPDTByIds(makeGetPersonalDataTypeIds());
}

type SelectUseCases = ParametricSelector<DefaultRootState, number, ClassificationQuestionnaireUseCase[] | undefined>;
export type UseCaseNode = ClassificationAnsweredCategory;

export type GetGroupedUseCases = ParametricSelector<
  DefaultRootState,
  number,
  ClassificationAnsweredCategory[] | undefined
>;

export type GetSelectedIds = ParametricSelector<DefaultRootState, number, number[] | undefined>;

export type EntitySelections = {
  useCaseIds: number[] | undefined;
  personalDataTypeIds: number[] | undefined;
};

export type GetLoading = ParametricSelector<DefaultRootState, number, boolean>;

export type GetEntitySelections = ParametricSelector<DefaultRootState, number, EntitySelections | undefined>;

export type GetPersonalDataTypes = ParametricSelector<
  DefaultRootState,
  number,
  ClassificationQuestionnairePersonalDataType[] | undefined
>;
