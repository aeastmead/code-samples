/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { datasetsSelectors, resourcesActions, resourcesSelectors } from '../../store';
import { DatasetResource } from '../../types';
import DatasetResources, { DatasetResourcesProps } from './DatasetResources';

function mapStateToPropsFactory(): MapStateToProps<StateProps, OwnProps> {
  const getLoading: resourcesSelectors.GetLoading = resourcesSelectors.makeGetDatasetIdLoading();

  const getResources: datasetsSelectors.GetResourcesSelector = datasetsSelectors.makeGetResourcesSelector();

  return (state: DefaultRootState, ownProps: OwnProps): StateProps => ({
    loading: getLoading(state, ownProps),
    items: getResources(state, ownProps)
  });
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  return {
    onLoad: () => {
      dispatch(resourcesActions.fetchByDatasetId(ownProps.id, true));
    }
  };
}

function mergeProps(stateProps: StateProps, dispatchProps: DispatchProps, { id, ...ownProps }: OwnProps): MergedProps {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps
  };
}

export default connect<StateProps, DispatchProps, OwnProps, MergedProps>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(DatasetResources);

export interface IDatasetResourcesContainerProps
  extends Omit<DatasetResourcesProps, keyof DispatchProps | keyof StateProps | 'id'> {
  /**
   * Dataset id
   */
  id: number;
}

type DispatchProps = {
  onLoad: () => void;
};

type StateProps = {
  loading: boolean;

  items: DatasetResource[] | undefined;
};

type OwnProps = IDatasetResourcesContainerProps;

type MergedProps = DatasetResourcesProps;
