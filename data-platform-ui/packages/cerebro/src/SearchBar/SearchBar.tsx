import SearchBarForm from './SearchBarForm';
import useHistoryAPISearch from './useHistoryAPISearch';
import type React from 'react';
import { SearchBarFormModel, searchBarService } from '@nlss/brain-trust';

interface CommonProps
  extends Omit<SearchBarForm.Props, 'onSubmit' | 'locationValues' | 'entityTypeLabel' | 'entityTypes'> {}

export function HistorySearchBar({ ...rest }: HistorySearchBar.Props): React.ReactElement {
  const [locationValues, onSubmit] = useHistoryAPISearch();

  return (
    <SearchBarForm
      {...rest}
      entityTypeLabel={searchBarService.entityTypeLabel}
      entityTypes={searchBarService.entityTypeOptions}
      locationValues={locationValues}
      onSubmit={onSubmit}
    />
  );
}

export namespace HistorySearchBar {
  export interface Props extends CommonProps {}
}

export function StdSearchBar(props: StdSearchBar.Props): React.ReactElement {
  return (
    <SearchBarForm
      {...props}
      entityTypeLabel={searchBarService.entityTypeLabel}
      entityTypes={searchBarService.entityTypeOptions}
      onSubmit={(formValues?: SearchBarFormModel) => {
        searchBarService.goToResultPage(formValues);
      }}
    />
  );
}

export namespace StdSearchBar {
  export interface Props extends CommonProps {}
}
