import { SearchBarFormModel, searchBarService, searchLocationService, SearchLocationState } from '@nlss/brain-trust';
import { useEffect, useMemo, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import type H from 'history';

interface LocationInfo {
  active: boolean;
  searchFormValues: SearchBarFormModel | undefined;
}

export default function useHistoryAPISearch(): [
  locationValues: SearchBarFormModel | undefined,
  onSubmit: (formValues?: SearchBarFormModel) => void
] {
  const location: H.Location = useLocation();

  const navigate: NavigateFunction = useNavigate();

  const [locInfo, setLocInfo] = useState(() => parseLocation(location.pathname, location.search));

  useEffect(() => {
    const nextLocInfo: LocationInfo = parseLocation(location.pathname, location.search);
    if (
      nextLocInfo.active !== locInfo.active ||
      locInfo.searchFormValues !== nextLocInfo.searchFormValues ||
      locInfo.searchFormValues?.q !== nextLocInfo.searchFormValues?.q ||
      locInfo.searchFormValues?.entityType !== nextLocInfo.searchFormValues?.entityType
    ) {
      setLocInfo(nextLocInfo);
    }
  }, [location.pathname, location.search]);

  return useMemo(
    () => [
      locInfo.searchFormValues,
      (formValues?: SearchBarFormModel) => {
        const resultPageUrl: string = searchBarService.createSearchResultPath(formValues);

        navigate(resultPageUrl);
      }
    ],
    [locInfo.searchFormValues]
  );
}

function parseLocation(pathname: string, search: string | undefined): LocationInfo {
  const result: LocationInfo = {
    active: searchLocationService.isSearchResultPath(location.pathname),
    searchFormValues: undefined
  };

  if (result.active) {
    const searchState: SearchLocationState = searchLocationService.parseQS(search);
    result.searchFormValues = {
      q: searchState.q,
      entityType: searchBarService.pluckEntityTypeFilter(searchState)
    };
  }
  return result;
}
