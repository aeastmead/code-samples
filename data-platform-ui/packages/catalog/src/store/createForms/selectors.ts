import { DefaultRootState } from 'react-redux';
import { createSelector, Selector } from 'reselect';
import type { SaveFormProps } from '../../types';
import { EntityKind } from '../shared';
import { CreateFormChildState } from './types';

const createSelectChildState: (kind: EntityKind) => Selector<DefaultRootState, ChildState | undefined> =
  (kind: EntityKind) =>
  ({ createForms }: DefaultRootState) =>
    createForms[kind];

const createGetSaveProps: (kind: EntityKind) => GetSaveProps = (kind: EntityKind) =>
  createSelector(createSelectChildState(kind), (childState: ChildState | undefined) => {
    const result: CreateSaveFormProps = {
      entityId: undefined,
      hasRootError: false,
      rootError: undefined,
      saved: false
    };

    if (childState === undefined) {
      return result;
    }

    if (childState.saved) {
      result.saved = true;
      result.entityId = childState.entityId;
      return result;
    }

    return !childState.didInvalidate
      ? result
      : { ...result, hasRootError: true, rootError: childState?.error?.message ?? 'Something went wrong' };
  });

export const getDatasetSaveProps: GetSaveProps = createGetSaveProps(EntityKind.DATASET);

export const getResourceSaveProps: GetSaveProps = createGetSaveProps(EntityKind.RESOURCE);

export const getDatasetPolicyNoteSaveProps: GetSaveProps = createGetSaveProps(EntityKind.DATASET_POLICY_NOTE);

type ChildState = CreateFormChildState;

export type GetSaveProps = Selector<DefaultRootState, CreateSaveFormProps>;

export interface CreateSaveFormProps extends SaveFormProps {
  entityId: number | undefined;
}
