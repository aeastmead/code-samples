import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Icon } from '@bbnpm/bb-ui-framework';
import styled from 'styled-components';

const StyledCollapsible = styled.div`
  .bbui-collapsible-header {
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: default;
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: 20px;

    &:hover {
      background-color: ${({ theme }) => theme.tables.colors.highlight};
    }

    > .bbui-collapsible-icon {
      font-size: ${({ theme }) => theme.fontSizes.small};
      margin-right: 12px;

      > .bbui-icon {
        transition: transform ${({ theme }) => theme.animations.durationMS}ms
          ${({ theme }) => theme.animations.timingFunction};
      }
    }
    &:focus {
      outline: 1px solid ${({ theme }) => theme.colors.primary.active};
    }
  }

  .bbui-collapsible-header.active {
    background-color: ${({ theme }) => theme.colors.backgroundShades.medium};

    > .bbui-collapsible-icon > .bbui-icon {
      transform: rotate(90deg);
    }
  }

  .bbui-collapsible-body-wrapper {
    overflow: hidden;
    flex: 0;
    max-height: 0;
    transition-property: max-height, opacity, visibility;
    transition-duration: ${({ theme }) => theme.animations.durationMS}ms;
    transition-timing-function: ${({ theme }) => theme.animations.timingFunction};
    opacity: 0;
    visibility: hidden;
  }
  .bbui-collapsible-body-wrapper.active {
    opacity: 1;
    visibility: visible;
  }
`;

function BBUICollapsible({
  className = '',
  header = '',
  isActive = false,
  showArrow = true,
  onClose = () => {},
  onOpen = () => {},
  onChange = () => {},
  tabSetIndex = 0,
  focusIndex = -1,
  tabIndex = 0,
  setFocusIndex = () => {},
  key,
  id,
  children,
  ...rest
}: BBUICollapsible.Props) {
  const headerClass = cn('bbui-collapsible-header', { active: isActive });
  const bodyWrapperClass = cn('bbui-collapsible-body-wrapper', { active: isActive });
  const ref = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout = -1;
    if (isActive !== undefined) {
      const panelBody = panelBodyRef.current;
      if (!panelBody) return;

      panelBody.style.maxHeight = `${panelBody.scrollHeight}px`;
      if (isActive) {
        // After the animation finishes, it's necessary to set the maxHeight to 'none'
        // instead of leaving a hard-coded pixel value in order to allow a possible
        // change in the body height later, e.g. a nested Collapsible.
        timeout = window.setTimeout(() => {
          panelBody.style.maxHeight = 'none';
          panelBody.style.overflow = 'visible';
        }, 300);
      } else {
        requestAnimationFrame(() => {
          panelBody.scrollTop; // force reflow
          panelBody.style.maxHeight = '0';
          panelBody.style.overflow = 'hidden';
        });
      }
    }
    return () => clearTimeout(timeout);
  }, [isActive, panelBodyRef]);

  useEffect(() => {
    if (tabSetIndex === focusIndex) {
      ref.current?.focus();
    }
  }, [focusIndex, tabSetIndex]);

  const toggle = () => {
    const active = !isActive;
    active ? onOpen() : onClose();
    onChange(active);
  };

  const handleFocus = () => {
    if (focusIndex !== tabSetIndex) {
      setFocusIndex(tabSetIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggle();
    }
  };

  const headerId = id && `${id}-collapsible-header`;
  const contentId = id && `${id}-collapsible-content`;

  return (
    <StyledCollapsible className={cn('bbui-collapsible', className)} id={id} {...rest}>
      <div
        className={headerClass}
        onClick={toggle}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        role="tab"
        tabIndex={tabIndex}
        ref={ref}
        aria-expanded={isActive}
        aria-selected={isActive}
        aria-controls={contentId}
        aria-labelledby={headerId}>
        {showArrow && (
          <span className="bbui-collapsible-icon">
            <Icon name="chevron-right" />
          </span>
        )}
        <div className="bbui-collapsible-header-content" id={headerId}>
          {header}
        </div>
      </div>

      <div ref={panelBodyRef} className={bodyWrapperClass} id={contentId}>
        <div className="bbui-collapsible-body">{children}</div>
      </div>
    </StyledCollapsible>
  );
}

namespace BBUICollapsible {
  export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     * Panel header content
     */
    header: React.ReactNode;

    /**
     * Hide the arrow icon
     */
    showArrow?: boolean;

    /**
     * Callback triggered when panel has been opened
     */
    onOpen?: () => void;

    /**
     * Callback triggered when the panel has been closed
     */
    onClose?: () => void;

    /** @ignore */
    onChange?: (active: boolean) => void;

    /** @ignore */
    isActive?: boolean;

    /**
     * Current focus index
     * @ignore
     */
    focusIndex?: number;

    /**
     * Set focus index
     * @ignore
     */
    setFocusIndex?: (index: number) => void;

    /**
     * (Internal) tab unique identifier
     * @ignore
     */
    tabSetIndex?: number;

    /** @ignore */
    key?: string;
  }
}
export default BBUICollapsible;
