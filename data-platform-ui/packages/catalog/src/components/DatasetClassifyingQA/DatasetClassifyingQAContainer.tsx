import { ClassificationAnsweredCategory, ClassificationQuestionnairePersonalDataType, Dataset } from '../../types';
import DatasetClassifyingQA, { DatasetClassifyingQAProps } from './DatasetClassifyingQA';
import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import {
  classificationAnswersActions,
  classificationAnswersSelectors,
  classificationQuestionnaireActions,
  datasetsActions,
  datasetsSelectors
} from '../../store';
import { Dispatch } from 'redux';

type StateProps = {
  loading: boolean;
  canEdit: boolean;
  categories: ClassificationAnsweredCategory[] | undefined;
  personalDataTypes: ClassificationQuestionnairePersonalDataType[] | undefined;
};

type DispatchProps = {
  onLoad: () => void;
};

export interface DatasetClassifyingQAContainerProps
  extends Omit<DatasetClassifyingQAProps, keyof StateProps | keyof DispatchProps> {
  entityId: number;
}

type OwnProps = DatasetClassifyingQAContainerProps;

function mapStateToPropsFactory(): MapStateToProps<StateProps, OwnProps> {
  const getCategories: classificationAnswersSelectors.GetGroupedUseCases =
    classificationAnswersSelectors.makeGetGroupedUseCases();

  const getPersonalDataTypes: classificationAnswersSelectors.GetPersonalDataTypes =
    classificationAnswersSelectors.makeGetPersonalDataTypes();

  const getLoading: classificationAnswersSelectors.GetLoading = classificationAnswersSelectors.makeGetLoading(true);

  const getDataset: datasetsSelectors.GetDatasetSelector = datasetsSelectors.makeGetDataset();
  return (state: DefaultRootState, ownProps: OwnProps) => {
    let loading: boolean = getLoading(state, ownProps.entityId);
    let canEdit: boolean = false;
    const dataset: Dataset | undefined = getDataset(state, { entityId: ownProps.entityId });

    if (dataset !== undefined) {
      canEdit = dataset.canEdit;
    } else {
      loading = true;
    }

    return {
      loading,
      canEdit,
      categories: getCategories(state, ownProps.entityId),
      personalDataTypes: getPersonalDataTypes(state, ownProps.entityId)
    };
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  return {
    onLoad() {
      /**
       * Ensuring dataset is loaded
       */
      dispatch(datasetsActions.fetchAsync(ownProps.entityId));
      dispatch(classificationQuestionnaireActions.fetchAsync());
      dispatch(classificationAnswersActions.fetchRequestAsync(ownProps.entityId));
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToPropsFactory,
  mapDispatchToProps
)(DatasetClassifyingQA);
