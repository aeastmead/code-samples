import React from 'react';
import cn from 'classnames';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';
import { AutoSelectOption } from './types';

export default class AutoSelectMenu<T> extends React.PureComponent<Props<T>> {
  static displayName = 'NLSSAutoSelectMenu';

  highlightedItemRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props<T>) {
    super(props);

    this.highlightedItemRef = React.createRef();
    this.scrollToHighlighted = this.scrollToHighlighted.bind(this);
  }

  public componentDidUpdate(prevProps: Readonly<Props<T>>) {
    const { menuOpen, highlightedIndex } = this.props;

    if (menuOpen && highlightedIndex !== prevProps.highlightedIndex) {
      this.scrollToHighlighted();
    }
  }

  public render(): React.ReactNode | null {
    const {
      className,
      menuOpen,
      highlightedIndex,
      onHighlightedIndexChange,
      onItemClick,
      options,
      noResults,
      ...rest
    } = this.props;

    return (
      <Container {...rest} role="listbox" className={cn('nlss-auto-select-menu', className, { hidden: !menuOpen })}>
        {menuOpen &&
          (!noResults ? (
            options.map((option: AutoSelectOption<T>, index: number) => {
              const highlighted = index === highlightedIndex;

              const props: React.HTMLProps<HTMLDivElement> = {};

              if (!highlighted) {
                props.onMouseEnter = onHighlightedIndexChange.bind(null, index);

                props.ref = this.highlightedItemRef;
              }
              return (
                <div
                  {...props}
                  role="option"
                  key={index.toString()}
                  className={cn('autoSelectMenuItem', { highlighted })}
                  onMouseDown={onItemClick.bind(null, option)}>
                  {option.text}
                </div>
              );
            })
          ) : (
            <div className="menu-empty noResults">No Results</div>
          ))}
      </Container>
    );
  }

  scrollToHighlighted(): void {
    const element: HTMLElement | null = this.highlightedItemRef.current;
    if (element === null) {
      return;
    }
    const container: HTMLElement | null = element.parentElement;

    if (container === null) {
      return;
    }

    const itemOffsetRelativeToContainer =
      element.offsetParent === container ? element.offsetTop : element.offsetTop - container.offsetTop;

    let { scrollTop } = container; // Top of the visible area

    if (itemOffsetRelativeToContainer < scrollTop) {
      // Item is off the top of the visible area
      scrollTop = itemOffsetRelativeToContainer;
    } else if (itemOffsetRelativeToContainer + element.offsetHeight > scrollTop + container.offsetHeight) {
      // Item is off the bottom of the visible area
      scrollTop = itemOffsetRelativeToContainer + element.offsetHeight - container.offsetHeight;
    }

    if (scrollTop !== container.scrollTop) {
      container.scrollTop = scrollTop;
    }
  }
}

const Container: StyledComponent<'div', DefaultTheme> = styled.div`
  background-color: ${({ theme }) => theme.formElements.options.background};
  box-shadow: ${({ theme }) => theme.shadows.default};
  border-top: none;
  max-height: 200px;
  height: auto;
  overflow-y: auto;
  width: 100%;

  .autoSelectMenuItem {
    background-color: ${({ theme }) => theme.formElements.options.background};
    align-items: center;
    color: ${({ theme }) => theme.formElements.options.text};
    cursor: pointer;
    display: flex;
    font-size: ${({ theme }) => theme.font.size.base};
    padding: 4px 8px;
    user-select: none;
  }

  .autoSelectMenuItem.highlighted {
    background-color: ${({ theme }) => theme.formElements.options.highlight};
  }

  .noResults {
    color: ${({ theme }) => theme.formElements.colors.readOnly};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
`;

type Props<T> = IAutoSelectMenuProps<T>;
export interface IAutoSelectMenuProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  options: AutoSelectOption<T>[];
  menuOpen: boolean;
  highlightedIndex: number;
  noResults?: boolean;

  onHighlightedIndexChange: (index: number, event: React.MouseEvent<HTMLDivElement>) => void;

  onItemClick: (option: AutoSelectOption<T>, event: React.MouseEvent<HTMLDivElement>) => void;
}
