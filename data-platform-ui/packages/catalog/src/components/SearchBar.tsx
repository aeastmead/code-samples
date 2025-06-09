import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { SearchBarFormModel, searchBarService } from '@nlss/brain-trust';
import { Icon, Input, Dropdown, InputGroup, Button, DropdownOption } from '@bbnpm/bb-ui-framework';

const accentColor = ({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[500];

const Container: StyledComponent<'form', DefaultTheme> = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 0;

  .nlss-searchBar {
    &__content {
      flex-grow: 1;
      display: grid;
      grid-template-columns: 150px 1fr;
      align-items: center;
      background: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[800]};
    }

    &__dropdown {
      grid-column: 1/2;
    }

    &__query {
      grid-column: 2/3;
    }
  }

  [role='listbox'] {
    min-width: 17rem; // 265px
  }

  .nlss-searchBar__dropdown {
    input {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[100]};
      border: none;
      background: inherit;
    }
    .inputContainer {
      border: none;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      background: ${accentColor};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[400]};
    }
  }

  .bbui-base-dropdown-options {
    font-size: 0.825rem;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[600]};
    color: #ffffff;
    padding: 6px 0;
  }

  .bbui-base-dropdown-options .menuItem {
    padding: 6px 14px;
    line-height: 20px;

    &:hover {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.palette.BLACK};
      background: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[400]};
    }

    &:not(:first-child, :last-child) {
      padding-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
    }

    &.selected {
      background: inherit;
      color: inherit;
      font-weight: 600;
    }

    &:last-child,
    &:last-child:hover {
      cursor: not-allowed;
      font-weight: 600;
      color: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY[50]};
    }
  }

  .nlss-searchBar-query {
    border: 1px solid ${accentColor};
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;

    background: inherit;
    overflow-y: hidden;

    &__addon,
    &__input,
    &__btn {
      border: none;
      background: inherit;
    }
  }
`;

const DISABLED_VALUE = 'X';
function SearchBar({ className, ...rest }: SearchBar.Props): React.ReactElement {
  const entityTypeOptions: DropdownOption[] = React.useMemo(
    () => [
      { label: searchBarService.entityTypeLabel, value: '' },
      ...searchBarService.entityTypeOptions,
      { label: searchBarService.DASHBOARD_LABEL, value: DISABLED_VALUE }
    ],
    []
  );

  const [values, setFormValues] = React.useState<SearchBarFormModel>({
    q: undefined,
    entityType: undefined
  });

  return (
    <Container
      {...rest}
      className={cn('nlss-searchBar', className)}
      onSubmit={(ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        searchBarService.goToResultPage(values);
      }}>
      <div className="nlss-searchBar__content">
        <Dropdown
          className={cn('nlss-searchBar__dropdown', className)}
          value={values.entityType || ''}
          options={entityTypeOptions}
          onChange={(option: DropdownOption | null) => {
            if (option === null || option.value === DISABLED_VALUE) {
              return;
            }
            setFormValues({ q: values.q, entityType: option.value.toString() });
          }}
        />
        <InputGroup className="nlss-searchBar__query nlss-searchBar-query">
          <Input
            placeholder="Search..."
            name="q"
            value={values.q || ''}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...values, q: ev.target.value });
            }}
            type="text"
            className="nlss-searchBar-query__input"
          />
          <InputGroup.Addon className="nlss-searchBar-query__addon">
            <Button type="submit" kind="tertiary" className="nlss-searchBar-query__btn">
              <Icon name="magnify" />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>
    </Container>
  );
}

namespace SearchBar {
  export interface Props
    extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onReset' | 'defaultValue'> {}
}

export default SearchBar;
