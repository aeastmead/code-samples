import { Action } from 'redux';
import { IDatasetCategory, Entity, ILookups, IPolicyNoteType, IResourceType, ITag } from '../../types';
import { IAsyncState } from '../shared';

export interface ILookupsState extends IAsyncState {
  datasetCategories?: ILookupChildState<IDatasetCategory>;
  resourceTypes?: ILookupChildState<IResourceType>;
  resourceFieldTags?: ILookupTagsState;
  resourceTags?: ILookupTagsState;
  policyNoteTypes?: ILookupChildState<IPolicyNoteType>;
}

export interface ILookupChildState<T extends Entity<number>> {
  entities: List<T>;
  ids: number[];
}

export interface ILookupSearchFacet {
  id: string;
  label: string;
  optionLabels: {
    [value: string]: string;
  };
  optionValues: string[];
}

export interface ILookupSearchFacetState {
  entities: Dictionary<ILookupSearchFacet>;
  ids: string[];
}

export interface ILookupTagsState extends ILookupChildState<ITag> {
  byTagTypeId: {
    [tagTypeId: number]: number[];
  };
}

export enum LookupsActionType {
  FETCH_REQUEST = 'Lookups/FetchRequest',
  FETCH_SUCCESS = 'Lookups/FetchSuccess',
  FETCH_FAILURE = 'Lookups/FetchFailure',
  RESET = 'Lookups/Reset'
}

export namespace LookupsAction {
  export interface IFetchRequestAction extends Action<LookupsActionType.FETCH_REQUEST> {}

  export interface IFetchSuccessAction extends Action<LookupsActionType.FETCH_SUCCESS> {
    payload: ILookups;
  }

  export interface IFetchFailureAction extends Action<LookupsActionType.FETCH_FAILURE> {
    payload: {
      error: any;
    };
    error: true;
  }

  export interface IResetAction extends Action<LookupsActionType.RESET> {}
}

export type LookupsActionUnion =
  | LookupsAction.IFetchRequestAction
  | LookupsAction.IFetchSuccessAction
  | LookupsAction.IFetchFailureAction
  | LookupsAction.IResetAction;
