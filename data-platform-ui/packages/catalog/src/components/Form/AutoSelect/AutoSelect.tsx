import isNil from 'lodash/isNil';
import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import AutoSelectInput from './AutoSelectInput';
import AutoSelectMenu from './AutoSelectMenu';
import { AutoSelectOption } from './types';

export default class AutoSelect<T> extends React.PureComponent<Props<T>, State> {
  static defaultProps: Partial<Props<any>> = {
    loading: false
  };

  static getDerivedStateFromProps(props: Props<any>, prevState: State): State | null {
    if (
      !prevState.activeSearch ||
      !prevState.focused ||
      props.loading === true ||
      prevState.highlightedIndex < props.options.length
    ) {
      return null;
    }

    return {
      ...prevState,
      highlightedIndex: 0
    };
  }

  isMenuOpen: boolean = false;
  items: AutoSelectOption<T>[] = [];
  itemCount = -1;

  constructor(props: Props<T>) {
    super(props);

    this.state = {
      focused: false,
      activeSearch: false,
      query: '',
      highlightedIndex: 0
    };

    this.handleFocus = this.handleFocus.bind(this);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleIncrementHighlightedIndex = this.handleIncrementHighlightedIndex.bind(this);
    this.handleHighlightedIndexChange = this.handleHighlightedIndexChange.bind(this);

    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.clearInstanceProps = this.clearInstanceProps.bind(this);

    this.handleSelectHighlightedItem = this.handleSelectHighlightedItem.bind(this);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  public componentWillUnmount() {
    this.clearInstanceProps();
    this.props.onUnload && this.props.onUnload();
  }

  public render() {
    this.clearInstanceProps();

    const { activeSearch, focused, highlightedIndex, query } = this.state;

    const {
      options: _options,
      loading: _loading,
      onSearch,
      onChange,
      onUnload,
      onMenuClose,
      onBlur,
      selectedItem,
      className,
      validation,
      placeholder,
      showNoResults,
      name,
      ...rest
    } = this.props;

    const isActiveSearch = focused && activeSearch;
    const loading = isActiveSearch && _loading === true;
    const noResults = _options.length <= 0;
    const hasMenuContent = (noResults && showNoResults === true) || !noResults;
    const menuOpen = isActiveSearch && !loading && hasMenuContent;

    const inputValue = isActiveSearch ? query : selectedItem?.text || '';

    let items: AutoSelectOption<T>[] = [];

    if (menuOpen) {
      this.isMenuOpen = true;
      items = _options;
    }

    this.itemCount = items.length;
    this.items = items;

    return (
      <Container
        {...rest}
        className={cn('nlss-auto-select', className, { focused })}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}>
        <AutoSelectInput
          className="autoSelectInput"
          menuOpen={menuOpen}
          loading={loading}
          value={inputValue}
          validation={validation}
          placeholder={placeholder}
          name={name}
          selectHighlightedIndex={this.handleSelectHighlightedItem}
          incrementHighlightedIndex={this.handleIncrementHighlightedIndex}
          onChange={this.handleInputValueChange}
        />
        <AutoSelectMenu
          className={cn('autoSelectMenu', { 'autoSelectMenu--open': menuOpen })}
          options={items}
          menuOpen={menuOpen}
          noResults={noResults}
          highlightedIndex={highlightedIndex}
          onItemClick={this.handleItemClick}
          onHighlightedIndexChange={this.handleHighlightedIndexChange}
        />
      </Container>
    );
  }

  private handleIncrementHighlightedIndex(step: number): void {
    if (!this.isMenuOpen || this.itemCount <= 1) {
      return undefined;
    }

    const maxItemIndex = this.itemCount - 1;

    this.setState(({ highlightedIndex }: Readonly<State>) => {
      let nextHighlightIndex = highlightedIndex + step;

      if (nextHighlightIndex > maxItemIndex) {
        nextHighlightIndex = 0;
      } else if (nextHighlightIndex < 0) {
        nextHighlightIndex = maxItemIndex;
      }

      return {
        highlightedIndex: nextHighlightIndex
      };
    });
  }

  private handleSelectHighlightedItem(): void {
    if (!this.isMenuOpen || this.itemCount <= 0) {
      return undefined;
    }

    const selectedItem: AutoSelectOption<T> = this.items[this.state.highlightedIndex];

    this.handleSelectedItemChange(selectedItem);
  }

  private handleInputValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.persist();

    const query = event.target.value;

    let clearSelectedItem = false;

    this.setState(
      (state: Readonly<State>, props: Readonly<Props<T>>) => {
        clearSelectedItem = !isNil(props.selectedItem);

        return {
          activeSearch: true,
          highlightedIndex: 0,
          query
        };
      },
      () => {
        this.props.onSearch(query);
        clearSelectedItem && this.props.onChange(undefined);
      }
    );
  }

  private handleFocus(): void {
    this.setState({ focused: true });
  }

  private handleBlur(event: React.FocusEvent): void {
    event.preventDefault();
    if (this.isMenuOpen) {
      this.props.onMenuClose && this.props.onMenuClose();
    }
    this.setState(
      { focused: false, highlightedIndex: 0, activeSearch: false, query: '' },
      () => this.props.onBlur && this.props.onBlur()
    );
  }

  private handleHighlightedIndexChange(highlightedIndex: number): void {
    this.setState({ highlightedIndex });
  }

  private handleItemClick(item: AutoSelectOption<T>, event: React.MouseEvent): void {
    event.preventDefault();

    this.handleSelectedItemChange(item);
  }

  private handleSelectedItemChange(selectedItem: AutoSelectOption<T> | undefined): void {
    this.props.onChange(selectedItem);
    this.props.onMenuClose && this.props.onMenuClose();
    this.setState({ activeSearch: false, highlightedIndex: 0, query: '' });
  }

  private clearInstanceProps(): void {
    this.isMenuOpen = false;
    this.itemCount = -1;
    this.items = [];
  }
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  width: 100%;
  position: relative;

  .hidden {
    display: none;
  }

  .autoSelectInput {
    height: 38px;
  }

  .autoSelectMenu {
    z-index: 1000;
    position: absolute;
    left: 0;
    top: 0;
    right: auto;
    bottom: auto;
    transform: translate(0, 38px);
  }

  .nlss-auto-select-menu {
    box-shadow: ${({ theme }) => theme.shadows.default};
  }
`;

type Props<T> = IAutoSelectProps<T>;

type State = {
  focused: boolean;
  activeSearch: boolean;
  query: string;
  highlightedIndex: number;
};

export interface IAutoSelectProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur' | 'onChange' | 'onUnload'> {
  selectedItem?: AutoSelectOption<T>;

  options: AutoSelectOption<T>[];

  validation?: 'error' | 'warning';
  placeholder?: string;
  loading?: boolean;

  /**
   * Display no results message
   */
  showNoResults?: boolean;
  onSearch: (text: string) => void;
  onChange: (option: AutoSelectOption<T> | undefined) => void;
  onBlur?: () => void;
  onMenuClose?: () => void;
  onUnload?: () => void;
  name?: string;
}
