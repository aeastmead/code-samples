import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export interface FormattedTextProps extends React.HtmlHTMLAttributes<HTMLPreElement> {
  noWrap?: boolean;
}

const FormattedText: StyledComponent<'pre', DefaultTheme, FormattedTextProps> = styled.pre.attrs(
  ({ className, noWrap }: FormattedTextProps) => ({
    className: cn('nlss-formatted-text', { 'nlss-formatted-text--wrap': noWrap !== false }, className)
  })
)`
  font-family: ${({ theme }) => theme.font.fontFamily};

  &.nlss-formatted-text {
    &--wrap {
      display: block;
      overflow-wrap: normal;
      white-space: pre-wrap;
    }
  }
`;

FormattedText.displayName = 'NLSSFormattedText';

export default FormattedText;
