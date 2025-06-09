/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditFormFieldName, editFormsSelectors, EntityKind } from '../../store';
import resourceEditFormsActions from '../../store/editForms/actions/resourceEditFormsActions';
import { Dispatch } from 'redux';
import { MapStateToProps, DefaultRootState, connect } from 'react-redux';
import SingleInputEditForm, { ISingleInputEditFormProps } from '../SharedEditForms/SingleInputEditForm';
import Validator, { ValidatorFn } from '../../utils/validator';

const NAME_VALIDATOR: ValidatorFn = Validator.compose(
  Validator.required,
  Validator.minLength(5),
  Validator.maxLength(125)
);

const FIELD_NAME: EditFormFieldName<EntityKind.RESOURCE> = 'alias';

function mapStateToPropsFactory(): MapStateToProps<StateProps, OwnProps> {
  const savingSelectors: editFormsSelectors.GetSaveProps = editFormsSelectors.makeGetSaveProps(
    EntityKind.RESOURCE,
    FIELD_NAME
  );

  return (state: DefaultRootState, ownProps: OwnProps) => {
    const selectors = savingSelectors(state);

    return {
      initialValue: state.resource?.data?.alias || state.resource?.data?.name || '',
      loading: false,
      saved: selectors.saved,
      hasRootError: selectors.hasRootError,
      rootError: selectors.rootError
    };
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, { ...ownProps }: OwnProps): MergedProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    label: 'Name',
    type: 'text',
    validate: NAME_VALIDATOR
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  const onComplete: () => void = () => {
    dispatch(resourceEditFormsActions.reset(FIELD_NAME));
    ownProps.onClose();
  };
  return {
    onSubmit: (alias: string) => {
      dispatch(resourceEditFormsActions.saveAsync(FIELD_NAME, { alias }));
    },
    onComplete,
    onCancel: onComplete
  };
}

export default connect<StateProps, DispatchProps, OwnProps, MergedProps>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(SingleInputEditForm);

type StateProps = {
  initialValue: string;
  saved: boolean;
  loading: boolean;
  hasRootError: boolean;
  rootError: string | undefined;
};

type DispatchProps = {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  onComplete: () => void;
};

type ConfigProps = {
  label: string;
  validate: ValidatorFn;
  type: 'text';
};

export interface IResourceNameProps
  extends Omit<ISingleInputEditFormProps<string>, keyof StateProps | keyof DispatchProps | keyof ConfigProps | 'id'> {
  /**
   * Dataset id
   */
  onClose: () => void;
}

type OwnProps = IResourceNameProps;

type MergedProps = ISingleInputEditFormProps<any>;
