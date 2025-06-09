import type React from 'react';
import { useMemo, useState } from 'react';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import BBUICollapsible from './BBUICollapsible';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';

/**
 * Collapsible wrapper toggled using header button.
 * Opening can be controlled using isOpen or uncontrolled.
 * @param isOpen
 * @param defaultIsOpen
 * @param onOpen
 * @param onClose
 * @param className
 * @param children
 * @param header
 * @param rest
 * @constructor
 */
function Collapsible({
  isOpen,
  defaultIsOpen = true,
  onOpen = noop,
  onClose = noop,
  className,
  children,
  header,
  ...rest
}: Collapsible.Props): React.ReactElement {
  const controlled: boolean = useMemo(() => !isNil(isOpen), []);

  const [unctrlOpen, setUnctrl] = useState(controlled ? isOpen !== false : defaultIsOpen);

  const isActive: boolean = useMemo(()=>controlled ? isOpen !== false : unctrlOpen, [controlled,unctrlOpen]);

  return (
    <BBUICollapsible
      {...rest}
      header={header}
      isActive={isActive}
      className={cn('nlss-listGroup', { 'nlss-listGroup--open': isActive }, className)}
      onOpen={() => {
        onOpen();

        if (!controlled) {
          setUnctrl(true);
        }
      }}
      onClose={() => {
        onClose();
        if (!controlled) {
          setUnctrl(false);
        }
      }}>
      {children}
    </BBUICollapsible>
  );
}

Collapsible.propTypes = {
  header: PropTypes.node.isRequired,
  showArrow: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

namespace Collapsible {
  export interface Props extends Omit<BBUICollapsible.Props, 'onClick' | 'isActive' | 'onChange'> {
    /**
     * Hide the arrow icon
     */
    showArrow?: boolean;
    /**
     * Set to control open state externally
     */
    isOpen?: boolean;
    defaultIsOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
  }
}

export default Collapsible;
