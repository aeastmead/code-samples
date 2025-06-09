import React from 'react';
import styled, { StyledComponent, DefaultTheme } from 'styled-components';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import {
  FormDisplayToggle,
  FormDisplayToggleFormRender,
  FormDisplayToggleRenderProps,
  FormDisplayToggleType
} from '../SharedEditForms';

export default class TableCell extends React.PureComponent<Props> {
  static displayName = 'NLSSTableCell';

  constructor(props: Props) {
    super(props);
  }

  public render(): React.ReactNode | null {
    const {
      editable: _editable,
      formRender: _formRender,
      className: clsName,
      children,
      editButtonClassName,
      ...restProps
    } = this.props;

    let formRender: FormDisplayToggleFormRender | undefined;

    let editable = false;

    if (_editable === true && !isNil(_formRender)) {
      formRender = (props: FormDisplayToggleRenderProps) => (
        <div className="nlss-table-cell__content">{_formRender(props)}</div>
      );
      editable = true;
    }

    return (
      <Container
        {...restProps}
        role="cell"
        className={cn('nlss-table-cell', 'nlss-table__cell', clsName)}
        editableClassName="nlss-table-cell--editable"
        formClassName="nlss-table__cell--form"
        editButtonClassName={editButtonClassName}
        editable={editable}
        formRender={formRender}>
        <div className="nlss-table-cell__content">{children}</div>
      </Container>
    );
  }
}

const Container: StyledComponent<FormDisplayToggleType, DefaultTheme> = styled<FormDisplayToggleType>(
  FormDisplayToggle
)`
  display: flex;

  .nlss-table-cell {
    &__content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .nlss-edit-pencil {
    margin-right: 8px;
    flex: 0 0 18px;
  }
`;

export interface ITableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  editable?: boolean;
  formRender?: FormDisplayToggleFormRender;
  editButtonClassName?: string;
}

export type TableCellComponentType = React.ComponentClass<ITableCellProps>;

type Props = ITableCellProps;
