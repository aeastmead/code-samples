import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import cn from 'classnames';
import isNil from 'lodash/isNil';

export default function TableRow({ to, className: _cls, children, ...props }: ITableRowProps): React.ReactElement {
  const className = cn('nlss-table__row nlss-table-grid', _cls);

  if (!isNil(to)) {
    return (
      <LinkContainer {...props} role="row" to={to} className={className}>
        {children}
      </LinkContainer>
    );
  }

  return (
    <Container {...props} role="row" className={className}>
      {children}
    </Container>
  );
}

const LinkContainer = styled(Link)`
  display: block;
  color: ${({ theme }) => theme.tables.colors.text};
  font-size: ${({ theme }) => theme.font.size.base};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.tables.colors.highlight};
  }
`;

const Container = styled.div`
  display: block;
  color: ${({ theme }) => theme.tables.colors.text};
  font-size: ${({ theme }) => theme.font.size.base};
  text-decoration: none;
`;

export interface ITableRowProps extends React.BaseHTMLAttributes<any> {
  to?: LinkProps['to'] | undefined | null;
}

export type TableRowComponentType = React.ComponentType<ITableRowProps>;
