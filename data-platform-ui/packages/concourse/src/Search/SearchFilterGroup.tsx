import type React from 'react';
import { useMemo } from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { createSelector, ParametricSelector } from 'reselect';
import type { SearchFilterWithCount } from './states';
import { searchFilterCountsSelectors } from './states';
import { DefaultRootState, useSelector } from 'react-redux';
import useSearchLocation from './useSearchLocation';
import { CheckboxList, MultiDropdown } from '@nlss/cerebro';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-template-rows: 40px auto;
  grid-row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};

  .nlss-searchFilterGroup {
    &__header {
      grid-row: 1/2;

      display: block;
      margin: 0;
      font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.demi};
      line-height: 1.25;
      padding: 0 0 ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    }

    &__main {
      grid-row: 2/3;
      display: flex;
      flex-direction: column;
    }
  }
`;

function SearchFilterGroup({ className, entityId, ...rest }: SearchFilterGroup.Props) {
  const getSettings: GetSettingsSelector = useMemo(makeGetSettings, []);

  const settings: Settings | undefined = useSelector((state: DefaultRootState) => getSettings(state, entityId));

  const [searchLocationState, locationDispatch] = useSearchLocation();

  const selectedValues: string[] = useMemo(() => {
    return searchLocationState.filters?.[entityId] ?? [];
  }, [searchLocationState.filters?.[entityId]]);

  function handleValuesChange(nextSelectedValues: string[] | undefined): void {
    locationDispatch({
      type: 'changeFilter',
      payload: { id: entityId, selectedValues: nextSelectedValues },
    });
  }

  if (settings === undefined) {
    return null;
  }
  return (
    <Container {...rest} className={cn('nlss-searchFilterGroup', className)}>
      <h3 className="nlss-searchFilterGroup__header">{settings.label}</h3>
      <div className="nlss-searchFilterGroup__main">
        {settings.asCheckbox ? (
          <CheckboxList
            options={settings.options}
            values={selectedValues}
            onValuesChange={handleValuesChange}
            className="nlss-searchFilterGroup__ctl"
          />
        ) : (
          <MultiDropdown
            options={settings.options}
            values={selectedValues}
            onValuesChange={handleValuesChange}
            className="nlss-searchFilterGroup__ctl"
          />
        )}
      </div>
    </Container>
  );
}

type GetSettingsSelector = ParametricSelector<DefaultRootState, string, Settings | undefined>;

const makeGetSettings: () => GetSettingsSelector = () =>
  createSelector(
    searchFilterCountsSelectors.makeGetWithCountById(),
    (filter: SearchFilterWithCount | undefined): Settings | undefined => {
      if (filter === undefined) {
        return undefined;
      }
      const options: CheckboxList.Option<string>[] = filter.options.map(
        (opt: SearchFilterWithCount.OptionWithCount) => ({
          label: `${opt.label} (${opt.count})`,
          value: opt.value,
        })
      );

      return {
        label: filter.label,
        options,
        asCheckbox: options.length < 7,
      };
    }
  );

interface Settings {
  label: string;
  options: CheckboxList.Option<string>[];
  asCheckbox: boolean;
}

namespace SearchFilterGroup {
  export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    entityId: string;
  }
}

export default SearchFilterGroup;
