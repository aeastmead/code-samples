import React from 'react';
import { Checkbox, Input } from '@bbnpm/bb-ui-framework';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export type ToggledInputValue = string | false;

function isShowTextInput(value: ToggledInputValue): value is string {
  return value !== undefined && typeof value !== 'boolean';
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  padding: 8px 0;
`;

export default class ToggledInput extends React.PureComponent<ToggledInputProps> {
  static displayName = 'Subject';
  textInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: ToggledInputProps) {
    super(props);
    this.textInputRef = React.createRef();
  }

  componentDidUpdate(prevProps: Readonly<ToggledInputProps>) {
    if (this.textInputRef.current !== null && isShowTextInput(this.props.value) && !isShowTextInput(prevProps.value)) {
      this.textInputRef.current.focus();
    }
  }

  render() {
    const {
      value: _value,
      label,
      name,
      onChange,
      onBlur,
      onFocus,
      onToggleChange,
      errorMessage,
      className,
      ...rest
    } = this.props;

    let showTextInput: boolean = false;

    let textInputValue: string = '';

    if (isShowTextInput(_value)) {
      showTextInput = true;
      textInputValue = _value;
    }

    return (
      <Container
        {...rest}
        className={cn(
          'nlss-toggled-input',
          { 'nlss-toggled-input--open': showTextInput, 'nlss-field--error': errorMessage !== undefined },
          className
        )}>
        <Checkbox checked={showTextInput} label={label} onChange={onToggleChange} />
        {showTextInput && (
          <Input
            ref={this.textInputRef}
            type="text"
            name={name}
            value={textInputValue}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        )}
        {errorMessage && <>{errorMessage}</>}
      </Container>
    );
  }
}

export interface ToggledInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onBlur' | 'onFocus'> {
  /**
   * Input is hide when input value is false;
   */
  value: ToggledInputValue;
  label?: string;
  errorMessage?: string | undefined;
  onToggleChange: React.ChangeEventHandler<HTMLInputElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
}
