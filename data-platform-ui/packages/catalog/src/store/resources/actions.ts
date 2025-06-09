import { batch, DefaultRootState } from 'react-redux';
import { AnyAction } from 'redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import type { IAPIResource, IError, IPerson, IResource, IResourceField } from '../../types';
import ErrorsUtil from '../../utils/errors';
import { datasetsActions, IUpdatedDataset } from '../datasets';
import { peopleActions } from '../people';
import { resourceActions } from '../resource';
import { resourceFieldsActions } from '../resourceFields';
import { NormalizerUtility } from '../shared';
import { INormalizedPeopleResult } from '../shared/normalizer';
import { _getById } from './selectors';
import * as selectors from './selectors';
import { ResourcesAction, ResourcesActionType } from './types';
import ResourcesStoreUtils from './utils';
import isNil from 'lodash/isNil';

class ResourcesActions implements IResourcesActions {
  constructor() {
    this.fetchByDatasetId = this.fetchByDatasetId.bind(this);
    this.batchFetchRequest = this.batchFetchRequest.bind(this);
    this.batchFetchSuccess = this.batchFetchSuccess.bind(this);
    this.batchFetchFailure = this.batchFetchFailure.bind(this);
    this.batchReset = this.batchReset.bind(this);

    this.resetByDatasetId = this.resetByDatasetId.bind(this);
    this.normalize = this.normalize.bind(this);
    this.normalizeOne = this.normalizeOne.bind(this);
  }

  public fetchByDatasetId(datasetId: number, forceRefresh?: boolean): DefaultThunkAction<Promise<boolean>> {
    const key = ResourcesStoreUtils.datasetIdBatchStatusKey(datasetId);
    const getHasFetched: selectors.GetHasFetched = selectors.makeHasFetched();
    return async (
      dispatch: DefaultThunkDispatch,
      getState: () => DefaultRootState,
      { resourceService }: ThunkExtraArgument
    ): Promise<boolean> => {
      const hasFetched: boolean = getHasFetched(getState(), { id: datasetId });
      if (forceRefresh !== true && hasFetched) {
        return Promise.resolve(true);
      }
      dispatch(this.batchFetchRequest(key));
      let actions: AnyAction[];

      let success = true;

      try {
        const apiResources: IAPIResource[] | undefined = await resourceService.getAllByDatasetId(datasetId);

        if (apiResources === undefined || apiResources.length <= 0) {
          actions = [this.batchFetchSuccess(key, undefined)];
        } else {
          actions = this.batchFetchSuccessAllActions(key, apiResources);
        }
      } catch (cause) {
        const error = ErrorsUtil.apiErrorWithCause(cause, 'Resource request failed');
        actions = [this.batchFetchFailure(key, error)];
        success = false;
      }

      if (actions.length === 1) {
        dispatch(actions[0]);
        return success;
      }

      batch(() => {
        for (const action of actions) {
          dispatch(action);
        }
      });

      return success;
    };
  }

  public batchFetchFailure(key: string, error: any): ResourcesAction.IBatchFetchFailureAction {
    return {
      type: ResourcesActionType.BATCH_FETCH_FAILURE,
      payload: {
        key,
        error
      },
      error: true
    };
  }

  public batchFetchRequest(key: string): ResourcesAction.IBatchFetchRequestAction {
    return {
      type: ResourcesActionType.BATCH_FETCH_REQUEST,
      payload: {
        key
      }
    };
  }

  public batchFetchSuccess(key: string, resources: IResource[] | undefined): ResourcesAction.IBatchFetchSuccessAction {
    return {
      type: ResourcesActionType.BATCH_FETCH_SUCCESS,
      payload: {
        key,
        resources
      }
    };
  }

  private batchFetchSuccessAllActions(key: string, apiResources: IAPIResource[]): AnyAction[] {
    const [resources, resourceFields, people, datasets]: NormalizedResult = this.normalize(apiResources);

    const actions: AnyAction[] = this._sideEffectAction([resourceFields, people, datasets]);
    actions.push(this.batchFetchSuccess(key, resources));
    return actions;
  }

  public batchReset(key: string): ResourcesAction.IBatchResetAction {
    return {
      type: ResourcesActionType.BATCH_RESET,
      payload: {
        key
      }
    };
  }

