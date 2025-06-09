import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { IResourceField, IResourceWithFields } from '../../types';
import { IResourceState } from './types';

const selectState: Selector<DefaultRootState, State> = ({ resource }: DefaultRootState) => resource;

export const _getResource: Selector<DefaultRootState, IResourceWithFields | undefined> = createSelector(
  selectState,
  ({ data }: State) => (!isNil(data) ? data : undefined)
);

export const getFields: Selector<DefaultRootState, IResourceField[] | undefined> = createSelector(
  selectState,
  ({ data }: State) => (!isNil(data) && !isNil(data.fields) && data.fields.length > 0 ? data?.fields : undefined)
);

export const makeGetResource: () => GetResourceSelector = () =>
  createSelector(_getResource, (resource: IResourceWithFields | undefined) => resource);

export const getTagIds: Selector<DefaultRootState, number[] | undefined> = createSelector(
  selectState,
  ({ data }: State) => (!isNil(data) && !isNil(data.tagIds) && data.tagIds.length > 0 ? data?.tagIds : undefined)
);

export const makeGetField: () => GetFieldSelector = () =>
  createSelector(
    getFields,
    (_: DefaultRootState, props: Params) => props.entityId,
    (fields: IResourceField[] | undefined, fieldId: number) => {
      if (!isNil(fields)) {
        for (const field of fields) {
          if (field.id === fieldId) {
            return { ...field };
          }
        }
      }

      return undefined;
    }
  );

type State = IResourceState;

type Params = {
  entityId: number;
};

export type GetResourceSelector = ParametricSelector<DefaultRootState, Params, IResourceWithFields | undefined>;

export type GetFieldSelector = ParametricSelector<DefaultRootState, Params, IResourceField | undefined>;
