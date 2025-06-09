import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { DatasetPolicyNote, DatasetPolicyNoteView, IPerson, IPolicyNoteType } from '../../types';
import { lookupsSelectors } from '../lookups';
import { peopleSelectors } from '../people';
import { EntityIdParams, EntityIdsParams, IAsyncState, IDeleteStatusState, SelectorsUtility } from '../shared';
import DatasetPolicyNoteStoreUtils from './utils';
import cloneDeep from 'lodash/cloneDeep';

type DatasetIdParams = {
  datasetId: number;
};

const selectEntities: Selector<DefaultRootState, List<DatasetPolicyNote>> = createSelector(
  (state: DefaultRootState) => state.datasetPolicyNotes.entities,
  (entities: List<DatasetPolicyNote>) => entities
);

const selectBatchStatus: (
  state: DefaultRootState,
  props: DatasetIdParams | EntityIdParams
) => IAsyncState | undefined = (state: DefaultRootState, props: DatasetIdParams | EntityIdParams) => {
  const datasetId: number = 'datasetId' in props ? props.datasetId : props.entityId;

  return state.datasetPolicyNotes.batchStatuses[DatasetPolicyNoteStoreUtils.datasetIdBatchStatusKey(datasetId)];
};

const selectDeleteStatus: ParametricSelector<DefaultRootState, EntityIdParams, IDeleteStatusState | undefined> = (
  state: DefaultRootState,
  props: EntityIdParams
): IDeleteStatusState | undefined => state.datasetPolicyNotes.deleteStatuses[props.entityId];

export type GetBatchLoadingSelector = ParametricSelector<DefaultRootState, DatasetIdParams | EntityIdParams, boolean>;

export const makeGetBatchLoading: () => GetBatchLoadingSelector = () =>
  createSelector(
    selectBatchStatus,
    (batchStatus: IAsyncState | undefined) => !isNil(batchStatus) && batchStatus.isFetching
  );

export type GetDatasetPolicyNoteSelector = ParametricSelector<
  DefaultRootState,
  EntityIdParams,
  DatasetPolicyNote | undefined
>;

export const makeGetDatasetPolicyNote: () => GetDatasetPolicyNoteSelector = () =>
  createSelector(
    selectEntities,
    SelectorsUtility.selectEntityIdParam,
    (entities: List<DatasetPolicyNote>, datasetPolicyNoteId: number): DatasetPolicyNote | undefined =>
      entities[datasetPolicyNoteId]
  );

export type GetViewsSelector = ParametricSelector<
  DefaultRootState,
  EntityIdsParams,
  DatasetPolicyNoteView[] | undefined
>;

export const makeGetViewsSelector: () => GetViewsSelector = (): GetViewsSelector =>
  createSelector(
    selectEntities,
    SelectorsUtility.selectEntityIdsParam,
    peopleSelectors.getEntities,
    lookupsSelectors.getPolicyNoteTypes,
    (
      entities: List<DatasetPolicyNote>,
      datasetPolicyNoteIds: number[],
      people: List<IPerson>,
      policyNoteTypes: List<IPolicyNoteType> = {}
    ): DatasetPolicyNoteView[] | undefined => {
      if (datasetPolicyNoteIds === undefined) {
        return undefined;
      }

      const views: DatasetPolicyNoteView[] = [];

      for (const noteId of datasetPolicyNoteIds) {
        if (entities[noteId] === undefined) {
          continue;
        }
        const policyNote: DatasetPolicyNote = entities[noteId];
        const contactNames: string[] = policyNote.contactIds.map((id: number) => people[id].name);

        views.push({
          id: policyNote.id,
          policyNoteType: policyNoteTypes[policyNote.policyNoteTypeId].name,
          links: policyNote.links !== undefined ? cloneDeep(policyNote.links) : undefined,
          searchableLinkValue:
            policyNote.links !== undefined && policyNote.links.length > 0 ? policyNote.links[0].label : '',
          note: policyNote.note,
          created: policyNote.createdAt.toLocaleDateString(),
          createdAtEpoch: policyNote.createdAt.getTime(),
          contactNames,
          canEdit: policyNote.canEdit
        });
      }

      return views.length > 0 ? views : undefined;
    }
  );

export type DeleteStatusProps = {
  deleting: boolean;
  deleted: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
};

export type GetDeleteStatus = ParametricSelector<DefaultRootState, EntityIdParams, DeleteStatusProps>;

export const makeGetDeleteStatus: () => GetDeleteStatus = () =>
  createSelector(selectDeleteStatus, (deleteStatus: IDeleteStatusState | undefined) => {
    if (deleteStatus === undefined) {
      return {
        deleting: false,
        deleted: false,
        hasError: false,
        errorMessage: undefined
      };
    }
    const result: DeleteStatusProps = {
      deleting: deleteStatus.isDeleting,
      deleted: deleteStatus.deleted,
      hasError: deleteStatus.didInvalidate,
      errorMessage: undefined
    };

    if (deleteStatus.didInvalidate) {
      result.errorMessage = deleteStatus.error?.message ?? 'Something went wrong';
    }
    return result;
  });
