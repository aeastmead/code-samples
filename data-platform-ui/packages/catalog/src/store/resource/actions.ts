import { batch } from 'react-redux';
import { AnyAction } from 'redux';
import { DefaultThunkAction, DefaultThunkDispatch, ThunkExtraArgument } from 'redux-thunk';
import { resourcesActions } from '../resources';
import { ResourceAction, ResourceActionType } from './types';
import type { IAPIResource, IAPIResourceField, IPerson, IResourceWithFields } from '../../types';
import { peopleActions } from '../people';

class ResourceActions implements IResourceActions {
  constructor() {
    this.fetchRequest = this.fetchRequest.bind(this);
    this.fetchSuccess = this.fetchSuccess.bind(this);
    this.fetchFailure = this.fetchFailure.bind(this);
    this.updateResource = this.updateResource.bind(this);
    this.getResource = this.getResource.bind(this);
    this.updateFromAPI = this.updateFromAPI.bind(this);
  }

  public fetchRequest(id: number): ResourceAction.IFetchResourceAction {
    return { type: ResourceActionType.FETCH_REQUEST, payload: { id } };
  }
  public fetchSuccess(resource: IResourceWithFields): ResourceAction.IFetchSuccessAction {
    return { type: ResourceActionType.FETCH_SUCCESS, payload: resource };
  }

  public fetchFailure(id: number, error: string): ResourceAction.IFetchFailureAction {
    return {
      type: ResourceActionType.FETCH_FAILURE,
      payload: { id, error },
      error: true
    };
  }

  public reset(id: number): ResourceAction.IResetAction {
    return {
      type: ResourceActionType.RESET,
      payload: {
        id
      },
      error: false
    };
  }

  public updateField(field: IAPIResourceField): ResourceAction.IUpdateFieldAction {
    return {
      type: ResourceActionType.UPDATE_FIELD,
      payload: field as any
    };
  }

  public updateResource(resource: IResourceWithFields): ResourceAction.IUpdate {
    return {
      type: ResourceActionType.UPDATE,
      payload: resource
    };
  }

  public updateFromAPI(updatedResourceStore: IAPIResource): AnyAction[] {
    const normalizedData = this._normalize(updatedResourceStore);
    const resource = normalizedData?.resource;

    const actions: AnyAction[] = [this.updateResource(resource)];

    actions.push(...resourcesActions.addFromAPI(updatedResourceStore));
    return actions;
  }

  public getResource(resourceId: number): DefaultThunkAction<Promise<void>> {
    // the resourceService gets injected by the api container on store creation.
    return async (dispatch: DefaultThunkDispatch, _, { resourceService }: ThunkExtraArgument) => {
      dispatch(this.fetchRequest(resourceId));
      let resource: IAPIResource | undefined;
      try {
        resource = await resourceService.getById(resourceId);
      } catch (error: any) {
        dispatch(this.fetchFailure(resourceId, error));
        return undefined;
      }
      if (resource === undefined) {
        dispatch(this.fetchFailure(resourceId, 'Resource undefined'));
        return undefined;
      }

      const otherActions: AnyAction[] = resourcesActions.addFromAPI(resource);
      const normalizedData: ResourceNormalized = this._normalize(resource);

      batch(() => {
        for (const action of otherActions) {
          dispatch(action);
        }

        dispatch(peopleActions.add(normalizedData.people));
        dispatch(this.fetchSuccess(normalizedData.resource));
      });
      return undefined;
    };
  }

  private _normalize(apiResource: IAPIResource): ResourceNormalized {
    // the only thing that is different between a resource and an api resource right now is the ownership
    const engineeringOwners = this._normalizeOwners(apiResource.engineeringOwners);
    const dataOwners = this._normalizeOwners(apiResource.dataOwners);
    const people: IPerson[] = [...engineeringOwners.people, ...dataOwners.people];
    const { id, resourceType, name, description, fields, tags } = apiResource;

    let tagIds: number[] = [];
    if (tags !== undefined && tags.length > 0) {
      tagIds = tags.map(tag => tag.id);
    }
    return {
      people,
      resource: {
        id,
        resourceType,
        resourceTypeId: apiResource.resourceTypeId,
        name,
        alias: apiResource.alias,
        description,
        fields: fields as any[],
        engineeringOwnerIds: engineeringOwners.ids,
        dataOwnerIds: dataOwners.ids,
        engineeringOwnerGroupId: apiResource.engineeringOwnerGroupId,
        dataOwnerGroupId: apiResource.dataOwnerGroupId,
        datasetId: apiResource.datasetId,
        canEdit: apiResource.canEdit,
        externalReports: apiResource.externalReports,
        locationName: apiResource.locationName,
        cluster: apiResource.cluster,
        daysToArchive: apiResource.daysToArchive,
        daysToRetain: apiResource.daysToRetain,
        retentionNotes: apiResource.retentionNotes,
        tagIds
      }
    };
  }

  private _normalizeOwners(owners: IPerson[] | undefined): NormalizedOwners {
    if (owners === undefined) {
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
}

export interface IResourceActions {
  fetchRequest(id: number): ResourceAction.IFetchResourceAction;
  fetchSuccess(resource: IResourceWithFields): ResourceAction.IFetchSuccessAction;
  fetchFailure(id: number, error: string): ResourceAction.IFetchFailureAction;
  reset(id: number): ResourceAction.IResetAction;
  getResource(resourceID: number): DefaultThunkAction<Promise<void>>;
  updateField(field: IAPIResourceField): ResourceAction.IUpdateFieldAction;
  updateResource(resource: IResourceWithFields): ResourceAction.IUpdate;
  updateFromAPI(apiResource: IAPIResource): AnyAction[];
}

type ResourceNormalized = {
  resource: IResourceWithFields;
  people: IPerson[];
};

type NormalizedOwners = {
  ids: number[];
  people: IPerson[];
};

const resourceActions: IResourceActions = new ResourceActions();
export default resourceActions;
