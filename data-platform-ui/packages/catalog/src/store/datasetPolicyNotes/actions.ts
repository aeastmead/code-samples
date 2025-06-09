import { batch, DefaultRootState } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { APIDatasetPolicyNote, DatasetPolicyNote, IAPIDeletedDatasetPolicyNote, IError, IPerson } from '../../types';
import ErrorsUtil from '../../utils/errors';
import { DatasetsAction, datasetsActions, IUpdatedDataset } from '../datasets';
import { peopleActions } from '../people';
import { DatasetPolicyNotesAction, DatasetPolicyNotesActionType } from './types';
import DatasetPolicyNoteStoreUtils from './utils';

export interface IDatasetPolicyNotesActions {
  fetchByDatasetIdAsync(datasetId: number): DefaultThunkAction<Promise<void>>;
  deleteByIdAsync(datasetPolicyNoteId: number): DefaultThunkAction<Promise<void>>;
  batchFetchRequest(key: string): DatasetPolicyNotesAction.IBatchFetchRequestAction;
  batchFetchSuccess(
    key: string,
    entities: DatasetPolicyNote[] | undefined
  ): DatasetPolicyNotesAction.IBatchFetchSuccessAction;
  batchFetchFailure(key: string, error: any): DatasetPolicyNotesAction.IBatchFetchFailureAction;
  batchReset(key: string): DatasetPolicyNotesAction.IBatchResetAction;
  batchResetByDatasetId(datasetId: number): DatasetPolicyNotesAction.IBatchResetAction;
  add(noteOrNotes: DatasetPolicyNote | DatasetPolicyNote[]): DatasetPolicyNotesAction.IAddAction;
  addFromAPI(apiEntities: APIDatasetPolicyNote | APIDatasetPolicyNote[]): AnyAction[];

