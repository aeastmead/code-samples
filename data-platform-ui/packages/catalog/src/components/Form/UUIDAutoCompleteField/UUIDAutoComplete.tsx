/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect, DefaultRootState, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { peopleActions, peopleSelectors } from '../../../store';
import { IPerson } from '../../../types';
import { AutoSelect, AutoSelectOption, IAutoSelectProps } from '../AutoSelect';

function mapStateToPropsFactory(): MapStateToProps<StateProps, OwnProps> {
  const getPerson: peopleSelectors.GetPersonSelector = peopleSelectors.makeGetPersonSelector();

  const searchSelectors: peopleSelectors.SearchSelectors = peopleSelectors.makeSearchSelectors();

  return (state: DefaultRootState, ownProps: OwnProps) => {
    const person: IPerson | undefined = getPerson(state, { id: ownProps.value });

    return {
      selectedItem: person !== undefined ? { value: person.id, text: person.name } : undefined,
      loading: searchSelectors.getLoading(state, ownProps),
      options: searchSelectors.getOptions(state, ownProps),
      showNoResults: searchSelectors.getNoResult(state, ownProps)
    };
  };
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
  return {
    onMenuClose: () => {
      dispatch(peopleActions.searchReset(ownProps.name));
    },
    onSearch: (query: string) => {
      if (query.length < 2) {
        dispatch(peopleActions.searchReset(ownProps.name));
      } else {
        dispatch(peopleActions.searchRequest(ownProps.name, query));
      }
    },
    onUnload: () => {
      dispatch(peopleActions.searchReset(ownProps.name));
    }
  };
}

function mergeProps(
  stateProps: StateProps,
  dispatchProps: DispatchProps,
  { value, onChange, ...ownProps }: OwnProps
): MergedProps {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    onChange: (option: AutoSelectOption<number> | undefined) => {
      if (option === undefined) {
        onChange(undefined);
      } else {
        onChange(typeof (option.value as any) === 'string' ? +option.value : option.value);
      }
    }
  };
}

export default connect<StateProps, DispatchProps, OwnProps, MergedProps>(
  mapStateToPropsFactory,
  mapDispatchToProps,
  mergeProps
)(AutoSelect);

type StateProps = {
  loading: boolean;
  options: AutoSelectOption<number>[];
  selectedItem: AutoSelectOption<number> | undefined;
  showNoResults: boolean;
};

type DispatchProps = {
  onMenuClose: () => void;
  onSearch: (query: string) => void;
  onUnload: () => void;
};

export interface IUUIDAutoCompleteProps
  extends Omit<IAutoSelectProps<number>, keyof StateProps | keyof DispatchProps | 'onChange'> {
  name: string;
  value?: number;

  onChange: (value: number | undefined) => void;
}

type MergedProps = IAutoSelectProps<number>;

type OwnProps = IUUIDAutoCompleteProps;
