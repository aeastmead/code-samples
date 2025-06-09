/* eslint-disable @typescript-eslint/no-unused-vars */
import { DropdownOption } from '@bbnpm/bb-ui-framework';
import isNil from 'lodash/isNil';
import React from 'react';
import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import Validator, { ValidatorFn } from '../utils/validator';
import { IMultiDropdownEditFormProps, MultiDropdownEditForm } from './SharedEditForms';
import {
  EditFormFieldName,
  editFormsSelectors,
  EntityKind,
  lookupsSelectors,
  resourceEditFormsActions
} from '../store';

const FIELD_NAME: EditFormFieldName<EntityKind.RESOURCE> = 'resourceTagIds';

type StateProps = {
  initialValue: number[] | undefined;
  options: DropdownOption[] | undefined;
  saved: boolean;
  loading: boolean;
  hasRootError: boolean;
  rootError: string | undefined;
};

type DispatchProps = {
  onSubmit: (resourceFieldTagIds: number[] | undefined) => void;
  onCancel: () => void;
  onComplete: () => void;
};

type ConfigProps = {
  label: string;
  validate: ValidatorFn | undefined;
};

export interface IResourceTagEditFormProps
  extends Omit<IMultiDropdownEditFormProps<number>, keyof StateProps | keyof DispatchProps | keyof ConfigProps> {
  entityId: number;
  required?: boolean;
  onClose: () => void;
}

function mapStateToPropsFactory(): MapStateToProps<StateProps, IResourceTagEditFormProps> {
  const savingSelectors: editFormsSelectors.GetSaveSelectors = editFormsSelectors.makeSaveSelector(
    EntityKind.RESOURCE,
    FIELD_NAME
  );

  const getTagTypeResourceTagOptions: lookupsSelectors.GetTagTypeResourceFieldTagOptions =
    lookupsSelectors.makeGetTagTypeResourceTagOptions();

  return (state: DefaultRootState, ownProps: IResourceTagEditFormProps) => {
    const options: DropdownOption[] | undefined = getTagTypeResourceTagOptions(state, ownProps);

    if (options === undefined) {
      return {
        initialValue: undefined,
        options: undefined,
        saved: false,
        loading: true,
        hasRootError: false,
        rootError: undefined
      };
    }
    const saveProps = { id: ownProps.entityId };
    return {
      initialValue: state.resource?.data?.tagIds,
      options,
      saved: savingSelectors.getSaved(state, saveProps),
      loading: false,
      hasRootError: savingSelectors.getHasError(state, saveProps),
      rootError: savingSelectors.getErrorMessage(state, saveProps)
    };
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: IResourceTagEditFormProps): DispatchProps {
  const onComplete: () => void = () => {
    dispatch(resourceEditFormsActions.reset(FIELD_NAME, ownProps.entityId));
    ownProps.onClose();
  };

  return {
    onSubmit: (resourceTagIds: number[] | undefined) => {
      dispatch(
        resourceEditFormsActions.saveAsync(FIELD_NAME, ownProps.entityId, {
          resourceTagIds: !isNil(resourceTagIds) ? resourceTagIds : undefined
        })
      );
    },
    onComplete,
    onCancel: onComplete
  };
}

function mergeProps(
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  { entityId, required, ...ownProps }: IResourceTagEditFormProps
): IMultiDropdownEditFormProps<number> {
  const validate: ValidatorFn | undefined = required === true ? Validator.required : undefined;

  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    validate
  };
}

export default connect<StateProps, DispatchProps, IResourceTagEditFormProps, IMultiDropdownEditFormProps<number>>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(MultiDropdownEditForm as React.ComponentType<IMultiDropdownEditFormProps<number>>);
