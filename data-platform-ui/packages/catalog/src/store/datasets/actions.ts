import isNil from 'lodash/isNil';
import { DefaultRootState } from 'react-redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { IAPIDataset, Dataset, IError, IPerson, IResource } from '../../types';
import { _getExists } from './selectors';

import ErrorsUtil from '../../utils/errors';
import { PeopleAction, peopleActions } from '../people';
import { DatasetsAction, DatasetsActionType, IUpdatedDataset } from './types';

class DatasetsActions implements IDatasetsActions {
  constructor() {
    this.fetchAsync = this.fetchAsync.bind(this);
    this.fetchRequest = this.fetchRequest.bind(this);
    this.fetchFailure = this.fetchFailure.bind(this);
    this.fetchSuccess = this.fetchSuccess.bind(this);
    this.add = this.add.bind(this);
    this.createAddActions = this.createAddActions.bind(this);
    this.update = this.update.bind(this);
    this.updateFromAPI = this.updateFromAPI.bind(this);
    this.deleteAsync = this.deleteAsync.bind(this);
  }

  /**
   *
   * @param {number} id
   * @param [snapshotOnly=false] If false or undefined, all fields are loaded, If true, only snapshot fields are loaded.
   * @return {DefaultThunkAction<Promise<Dataset | null>>}
   */
  public fetchAsync(
    id: number,
    snapshotOnly?: boolean,
    forceReload?: boolean
  ): DefaultThunkAction<Promise<Dataset | undefined>> {
    /**
     * @param {DefaultThunkDispatch} dispatch
     * @param {() => DefaultRootState} getState
     * @param {ThunkExtraArgument} container - Container created in the api folder
     */
    return async (
      dispatch: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      { datasetService }: ThunkExtraArgument
    ): Promise<Dataset | undefined> => {
      const snapshot: boolean = snapshotOnly === true;

      if (!forceReload && _getExists(getState(), { entityId: id, ignoreSnapshot: !snapshot })) {
        return undefined;
      }

      dispatch(this.fetchRequest(id, snapshot));

      let result: Dataset | undefined;

      const actions: (
        | DatasetsAction.IFetchSuccessAction
        | DatasetsAction.IFetchFailureAction
        | PeopleAction.IAddAction
      )[] = [];

      const getRequest: Promise<IAPIDataset | undefined> = snapshot
        ? datasetService.getSnapshot(id)
        : datasetService.getById(id);

      try {
        const apiDataset: IAPIDataset | undefined = await getRequest;

        if (isNil(apiDataset)) {
          const notFoundError: IError = ErrorsUtil.entityNotFound('Dataset not found');
          actions.push(this.fetchFailure(id, notFoundError));
        } else {
          const { dataset, people }: DatasetNormalized = DatasetsActions._normalize(apiDataset);
          actions.push(peopleActions.add(people));
          actions.push(this.fetchSuccess(dataset));
          result = dataset;
        }
      } catch (cause: any) {
        const error: IError = ErrorsUtil.apiErrorWithCause(cause, cause.message);
        actions.push(this.fetchFailure(id, error));
      }
      for (const action of actions) {
        dispatch(action);
      }
      return result;
    };
  }

  public fetchFailure(id: number, error: any): DatasetsAction.IFetchFailureAction {
    return {
      type: DatasetsActionType.FETCH_FAILURE,
      payload: { id, error },
      error: true
    };
  }

  public fetchRequest(datasetId: number, snapshot?: boolean): DatasetsAction.IFetchRequestAction {
    return {
      type: DatasetsActionType.FETCH_REQUEST,
      payload: { datasetId, snapshot: snapshot === true }
    };
  }

  public fetchSuccess(entity: Dataset): DatasetsAction.IFetchSuccessAction {
    return {
      type: DatasetsActionType.FETCH_SUCCESS,
      payload: entity
    };
  }

  public reset(id: number): DatasetsAction.IResetAction {
    return {
      type: DatasetsActionType.RESET,
      payload: id
    };
  }

