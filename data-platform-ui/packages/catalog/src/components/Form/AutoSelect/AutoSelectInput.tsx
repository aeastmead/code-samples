import { Input, InputGroup } from '@bbnpm/bb-ui-framework';
import React from 'react';
import cn from 'classnames';

export default class AutoSelectInput extends React.PureComponent<Props> {
  static displayName = 'NLSSAutoSelectInput';

  constructor(props: Props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public render(): React.ReactNode | null {
    const {
      menuOpen,
      loading,
      value,
      onChange,
      incrementHighlightedIndex,
      selectHighlightedIndex,
      className,
      placeholder,
      validation,
      name,
      ...rest
    } = this.props;
    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined =
      menuOpen && !loading ? this.handleKeyDown : undefined;

    return (
      <InputGroup {...rest} validation={validation} className={cn('nlss-auto-select-input', className)}>
        <Input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Addon>{loading && <span>...loading</span>}</InputGroup.Addon>
      </InputGroup>
    );
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault();
        this.props.selectHighlightedIndex();
        return undefined;
      }
      case 'ArrowDown': {
        this.props.incrementHighlightedIndex(1);
        return undefined;
      }
      case 'ArrowUp': {
        this.props.incrementHighlightedIndex(-1);
        return undefined;
      }
    }
  }
}

type Props = IAutoSelectInputProps;

export interface IAutoSelectInputProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  menuOpen: boolean;
  loading: boolean;
  value: string;
  validation?: 'error' | 'warning';
  placeholder?: string;
  incrementHighlightedIndex: (step: number) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  selectHighlightedIndex: () => void;
  name?: string;
}
