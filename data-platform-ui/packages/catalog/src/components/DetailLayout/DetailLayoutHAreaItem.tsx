import React from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import { HeaderExpansionContext } from './HeaderExpansion';
import { EditPencil } from '../SharedLayout';
import { DetailLayoutFormRenderProps } from './types';

class DetailLayoutHAreaItem extends React.PureComponent<DetailLayoutHAreaItem.Props, State> {
  static displayName = 'NLSSDetailLayoutHAreaItem';

  state: State = {
    showForm: false
  };

  hasForm: boolean;

  constructor(props: DetailLayoutHAreaItem.Props) {
    super(props);
    this._handlePencilClick = this._handlePencilClick.bind(this);
    this.hasForm = props.editable === true && !isNil(props.formRender);
  }

  public render() {
    const { label, className: _className, children, editable, formRender, onPencilClick, ...props } = this.props;
    const showLabel: boolean = !isNil(label);
    const hasLabel: boolean = !isNil(label);
    if (editable !== true) {
      return (
        <Container {...props} className={cn('nlss-harea-item', { 'nlss-harea-item--labeled': showLabel }, _className)}>
          {hasLabel ? (
            <>
              <h3 className="nlss-harea-item__label">{label}</h3>
              <div className="nlss-harea-item__content">{children}</div>
            </>
          ) : (
            children
          )}
        </Container>
      );
    }

    this.hasForm = !isNil(formRender);

    const showForm = this.hasForm && this.state.showForm;
    return (
      <HeaderExpansionContext.Consumer>
        {({ onExpansionChange }: HeaderExpansionContext.Value) => {
          const clickHandler = this._handlePencilClick.bind(this, { showForm: true, onExpansionChange });

          return (
            <Container
              className={cn(
                'nlss-harea-item nlss-harea-item--editable',
                { 'nlss-harea-item--labeled': showLabel, 'nlss-hareaItem--editing': showForm },
                _className
              )}>
              <>
                {hasLabel ? (
                  <h3 className="nlss-harea-item__label">
                    {label}
                    <EditPencil onClick={clickHandler} className="nlss-harea-item__edit-pencil" />
                  </h3>
                ) : (
                  <EditPencil onClick={clickHandler} className="nlss-harea-item__edit-pencil" />
                )}
              </>
              <>
                {showForm && formRender ? (
                  <div className="nlss-harea-item__form">
                    {formRender({
                      onClose: this._handlePencilClick.bind(this, { showForm: false, onExpansionChange })
                    })}
                  </div>
                ) : (
                  <div className="nlss-harea-item__content">{children}</div>
                )}
              </>
            </Container>
          );
        }}
      </HeaderExpansionContext.Consumer>
    );
  }

  _handlePencilClick({ showForm, onExpansionChange }: HeaderExpansionContext.Value & { showForm: boolean }) {
    if (!this.hasForm || showForm === this.state.showForm) {
      this.props.onPencilClick && this.props.onPencilClick();
      return;
    }

    this.setState({ showForm }, () => {
      onExpansionChange(showForm);
      this.props.onPencilClick && this.props.onPencilClick();
    });
  }
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size: ${({ theme }) => theme.font.size.base};

  .nlss-harea-item {
    &__label {
      font-size: ${({ theme }) => theme.fontSizes.medium};
      font-weight: ${({ theme }) => theme.font.weight.demi};
      margin: 0;
      line-height: 1;
      padding-bottom: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};

      .nlss-harea-item__edit-pencil {
        margin-left: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
      }
    }

    &__content {
      font-weight: ${({ theme }) => theme.font.weight.normal};
      font-size: ${({ theme }) => theme.font.size.base};
      padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.small};
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      flex-grow: 1;
    }

    &__form {
      padding-top: ${({ theme }: { theme: DefaultTheme }) => theme.spacingSizes.large};
      flex-grow: 1;
    }
  }
  &.nlss-hareaItem--editing {
    .nlss-harea-item__edit-pencil {
      display: none;
    }
  }
`;
namespace DetailLayoutHAreaItem {
  export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'resource'> {
    label?: string;
    editable?: boolean;
    formRender?: (props: DetailLayoutFormRenderProps) => React.ReactNode;
    onPencilClick?: () => void;
  }
}

type State = {
  showForm: boolean;
};

export default DetailLayoutHAreaItem;
