/* eslint-disable @typescript-eslint/no-unused-vars */
import { DropdownOption } from '@bbnpm/bb-ui-framework';
import isNil from 'lodash/isNil';
import React from 'react';
import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { IResourceFieldTagEditModel } from '../types';
import Validator, { ValidatorFn } from '../utils/validator';
import { IMultiDropdownEditFormProps, MultiDropdownEditForm } from './SharedEditForms';
import {
  EditFormFieldName,
  editFormsSelectors,
  EntityKind,
  resourceFieldsSelectors,
  lookupsSelectors,
  resourceFieldEditFormsActions
} from '../store';

const FIELD_NAME: EditFormFieldName<EntityKind.RESOURCE_FIELD> = 'resourceFieldTags';

type StateProps = {
  initialValue: number[] | undefined;
  options: DropdownOption[] | undefined;
  saved: boolean;
  loading: boolean;
  hasRootError: boolean;
  rootError: string | undefined;
};

type DispatchProps = {
  onSubmit: (resourceFieldTagIds: number[] | undefined | null) => void;
  onCancel: () => void;
  onComplete: () => void;
};

type ConfigProps = {
  label: string;
  validate: ValidatorFn | undefined;
};

export interface IResourceFieldTagEditFormProps
  extends Omit<IMultiDropdownEditFormProps<number>, keyof StateProps | keyof DispatchProps | keyof ConfigProps> {
  entityId: number;
  tagTypeId: number;
  required?: boolean;
  onClose: () => void;
}

function mapStateToPropsFactory(): MapStateToProps<StateProps, IResourceFieldTagEditFormProps> {
  const getFieldTagTypeTagIds: resourceFieldsSelectors.GetTagTypeTagIds =
    resourceFieldsSelectors.makeGetTagTypeTagIds();
  const savingSelectors: editFormsSelectors.GetSaveSelectors = editFormsSelectors.makeSaveSelector(
    EntityKind.RESOURCE_FIELD,
    FIELD_NAME
  );

  const getTagTypeResourceFieldTagOptions: lookupsSelectors.GetTagTypeResourceFieldTagOptions =
    lookupsSelectors.makeGetTagTypeResourceFieldTagOptions();

  return (state: DefaultRootState, ownProps: IResourceFieldTagEditFormProps) => {
    const options: DropdownOption[] | undefined = getTagTypeResourceFieldTagOptions(state, {
      entityId: ownProps.tagTypeId
    });

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
      initialValue: getFieldTagTypeTagIds(state, ownProps),
      options,
      saved: savingSelectors.getSaved(state, saveProps),
      loading: false,
      hasRootError: savingSelectors.getHasError(state, saveProps),
      rootError: savingSelectors.getErrorMessage(state, saveProps)
    };
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: IResourceFieldTagEditFormProps): DispatchProps {
  const onComplete: () => void = () => {
    dispatch(resourceFieldEditFormsActions.reset(FIELD_NAME, ownProps.entityId));
    ownProps.onClose();
  };

  return {
    onSubmit: (resourceFieldTagIds: number[] | undefined | null) => {
      const resourceFieldTags: IResourceFieldTagEditModel = {
        tagTypeId: ownProps.tagTypeId,
        tagIds: !isNil(resourceFieldTagIds) && resourceFieldTagIds.length > 0 ? resourceFieldTagIds : undefined
      };
      dispatch(
        resourceFieldEditFormsActions.saveAsync(FIELD_NAME, ownProps.entityId, {
          resourceFieldTags
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
  { entityId, tagTypeId, required, ...ownProps }: IResourceFieldTagEditFormProps
): IMultiDropdownEditFormProps<number> {
  const validate: ValidatorFn | undefined = required === true ? Validator.required : undefined;

  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    validate
  };
}

export default connect<StateProps, DispatchProps, IResourceFieldTagEditFormProps, IMultiDropdownEditFormProps<number>>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(MultiDropdownEditForm as React.ComponentType<IMultiDropdownEditFormProps<number>>);