  public deleteAsync(datasetId: number): DefaultThunkAction<Promise<number | undefined>> {
    return (
      _: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      { datasetService }: ThunkExtraArgument
    ): Promise<number> => {
      return datasetService.delete(datasetId);
    };
  }

  /**
   * Partial update of dataset.
   * @param {IUpdatedDataset | IUpdatedDataset[]} datasetOrDatasets
   * @return {DatasetsAction.IUpdateAction}
   */
  public update(datasetOrDatasets: IUpdatedDataset | IUpdatedDataset[]): DatasetsAction.IUpdateAction {
    return {
      type: DatasetsActionType.UPDATE,
      payload: Array.isArray(datasetOrDatasets) ? datasetOrDatasets : [datasetOrDatasets]
    };
  }

  public add(datasetOrDatasets: Dataset | Dataset[]): DatasetsAction.IAddAction {
    return {
      type: DatasetsActionType.ADD,
      payload: Array.isArray(datasetOrDatasets) ? datasetOrDatasets : [datasetOrDatasets]
    };
  }

  public createAddActions(
    datasetOrDatasets: IAPIDataset | IAPIDataset[]
  ): (DatasetsAction.IAddAction | PeopleAction.IAddAction)[] {
    const apiDatasets: IAPIDataset[] = Array.isArray(datasetOrDatasets) ? datasetOrDatasets : [datasetOrDatasets];

    const datasets: Dataset[] = [];

    const people: IPerson[] = [];

    for (const apiDataset of apiDatasets) {
      const normalized: DatasetNormalized = DatasetsActions._normalize(apiDataset);
      datasets.push(normalized.dataset);
      people.push(...normalized.people);
    }

    return [peopleActions.add(people), this.add(datasets)];
  }

  /**
   * Partial update of dataset and owners using APIDataset object.
   * @param {IUpdatedDataset | IUpdatedDataset[]} datasetOrArray
   * @return {(DatasetsAction.IUpdateAction | PeopleAction.IAddAction)[]}
   */
  public updateFromAPI(
    datasetOrArray: IAPIDataset | IAPIDataset[]
  ): (DatasetsAction.IUpdateAction | PeopleAction.IAddAction)[] {
    const datasets: IUpdatedDataset[] = [];
    const people: IPerson[] = [];

    const items: IAPIDataset[] = !Array.isArray(datasetOrArray) ? [datasetOrArray] : datasetOrArray;

    for (const item of items) {
      const [dataset, _people] = DatasetsActions._toUpdated(item);
      datasets.push(dataset);
      if (_people.length > 0) {
        Array.prototype.push.apply(people, _people);
      }
    }

    const actions: (DatasetsAction.IUpdateAction | PeopleAction.IAddAction)[] = [this.update(datasets)];

    if (people.length > 0) {
      actions.push(peopleActions.add(people));
    }

    return actions;
  }

  public createUpdateFromResource(resources: IResource[]): IUpdatedDataset[] | undefined {
    const dataMap: List<number[]> = [];

    const ids: number[] = [];

    for (const resource of resources) {
      if (isNil(resource.datasetId)) {
        continue;
      }
      if (dataMap[resource.datasetId] === undefined) {
        dataMap[resource.datasetId] = [resource.id];
        ids.push(resource.datasetId);
      } else {
        dataMap[resource.datasetId].push(resource.id);
      }
    }

    return ids.length > 0 ? ids.map((id: number) => ({ id, addResourceIds: dataMap[id] })) : undefined;
  }

