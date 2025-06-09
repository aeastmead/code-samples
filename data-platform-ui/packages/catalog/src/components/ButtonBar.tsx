import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { OptionValue } from '@nlss/brain-trust';
import isNil from 'lodash/isNil';

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: max-content;
  grid-column-gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};
  background: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY['200']};
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSizes.small};
  font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};

  .nlss-buttonBar__btn {
    all: unset;
    grid-row: 1/2;
    display: flex;
    cursor: pointer;
    padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium}
      ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.medium};
    background: ${({ theme }: { theme: DefaultTheme }) => theme.palette.GREY['200']};
    border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.xsmall};

    &:hover {
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
    }

    &--active {
      background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.background};
    }
  }
`;

function ButtonBar<T>({ options, value, onChange, className, ...rest }: ButtonBar.Props<T>): React.ReactElement | null {
  const selectedValue: T | undefined = React.useMemo(() => {
    if (!isNil(value)) return value;
    return !isNil(options) && options.length > 0 ? options[0].value : undefined;
  }, [options, value]);

  return (
    <>
      {options && (
        <Container {...rest} role="listbox" className={cn('nlss-buttonBar', className)}>
          {options.map((option: OptionValue<T>, index: number) => {
            const selected: boolean = option.value === selectedValue;

            return (
              <button
                key={index.toString()}
                role="option"
                aria-selected={selected}
                aria-label={option.label}
                onClick={() => !selected && onChange && onChange(option.value)}
                className={cn('nlss-buttonBar__btn', { 'nlss-buttonBar__btn--active': selected })}>
                {option.label}
              </button>
            );
          })}
        </Container>
      )}
    </>
  );
}

namespace ButtonBar {
  export interface Props<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    options?: OptionValue<T>[];
    value?: T;
    onChange?: (value: T) => any;
  }
}

export default ButtonBar;
