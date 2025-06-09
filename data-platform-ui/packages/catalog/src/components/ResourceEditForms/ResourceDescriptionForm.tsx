import { EditFormFieldName, editFormsSelectors, EntityKind } from '../../store';
import resourceEditFormsActions from '../../store/editForms/actions/resourceEditFormsActions';
import { Dispatch } from 'redux';
import { MapStateToProps, DefaultRootState, connect } from 'react-redux';
import { TextAreaEditForm, ITextAreaEditFormProps } from '../SharedEditForms';
import Validator, { ValidatorFn } from '../../utils/validator';

const FIELD_NAME: EditFormFieldName<EntityKind.RESOURCE> = 'description';

function mapStateToPropsFactory(): MapStateToProps<StateProps, OwnProps> {
  const savingSelectors: editFormsSelectors.GetSaveProps = editFormsSelectors.makeGetSaveProps(
    EntityKind.RESOURCE,
    FIELD_NAME
  );

  return (state: DefaultRootState) => {
    const selectors = savingSelectors(state);
    return {
      initialValue: state.resource?.data?.description || '',
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
    validate: Validator.description
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  const onComplete: () => void = () => {
    dispatch(resourceEditFormsActions.reset(FIELD_NAME));
    ownProps.onClose();
  };
  return {
    onSubmit: (description: string) => {
      dispatch(resourceEditFormsActions.saveAsync(FIELD_NAME, { description }));
    },
    onComplete,
    onCancel: onComplete
  };
}

export default connect<StateProps, DispatchProps, OwnProps, MergedProps>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(TextAreaEditForm);

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
};

export interface IResourceDescriptionProps
  extends Omit<ITextAreaEditFormProps, keyof StateProps | keyof DispatchProps | keyof ConfigProps | 'id'> {
  /**
   * Dataset id
   */
  onClose: () => void;
}

type OwnProps = IResourceDescriptionProps;

type MergedProps = ITextAreaEditFormProps;
