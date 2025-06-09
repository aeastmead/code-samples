import { useLocation, useNavigate, NavigateFunction } from 'react-router-dom';
import type H from 'history';
import { useEffect, useState } from 'react';
import { nlssUtils } from '@nlss/brain-trust';

function useQueryString(): [
  queryString: string | undefined,
  setQueryString: (queryString: string | undefined) => void
] {
  const location: H.Location = useLocation();

  const navigate: NavigateFunction = useNavigate();

  const [queryString, setQueryString] = useState(() => getSearch(location));

  useEffect(() => {
    const nextQS: string | undefined = getSearch(location);
    if (queryString !== nextQS) {
      setQueryString(nextQS);
    }
  }, [location.search]);

  return [
    queryString,
    (qs: string | undefined) => {
      navigate({ pathname: location.pathname, search: qs });
    },
  ];
}

function getSearch(location: H.Location): string | undefined {
  return nlssUtils.stripToUndefined(location.search);
}

export default useQueryString;