  private static _normalize({
    people: _people,
    dataOwners: _dataOwners,
    engineeringOwners: _engineeringOwners,
    ...dataset
  }: IAPIDataset): DatasetNormalized {
    const approvers = this._normalizeOwners(_people);
    const dataOwnersNormalized = this._normalizeOwners(_dataOwners);
    const engineeringOwnersNormalized = this._normalizeOwners(_engineeringOwners);

    const people: IPerson[] = [
      ...approvers.people,
      ...dataOwnersNormalized.people,
      ...engineeringOwnersNormalized.people
    ];

    return {
      dataset: {
        ...dataset,
        datasetPolicyNoteIds: undefined,
        personIds: approvers.ids.length > 0 ? approvers.ids : undefined,
        dataOwnerIds: dataOwnersNormalized.ids.length > 0 ? dataOwnersNormalized.ids : undefined,
        engineeringOwnerIds: engineeringOwnersNormalized.ids.length > 0 ? engineeringOwnersNormalized.ids : undefined
      },
      people
    };
  }

  private static _normalizeOwners(owners: IPerson[] | undefined): NormalizedOwners {
    if (owners === undefined || owners.length < 1) {
      return {
        ids: [],
        people: []
      };
    }
    const ids: number[] = [];
    const people: IPerson[] = [];
    owners.forEach(person => {
      people.push({ ...person });
      ids.push(person.id);
    });
    return { ids, people };
  }

  private static _toUpdated({
    id,
    name,
    description,
    dataOwnerGroupId,
    dataOwners,
    engineeringOwnerGroupId,
    engineeringOwners,
    people,
    canEdit,
    isRestricted,
    canRestrictState
  }: IAPIDataset): [IUpdatedDataset, IPerson[]] {
    const result: IUpdatedDataset = {
      id,
      name,
      description,
      dataOwnerGroupId,
      engineeringOwnerGroupId
    };

    if (typeof isRestricted === 'boolean') {
      result.isRestricted = isRestricted;
    }
    if (!isNil(canRestrictState)) {
      result.canRestrictState = canRestrictState;
    }

    if (typeof canEdit === 'boolean') {
      result.canEdit = canEdit;
    }

    let peopleResult: IPerson[] | undefined;

    if (!isNil(people) && people.length > 0) {
      result.personIds = people.map((person: IPerson) => person.id);
      peopleResult = [...people];
    }
    if (!isNil(dataOwners) && dataOwners.length > 0) {
      result.dataOwnerIds = dataOwners.map((person: IPerson) => person.id);
      peopleResult = peopleResult?.concat(dataOwners);
    }
    if (!isNil(engineeringOwners) && engineeringOwners.length > 0) {
      result.engineeringOwnerIds = engineeringOwners.map((person: IPerson) => person.id);
      peopleResult = peopleResult?.concat(engineeringOwners);
    }
    return [result, peopleResult || []];
  }
}

const datasetsActions: IDatasetsActions = new DatasetsActions();
export default datasetsActions;

export interface IDatasetsActions {
  reset(id: number): DatasetsAction.IResetAction;
  fetchFailure(id: number, error: any): DatasetsAction.IFetchFailureAction;
  fetchSuccess(entity: Dataset): DatasetsAction.IFetchSuccessAction;
  fetchRequest(id: number): DatasetsAction.IFetchRequestAction;
  fetchAsync(
    id: number,
    snapshotOnly?: boolean,
    forceReload?: boolean
  ): DefaultThunkAction<Promise<Dataset | undefined>>;

  update(datasetOrDatasets: IUpdatedDataset | IUpdatedDataset[]): DatasetsAction.IUpdateAction;

  updateFromAPI(dataset: IAPIDataset | IAPIDataset[]): (DatasetsAction.IUpdateAction | PeopleAction.IAddAction)[];

  deleteAsync(datasetId: number): DefaultThunkAction<Promise<number | undefined>>;
  add(dataset: Dataset | Dataset[]): DatasetsAction.IAddAction;

  createAddActions(datasets: IAPIDataset | IAPIDataset[]): (DatasetsAction.IAddAction | PeopleAction.IAddAction)[];

  createUpdateFromResource(resources: IResource[]): IUpdatedDataset[] | undefined;
}

type DatasetNormalized = {
  dataset: Dataset;
  people: IPerson[];
};

type NormalizedOwners = {
  ids: number[];
  people: IPerson[];
};