  public resetByDatasetId(datasetId: number): ResourcesAction.IBatchResetAction {
    return this.batchReset(ResourcesStoreUtils.datasetIdBatchStatusKey(datasetId));
  }

  public fetchAsync(resourceId: number): DefaultThunkAction<Promise<void>> {
    return async (
      dispatch: DefaultThunkDispatch,
      _: () => DefaultRootState,
      { resourceService }: ThunkExtraArgument
    ): Promise<void> => {
      dispatch(this.fetchRequest(resourceId));

      let actions: AnyAction[];

      try {
        const apiResource: IAPIResource | undefined = await resourceService.getById(resourceId);

        if (apiResource === undefined) {
          const notFoundError: IError = ErrorsUtil.entityNotFound('Resource not found');
          actions = [this.fetchFailed(resourceId, notFoundError)];
        } else {
          actions = this.fetchSuccessAllActions(apiResource);
        }
      } catch (cause: any) {
        const error: IError = ErrorsUtil.apiErrorWithCause(cause, cause.message);
        actions = [this.fetchFailed(resourceId, error)];
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

  public fetchFailed(resourceId: number, error: any): ResourcesAction.IFetchFailedAction {
    return {
      type: ResourcesActionType.FETCH_FAILURE,
      payload: {
        id: resourceId,
        error
      },
      error: true
    };
  }

  public fetchRequest(resourceId: number): ResourcesAction.IFetchRequestAction {
    return {
      type: ResourcesActionType.FETCH_REQUEST,
      payload: resourceId
    };
  }

  public fetchSuccess(resource: IResource): ResourcesAction.IFetchSuccessAction {
    return {
      type: ResourcesActionType.FETCH_SUCCESS,
      payload: resource
    };
  }

  private _sideEffectAction([resourceFields, people, updateDatasets]: [
    IResourceField[] | undefined,
    IPerson[] | undefined,
    IUpdatedDataset[] | undefined
  ]): AnyAction[] {
    const actions: AnyAction[] = [];
    if (people !== undefined) {
      actions.push(peopleActions.add(people));
    }
    if (updateDatasets !== undefined) {
      actions.push(datasetsActions.update(updateDatasets));
    }

    if (resourceFields !== undefined) {
      actions.unshift(resourceFieldsActions.add(resourceFields));
    }

    return actions;
  }

  private fetchSuccessAllActions(apiResource: IAPIResource): AnyAction[] {
    const [resource, resourceFields, people, datasets] = this.normalizeOne(apiResource);

    const actions: AnyAction[] = this._sideEffectAction([resourceFields, people, datasets]);

    actions.push(this.fetchSuccess(resource));

    return actions;
  }

  public fetchDetailsAsync(resourceId: number): DefaultThunkAction<Promise<void>> {
    return async (dispatch: DefaultThunkDispatch, getState: () => DefaultRootState): Promise<void> => {
      await dispatch(resourceActions.getResource(resourceId));

      const resource: IResource | undefined = _getById(getState(), { entityId: resourceId });

      if (resource === undefined || resource.datasetId === undefined) {
        return undefined;
      }

      await dispatch(datasetsActions.fetchAsync(resource.datasetId, true));
    };
  }

  public add(resourceOrResources: IResource | IResource[]): ResourcesAction.IAddAction {
    return {
      type: ResourcesActionType.ADD,
      payload: Array.isArray(resourceOrResources) ? resourceOrResources : [resourceOrResources]
    };
  }

  public addFromAPI(resourceOrResources: IAPIResource | IAPIResource[]): AnyAction[] {
    const [resources, resourceFields, people, updateDatasets]: NormalizedResult = this.normalize(resourceOrResources);
    const actions: AnyAction[] = this._sideEffectAction([resourceFields, people, updateDatasets]);
    actions.push(this.add(resources));

    return actions;
  }

  public normalize(apiResourceOrAPIResources: IAPIResource | IAPIResource[]): NormalizedResult {
    if (!Array.isArray(apiResourceOrAPIResources)) {
      const [resource, resourceFields, people, datasetChanges]: [
        IResource,
        IResourceField[] | undefined,
        IPerson[] | undefined,
        IUpdatedDataset[] | undefined
      ] = this.normalizeOne(apiResourceOrAPIResources);

      return [[resource], resourceFields, people, datasetChanges];
    }

    const resources: IResource[] = [];

    const resourceFields: IResourceField[] = [];

    const people: IPerson[] = [];

    for (const apiResource of apiResourceOrAPIResources) {
      const [resource, fields, newPeople]: NormalizeOneResult = this.normalizeOne(apiResource, true);

      resources.push(resource);

      if (fields !== undefined) {
        resourceFields.push(...fields);
      }

      if (newPeople !== undefined) {
        people.push(...newPeople);
      }
    }

    const datasets: IUpdatedDataset[] | undefined = datasetsActions.createUpdateFromResource(resources);
    return [
      resources,
      resourceFields.length > 0 ? resourceFields : undefined,
      people.length > 0 ? people : undefined,
      datasets !== undefined && datasets.length > 0 ? datasets : undefined
    ];
  }

  public normalizeOne(apiResource: IAPIResource, excludeDataset?: boolean): NormalizeOneResult {
    const { dataOwners, engineeringOwners, fields, tags, ...rest } = apiResource;

    const people: IPerson[] = [];

    const resource: IResource = {
      ...rest,
      dataOwnerIds: undefined,
      engineeringOwnerIds: undefined,
      fieldIds: undefined,
      retentionFieldId: undefined,
      tagIds: undefined
    };

    if (!isNil(tags) && tags.length > 0) {
      resource.tagIds = tags.map(tag => tag.id);
    }

    const normalPeople: INormalizedPeopleResult | undefined = NormalizerUtility.normalPeople(
      dataOwners,
      engineeringOwners
    );

    if (normalPeople !== undefined) {
      resource.dataOwnerIds = normalPeople.idBuckets[0];
      resource.engineeringOwnerIds = normalPeople.idBuckets[1];

      people.push(...normalPeople.allPeople);
    }

    let resourceFields: IResourceField[] | undefined;

    if (fields !== undefined && fields.length > 0) {
      const [fieldIds, _fields, retentionId]: [number[], IResourceField[], number | undefined] =
        resourceFieldsActions.normalize(fields);
      resource.fieldIds = fieldIds;
      resource.retentionFieldId = retentionId;
      resourceFields = _fields;
    }

    const datasetChanges: IUpdatedDataset[] | undefined =
      excludeDataset !== true ? datasetsActions.createUpdateFromResource([resource]) : undefined;

    return [resource, resourceFields, people, datasetChanges];
  }
}

const resourcesActions: IResourcesActions = new ResourcesActions();

export default resourcesActions;

export interface IResourcesActions {
  batchFetchRequest(key: string): ResourcesAction.IBatchFetchRequestAction;
  batchFetchSuccess(key: string, resources: IResource[] | undefined): ResourcesAction.IBatchFetchSuccessAction;
  batchFetchFailure(key: string, error: any): ResourcesAction.IBatchFetchFailureAction;
  batchReset(key: string): ResourcesAction.IBatchResetAction;

  /**
   * Filtered Resource list by dataset id
   * @param {number} datasetId
   * @return {DefaultThunkAction<Promise<boolean>>}
   */
  fetchByDatasetId(datasetId: number, forceRefresh?: boolean): DefaultThunkAction<Promise<boolean>>;
  resetByDatasetId(datasetId: number): ResourcesAction.IBatchResetAction;

  fetchAsync(resourceId: number): DefaultThunkAction<Promise<void>>;
  fetchRequest(resourceId: number): ResourcesAction.IFetchRequestAction;
  fetchSuccess(resource: IResource): ResourcesAction.IFetchSuccessAction;
  fetchFailed(resourceId: number, error: any): ResourcesAction.IFetchFailedAction;
  fetchDetailsAsync(resourceId: number): DefaultThunkAction<Promise<void>>;

  add(resourceOrResources: IResource | IResource[]): ResourcesAction.IAddAction;

  addFromAPI(resourceOrResources: IAPIResource | IAPIResource[]): AnyAction[];

  normalize(apiResourceOrAPIResources: IAPIResource | IAPIResource[]): NormalizedResult;
}

type NormalizedResult = [
  IResource[],
  IResourceField[] | undefined,
  IPerson[] | undefined,
  IUpdatedDataset[] | undefined
];

type NormalizeOneResult = [
  IResource,
  IResourceField[] | undefined,
  IPerson[] | undefined,
  IUpdatedDataset[] | undefined
];
