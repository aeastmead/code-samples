import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { nlssUtils, SearchBarFormModel, searchBarService, SearchFilter } from '@nlss/brain-trust';
import { Button, Dropdown, Icon, Input, InputGroup } from '@bbnpm/bb-ui-framework';

const accentColor = ({ theme }: { theme: DefaultTheme }) => theme.colors.grey[500];

const Container: StyledComponent<'form', DefaultTheme> = styled.form`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 0;

  .nlss-searchBarForm {
    &__content {
      flex-grow: 1;
      display: grid;
      grid-template-columns: 150px 1fr;
      align-items: center;
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[800]};
    }

    &__dropdown {
      grid-column: 1/2;
      border: none;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      background: ${accentColor};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[400]};
    }

    &__query {
      grid-column: 2/3;
    }
  }

  .nlss-searchBarForm__dropdown {
    .bbui-input-group,
    input {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[100]};
    }

    .bbui-input-group {
      border: none;
      background: inherit;
    }
    ul {
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[600]};
    }

    li:not(:last-child):hover {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[400]};
    }

    li:not(:first-child, :last-child) {
      padding-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
    }

    li:last-child,
    li:last-child:hover {
      cursor: not-allowed;
      font-weight: 600;
      color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grey[50]};
    }
  }

  .nlss-searchBarForm-query {
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

type OptionMeta = {
  disabled: boolean;
};
function SearchBarForm({
  className,
  entityTypes,
  entityTypeLabel,
  locationValues,
  onSubmit,
  ...rest
}: SearchBarForm.Props): React.ReactElement {
  const entityTypeOptions: Dropdown.ValueOption<string, OptionMeta>[] = useMemo(() => {
    const options: Dropdown.ValueOption<string, OptionMeta>[] = [
      { label: entityTypeLabel, value: '', meta: { disabled: false } }
    ];

    for (const item of entityTypes) {
      options.push({ ...item, meta: { disabled: false } });
    }
    options.push({ label: searchBarService.DASHBOARD_LABEL, value: 'X', meta: { disabled: true } });
    return options;
  }, [entityTypeLabel, entityTypes]);

  const [values, setFormValues] = useState<SearchBarFormModel>({
    q: locationValues?.q,
    entityType: locationValues?.entityType
  });

  useEffect(() => {
    if (locationValues?.q !== values.q || locationValues?.entityType !== values.entityType) {
      setFormValues({ q: locationValues?.q, entityType: locationValues?.entityType });
    }
  }, [locationValues?.q, locationValues?.entityType]);

  return (
    <Container
      {...rest}
      className={cn('nlss-searchBarForm', className)}
      onSubmit={(ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        onSubmit && onSubmit(values);
      }}>
      <div className="nlss-searchBarForm__content">
        <Dropdown
          className={cn('nlss-searchBarForm__dropdown', className)}
          value={values.entityType || ''}
          options={entityTypeOptions}
          onItemSelect={(option: Dropdown.ValueOption<string, OptionMeta> | null) => {
            if (option == null || option.meta?.disabled === true) {
              return;
            }
            const entityType: string | undefined =
              option.value !== undefined ? nlssUtils.stripToUndefined(option.value) : undefined;
            if (entityType !== values.entityType) {
              setFormValues({ q: values.q, entityType });
            }
          }}
        />
        <InputGroup className="nlss-searchBarForm__query nlss-searchBarForm-query">
          <Input
            placeholder="Search..."
            name="q"
            value={values.q || ''}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...values, q: ev.target.value });
            }}
            type="text"
            className="nlss-searchBarForm-query__input"
          />
          <InputGroup.Addon className="nlss-searchBarForm-query__addon">
            <Button type="submit" kind="tertiary" className="nlss-searchBarForm-query__btn">
              <Icon name="magnify" />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>
    </Container>
  );
}

namespace SearchBarForm {
  export interface Props
    extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onReset' | 'defaultValue'> {
    locationValues?: SearchBarFormModel | undefined;
    entityTypeLabel: string;
    entityTypes: SearchFilter.Option[];
    onSubmit?: (values: SearchBarFormModel) => void;
  }
}

export default SearchBarForm;
