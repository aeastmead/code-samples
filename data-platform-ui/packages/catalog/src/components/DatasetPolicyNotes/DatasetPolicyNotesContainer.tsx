import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { datasetsSelectors, datasetPolicyNotesSelectors, datasetPolicyNotesActions } from '../../store';
import { Dataset } from '../../types';
import DatasetPolicyNotes, { IDatasetPolicyNotesProps } from './DatasetPolicyNotes';

type StateProps = {
  datasetPolicyNoteIds: number[] | undefined;
  loading: boolean;
  canAdd: boolean;
};

type DispatchProps = {
  onLoad: () => void | undefined;
  onUnload: () => void | undefined;
};

export interface IDatasetPolicyNotesContainerProps
  extends Omit<IDatasetPolicyNotesProps, keyof StateProps | keyof DispatchProps> {
  /**
   * Dataset Id
   */
  entityId: number;
}

function mapStateToPropsFactory(): MapStateToProps<StateProps, IDatasetPolicyNotesContainerProps> {
  const getDataset: datasetsSelectors.GetDatasetSelector = datasetsSelectors.makeGetDataset();

  const getLoading: datasetPolicyNotesSelectors.GetBatchLoadingSelector =
    datasetPolicyNotesSelectors.makeGetBatchLoading();
  return (state: DefaultRootState, ownProps: IDatasetPolicyNotesContainerProps): StateProps => {
    const loading: boolean = getLoading(state, ownProps);

    const dataset: Dataset | undefined = getDataset(state, ownProps);
    if (loading || dataset === undefined) {
      return {
        loading: true,
        datasetPolicyNoteIds: undefined,
        canAdd: false
      };
    }

    return {
      loading: false,
      datasetPolicyNoteIds: dataset.datasetPolicyNoteIds,
      canAdd: dataset.canEdit
    };
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: IDatasetPolicyNotesContainerProps): DispatchProps {
  return {
    onLoad: () => {
      dispatch(datasetPolicyNotesActions.fetchByDatasetIdAsync(ownProps.entityId));
    },
    onUnload: () => {
      dispatch(datasetPolicyNotesActions.batchResetByDatasetId(ownProps.entityId));
    }
  };
}

function mergeProps(
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  ownProps: IDatasetPolicyNotesContainerProps
): IDatasetPolicyNotesProps {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps
  };
}

export default connect<StateProps, DispatchProps, IDatasetPolicyNotesContainerProps, IDatasetPolicyNotesProps>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(DatasetPolicyNotes);
