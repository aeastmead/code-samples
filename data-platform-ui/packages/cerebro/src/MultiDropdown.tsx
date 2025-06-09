import type React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { MultiSelect, Token } from '@bbnpm/bb-ui-framework';
import { useMemo } from 'react';
import isNil from 'lodash/isNil';
import without from 'lodash/without';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: grid;
  grid-template-rows: max-content minmax(80px, auto);
  grid-template-columns: 1fr;
  grid-row-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};

  .nlss-multiDropdown {
    &__field {
      grid-row: 1/2;
      grid-column: 1/2;
    }

    &__selected {
      grid-row: 2/3;
      grid-column: 1/2;
      overflow-x: hidden;
      overflow-wrap: normal;
    }

    &__token {
      margin-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};
      margin-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};
    }
  }
`;

function MultiDropdown<Value extends string | number, Meta>({
  className,
  options,
  values,
  fieldName,
  placeholder,
  onValuesChange,
  ...rest
}: MultiDropdown.Props<Value, Meta>) {
  const selectedOptions: MultiDropdown.Option<Value, Meta>[] | undefined = useMemo(() => {
    if (isNil(values) || values.length <= 0 || isNil(options) || options.length <= 0) {
      return undefined;
    }
    return options.filter((option: MultiDropdown.Option<Value, Meta>) => values.includes(option.value));
  }, [values, options]);

  return (
    <Container {...rest} className={cn('nlss-multiDropdown', className)}>
      <MultiSelect
        className="nlss-multiDropdown__field"
        values={values}
        searchable={true}
        options={options || []}
        placeholder={placeholder}
        name={fieldName}
        onItemsChange={(items: MultiSelect.ValueOption<Value, Meta>[] | null) => {
          const nextValues: Value[] | undefined =
            items === null || items.length <= 0
              ? undefined
              : items.map((item: MultiDropdown.Option<Value, Meta>) => item.value);

          onValuesChange && onValuesChange(nextValues);
        }}
        filter={(text: string, option: MultiDropdown.Option<Value>) =>
          option.label.toLowerCase().includes(text) || option.value.toString().toLowerCase().includes(text)
        }
      />
      <div className="nlss-multiDropdown__selected">
        {selectedOptions &&
          selectedOptions.map((option: MultiDropdown.Option<Value, Meta>) => (
            <Token
              key={option.value}
              className="nlss-multiDropdown__token"
              onClose={() => {
                onValuesChange && onValuesChange(without(values, option.value));
              }}>
              {option.label}
            </Token>
          ))}
      </div>
    </Container>
  );
}

namespace MultiDropdown {
  export interface Props<Value extends string | number, Meta> extends React.HTMLAttributes<HTMLDivElement> {
    options?: Option<Value, Meta>[];
    values?: Value[];

    onValuesChange?: (values: Value[] | undefined) => void;
    placeholder?: string;
    fieldName?: string;
  }

  export type Option<Value extends string | number, Meta = any> = MultiSelect.ValueOption<Value, Meta>;
}

export default MultiDropdown;
