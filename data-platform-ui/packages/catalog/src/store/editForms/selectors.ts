import { DefaultRootState } from 'react-redux';
import { createSelector, ParametricSelector, Selector } from 'reselect';
import isNil from 'lodash/isNil';
import { EntityIdParams, EntityKind, ISaveState, SaveStatus } from '../shared';
import { EditFormFieldName } from './types';
import EditFormsUtils from './utils';
import { classificationAnswerEditFormActions } from './actions';

function selectStateWithParamsFactory<Kind extends EntityKind>(
  kind: Kind,
  fieldName: EditFormFieldName<Kind>
): ParametricSelector<DefaultRootState, Params | EntityIdParams, SubState | undefined> {
  return (state: DefaultRootState, params: Params | EntityIdParams): SubState | undefined => {
    const entityId: number = 'entityId' in params ? params.entityId : params.id;
    const stateId = EditFormsUtils.editFormStateId({ kind, fieldName, id: entityId });

    return state.editForms[stateId];
  };
}

function selectStateFactory<Kind extends EntityKind>(
  kind: Kind,
  fieldName: EditFormFieldName<Kind>
): Selector<DefaultRootState, SubState | undefined> {
  return (state: DefaultRootState) => {
    const stateId = EditFormsUtils.editFormStateId({ kind, fieldName });

    return state.editForms[stateId];
  };
}

export const makeSaveSelector: <Kind extends EntityKind>(
  kind: Kind,
  fieldName: EditFormFieldName<Kind>
) => GetSaveSelectors = <Kind extends EntityKind>(kind: Kind, fieldName: EditFormFieldName<Kind>): GetSaveSelectors => {
  const selectState: ParametricSelector<DefaultRootState, Params | EntityIdParams, SubState | undefined> =
    selectStateWithParamsFactory(kind, fieldName);

  return {
    getSaved: createSelector(selectState, (saveState: SubState | undefined) => saveState?.saved === true),
    getHasError: createSelector(selectState, (saveState: SubState | undefined) => saveState?.didInvalidate === true),
    getErrorMessage: createSelector(selectState, (saveState: SubState | undefined) => {
      if (isNil(saveState)) {
        return undefined;
      }
      return saveState?.error?.message ?? 'Something went wrong';
    })
  };
};

export const makeGetSaveProps: <Kind extends EntityKind>(
  kind: Kind,
  fieldName: EditFormFieldName<Kind>
) => GetSaveProps = <Kind extends EntityKind>(kind: Kind, fieldName: EditFormFieldName<Kind>) => {
  const selectState = selectStateFactory(kind, fieldName);

  return createSelector(selectState, (saveState: SubState | undefined): SaveProps => {
    if (saveState === undefined) {
      return {
        saved: false,
        hasRootError: false,
        rootError: undefined
      };
    }

    if (saveState.saved) {
      return {
        saved: true,
        rootError: undefined,
        hasRootError: false
      };
    }

    return saveState.didInvalidate
      ? { saved: false, hasRootError: true, rootError: saveState.error?.message ?? 'Something went wrong' }
      : { saved: false, hasRootError: false, rootError: undefined };
  });
};

export function makeDCEditFormSaveSelectors(): GetSaveSelectors {
  return makeSaveSelector(EntityKind.CLASSIFICATION_ANSWER, classificationAnswerEditFormActions.FIELD_NAME);
}

export function makeGetFieldSaveState<Kind extends EntityKind>(
  kind: Kind,
  fieldName: EditFormFieldName<Kind>,
  entityId: number
) {
  const stateId = EditFormsUtils.editFormStateId({ kind, fieldName, id: entityId });
  return createSelector(
    (state: DefaultRootState) => state.editForms[stateId],
    (saveState: ISaveState | undefined): GetFieldSaveState.Results => {
      if (saveState === undefined) {
        return { status: SaveStatus.IDLE, errorMessage: undefined };
      }

      if (saveState.didInvalidate) {
        return {
          status: SaveStatus.INVALIDATED,
          errorMessage: saveState.error?.message ?? 'Unable to save change'
        };
      }
      if (saveState.saved) {
        return { status: SaveStatus.SAVED, errorMessage: undefined };
      }

      return { status: saveState.isSaving ? SaveStatus.SAVING : SaveStatus.SAVED, errorMessage: undefined };
    }
  );
}
export type GetFieldSaveState = Selector<DefaultRootState, GetFieldSaveState.Results>;

export namespace GetFieldSaveState {
  export interface Results {
    status: SaveStatus;

    errorMessage: string | undefined;
  }
}
type SubState = ISaveState;

type Params = {
  id: number;
};

export type GetSaveSelectors = {
  getSaved: ParametricSelector<DefaultRootState, Params | EntityIdParams, boolean>;
  getHasError: ParametricSelector<DefaultRootState, Params | EntityIdParams, boolean>;

  getErrorMessage: ParametricSelector<DefaultRootState, Params | EntityIdParams, string | undefined>;
};

export type GetSaveProps = Selector<DefaultRootState, SaveProps>;

export type SaveProps = {
  saved: boolean;
  hasRootError: boolean;
  rootError: string | undefined;
};
