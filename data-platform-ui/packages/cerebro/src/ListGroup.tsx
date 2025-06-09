import type React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import type { DefaultTheme, StyledComponent } from 'styled-components';
import PropTypes from 'prop-types';
import Collapsible from './Collapsible';

const Container: StyledComponent<typeof Collapsible, DefaultTheme> = styled(Collapsible)`
  border-bottom: ${({ theme }) => `1px solid ${theme.tables.colors.border}`};
  &:focus {
    outline: ${({ theme }) => `2px solid ${theme.colors.focus}`};
    outline-offset: -2px;
  }
  .nlss-listGroup {
    &__content {
      margin: 0;
      padding: 0;
      list-style: none;
      margin-block-start: 0;
      padding-block-start: 0;
    }
  }

  .bbui-listitem,
  .bbui-list.compact & .bbui-listitem {
    padding-left: 36px;
  }
  .bbui-listitem:last-child {
    border-bottom: none;
  }
  .bbui-collapsible-header {
    box-sizing: border-box;
    min-height: 40px;
    padding: 8px 12px;
  }
`;

/**
 * Collapsible list group. Opening can be controlled using isOpen or uncontrolled.
 * @example Uncontrolled
 *
 * ```jsx
 * import { ListItem } from '@bbnpm/bb-ui-framework';
 *
 * import { useState } from 'react';
 *
 * <ListGroup label="Group 1" showArrow >
 *   <ListItem label="Item 1" />
 *   <ListItem label="Item 2" />
 * </ListGroup>
 * ```
 * @example Controlled
 *
 * ```jsx
 * import { ListItem } from '@bbnpm/bb-ui-framework';
 *
 * const [isOpen, setIsOpen] = useState(true);
 *
 * <ListGroup label="Group 1"  isOpen={isOpen} onClose={() => setIsOpen(false) } onOpen={() => setIsOpen(true)}>
 *    <ListItem label="Item 1" />
 *    <ListItem label="Item 2" />
 *  </ListGroup>
 * ```
 */
function ListGroup({ label, className, children, ...rest }: ListGroup.Props): React.ReactElement {
  return (
    <Container {...rest} header={label} className={cn('nlss-listGroup', className)}>
      <ul className="nlss-listGroup__content">{children}</ul>
    </Container>
  );
}
ListGroup.propTypes = {
  label: PropTypes.node.isRequired,
  showArrow: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

ListGroup.displayName = 'NLSSListGroup';

namespace ListGroup {
  export interface Props extends Omit<Collapsible.Props, 'header'> {
    label: React.ReactNode;
    /**
     * Set to control open state externally
     */
    isOpen?: boolean;
    defaultIsOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
  }
}

export default ListGroup;