  deleteRequest(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteRequestAction;
  deleteFailure(datasetPolicyNoteId: number, error: any): DatasetPolicyNotesAction.IDeleteFailureAction;
  deleteSuccess(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteSuccessAction;
  deleteReset(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteResetAction;
  deleteSuccessAllActions(deletedDatasetPolicyNote: IAPIDeletedDatasetPolicyNote): AnyAction[];
  normalize(apiEntities: APIDatasetPolicyNote[]): [DatasetPolicyNote[], IPerson[], IUpdatedDataset[]];

  normalizeOne(apiEntity: APIDatasetPolicyNote): [DatasetPolicyNote, IPerson[], IUpdatedDataset];
}

class DatasetPolicyNotesActions implements IDatasetPolicyNotesActions {
  constructor() {
    this.batchFetchFailure = this.batchFetchFailure.bind(this);

    this.fetchByDatasetIdAsync = this.fetchByDatasetIdAsync.bind(this);
    this.batchFetchRequest = this.batchFetchRequest.bind(this);
    this.batchFetchSuccess = this.batchFetchSuccess.bind(this);
    this.batchFetchFailure = this.batchFetchFailure.bind(this);
    this.batchReset = this.batchReset.bind(this);
    this.normalize = this.normalize.bind(this);

    this.normalizeOne = this.normalizeOne.bind(this);
    this.batchFetchSuccessAll = this.batchFetchSuccessAll.bind(this);

    this.add = this.add.bind(this);
    this.addFromAPI = this.addFromAPI.bind(this);
    this.batchResetByDatasetId = this.batchResetByDatasetId.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.deleteSuccess = this.deleteSuccess.bind(this);
    this.deleteFailure = this.deleteFailure.bind(this);
    this.deleteReset = this.deleteReset.bind(this);
  }

  batchFetchFailure(key: string, error: any): DatasetPolicyNotesAction.IBatchFetchFailureAction {
    return {
      type: DatasetPolicyNotesActionType.BATCH_FETCH_FAILURE,
      payload: {
        key,
        error
      },
      error: true
    };
  }

  batchFetchRequest(key: string): DatasetPolicyNotesAction.IBatchFetchRequestAction {
    return {
      type: DatasetPolicyNotesActionType.BATCH_FETCH_REQUEST,
      payload: {
        key
      }
    };
  }

  batchFetchSuccess(
    key: string,
    datasetPolicyNotes: DatasetPolicyNote[] | undefined
  ): DatasetPolicyNotesAction.IBatchFetchSuccessAction {
    return {
      type: DatasetPolicyNotesActionType.BATCH_FETCH_SUCCESS,
      payload: {
        key,
        datasetPolicyNotes
      }
    };
  }

  batchFetchSuccessAll(key: string, apiEntities: APIDatasetPolicyNote[]): AnyAction[] {
    const [datasetPolicyNotes, people, updateDatasets]: [DatasetPolicyNote[], IPerson[], IUpdatedDataset[]] =
      this.normalize(apiEntities);

    return [
      peopleActions.add(people),
      this.batchFetchSuccess(key, datasetPolicyNotes),
      datasetsActions.update(updateDatasets)
    ];
  }

  batchReset(key: string): DatasetPolicyNotesAction.IBatchResetAction {
    return {
      type: DatasetPolicyNotesActionType.BATCH_RESET,
      payload: {
        key
      }
    };
  }

  public batchResetByDatasetId(datasetId: number): DatasetPolicyNotesAction.IBatchResetAction {
    return this.batchReset(DatasetPolicyNoteStoreUtils.datasetIdBatchStatusKey(datasetId));
  }

  fetchByDatasetIdAsync(datasetId: number): DefaultThunkAction<Promise<void>> {
    const key: string = DatasetPolicyNoteStoreUtils.datasetIdBatchStatusKey(datasetId);
    return async (
      dispatch: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      { datasetPolicyNoteService }: ThunkExtraArgument
    ): Promise<void> => {
      dispatch(this.batchFetchRequest(key));

      let actions: AnyAction[];

      try {
        const apiEntities: APIDatasetPolicyNote[] | undefined = await datasetPolicyNoteService.getByDatasetId(
          datasetId
        );
        if (apiEntities === undefined) {
          actions = [this.batchFetchSuccess(key, undefined)];
        } else {
          actions = this.batchFetchSuccessAll(key, apiEntities);
        }
      } catch (cause: any) {
        const error: IError = ErrorsUtil.apiErrorWithCause(cause, cause.message);

        actions = [this.batchFetchFailure(key, error)];
      }

      if (actions.length === 1) {
        dispatch(actions[0]);
        return;
      }

      batch(() => {
        for (const action of actions) {
          dispatch(action);
        }
      });
    };
  }

  public deleteByIdAsync(datasetPolicyNoteId: number): DefaultThunkAction<Promise<void>> {
    return async (dispatch: Dispatch, _: any, { datasetPolicyNoteService }: ThunkExtraArgument): Promise<void> => {
      dispatch(this.deleteRequest(datasetPolicyNoteId));

      let actions: AnyAction[];

      try {
        const result: IAPIDeletedDatasetPolicyNote = await datasetPolicyNoteService.deleteById(datasetPolicyNoteId);
        actions = this.deleteSuccessAllActions(result);
      } catch (cause: any) {
        const error: IError = ErrorsUtil.apiErrorWithCause(cause, cause.message);
        actions = [this.deleteFailure(datasetPolicyNoteId, error)];
      }

      if (actions.length === 0) {
        dispatch(actions[0]);
        return undefined;
      }

      batch(() => {
        for (const action of actions) {
          dispatch(action);
        }
      });
    };
  }

  public deleteRequest(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteRequestAction {
    return {
      type: DatasetPolicyNotesActionType.DELETE_REQUEST,
      payload: datasetPolicyNoteId
    };
  }

  public deleteFailure(datasetPolicyNoteId: number, error: any): DatasetPolicyNotesAction.IDeleteFailureAction {
    return {
      type: DatasetPolicyNotesActionType.DELETE_FAILURE,
      payload: {
        id: datasetPolicyNoteId,
        error
      },
      error: true
    };
  }

  public deleteSuccess(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteSuccessAction {
    return {
      type: DatasetPolicyNotesActionType.DELETE_SUCCESS,
      payload: datasetPolicyNoteId
    };
  }

  public deleteReset(datasetPolicyNoteId: number): DatasetPolicyNotesAction.IDeleteResetAction {
    return {
      type: DatasetPolicyNotesActionType.DELETE_RESET,
      payload: datasetPolicyNoteId
    };
  }

  public deleteSuccessAllActions(deletedDatasetPolicyNote: IAPIDeletedDatasetPolicyNote): AnyAction[] {
    const updateDatasetAction: DatasetsAction.IUpdateAction = datasetsActions.update({
      id: deletedDatasetPolicyNote.datasetId,
      removeDatasetPolicyNoteIds: [deletedDatasetPolicyNote.id]
    });

    const successAction: DatasetPolicyNotesAction.IDeleteSuccessAction = this.deleteSuccess(
      deletedDatasetPolicyNote.id
    );

    return [updateDatasetAction, successAction];
  }

  normalize(apiEntities: APIDatasetPolicyNote[]): [DatasetPolicyNote[], IPerson[], IUpdatedDataset[]] {
    const notes: DatasetPolicyNote[] = [];
    const people: IPerson[] = [];

    const peopleIds: List<boolean> = {};

    const datasetIds: number[] = [];

    const idsByDatasetId: { [datasetId: number]: number[] } = {};

    for (const apiEntity of apiEntities) {
      const { contactPeople, datasetId, id, ...rest } = apiEntity;

      const contactIds: number[] = [];

      if (idsByDatasetId[datasetId] === undefined) {
        idsByDatasetId[datasetId] = [id];
        datasetIds.push(datasetId);
      } else {
        idsByDatasetId[datasetId].push(id);
      }

      for (const person of contactPeople) {
        contactIds.push(person.id);

        if (peopleIds[person.id] !== true) {
          peopleIds[person.id] = true;
          people.push(person);
        }
      }

      notes.push({
        ...rest,
        id,
        datasetId,
        contactIds
      });
    }

    const updateDatasets: IUpdatedDataset[] = datasetIds.map((id: number) => ({
      id,
      addDatasetPolicyNoteIds: idsByDatasetId[id]
    }));

    return [notes, people, updateDatasets];
  }

  public normalizeOne(apiEntity: APIDatasetPolicyNote): [DatasetPolicyNote, IPerson[], IUpdatedDataset] {
    const { contactPeople, datasetId, id, ...rest } = apiEntity;

    const policyNote: DatasetPolicyNote = {
      ...rest,
      id,
      datasetId,
      contactIds: contactPeople.map((person: IPerson) => person.id)
    };

    return [policyNote, contactPeople, { id: datasetId, addDatasetPolicyNoteIds: [id] }];
  }

  add(noteOrNotes: DatasetPolicyNote | DatasetPolicyNote[]): DatasetPolicyNotesAction.IAddAction {
    return {
      type: DatasetPolicyNotesActionType.ADD,
      payload: Array.isArray(noteOrNotes) ? noteOrNotes : [noteOrNotes]
    };
  }

  addFromAPI(apiEntities: APIDatasetPolicyNote | APIDatasetPolicyNote[]): AnyAction[] {
    if (!Array.isArray(apiEntities)) {
      const [note, people, updateDataset]: [DatasetPolicyNote, IPerson[], IUpdatedDataset] =
        this.normalizeOne(apiEntities);

      return [peopleActions.add(people), this.add(note), datasetsActions.update(updateDataset)];
    }

    const [datasetPolicyNotes, people, updateDatasets]: [DatasetPolicyNote[], IPerson[], IUpdatedDataset[]] =
      this.normalize(apiEntities);

    return [peopleActions.add(people), this.add(datasetPolicyNotes), datasetsActions.update(updateDatasets)];
  }
}

const datasetPolicyNotesActions: DatasetPolicyNotesActions = new DatasetPolicyNotesActions();

export default datasetPolicyNotesActions;
