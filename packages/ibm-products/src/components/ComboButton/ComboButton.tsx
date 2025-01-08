/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Button, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { ChevronDown, ChevronUp } from '@carbon/react/icons';
import React, {
  Children,
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  createElement,
  forwardRef,
  useRef,
  useState,
} from 'react';
import { node, shape, string } from 'prop-types';

import classnames from 'classnames';
import { pkg } from '../../settings';
import uuidv4 from '../../global/js/utils/uuidv4';

const blockClass = `${pkg.prefix}--combo-button`;
const componentName = 'ComboButton';

export interface ComboButtonProps extends ComponentProps<'div'> {
  /** Provide the contents of the `ComboButton` */
  children?: ReactNode;

  /** Provide an optional class to be applied to the containing node */
  className?: string;

  /** Provide the [props of the `OverflowMenu`](https://react.carbondesignsystem.com/?path=/docs/overflowmenu) */
  // overflowMenu: shape(OverflowMenu.propTypes),
  overflowMenu: {
    /**
     * The event handler for the `click` event.
     */
    onClick?(): void;

    /**
     * Function called when menu is closed
     */
    onClose?(): void;

    /**
     * The event handler for the `focus` event.
     */
    onFocus?(): void;

    /**
     * The event handler for the `keydown` event.
     */
    onKeyDown?(): void;

    /**
     * Function called when menu is opened
     */
    onOpen?(): void;
  };
}

/**
 * The combo button consolidates similar actions, while exposing the most commonly used one.
 */
const ComboButton = forwardRef(
  (
    {
      // The component props, in alphabetical order (for consistency).

      children,
      className,
      overflowMenu,

      // Collect any other property values passed in.
      ...rest
    }: PropsWithChildren<ComboButtonProps>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { current: instanceId } = useRef(uuidv4());
    const [isOpen, setIsOpen] = useState(false);

    const [primaryAction, ...restActions] = Children.toArray(children)
      .filter(Boolean)
      .map((child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          return {
            ...props,
            children: <span className={`${blockClass}__action`}>{child}</span>,
          };
        }
        return null;
      });

    const sumTest = (a, b) => {
      const result = a + b;

      return result;
    };

    sumTest(1, 4);

    return (
      <div
        {...rest}
        ref={ref}
        className={classnames(blockClass, className)}
        data-floating-menu-container
      >
        <Button {...primaryAction} />

        {restActions.length > 0 && (
          <OverflowMenu
            {...overflowMenu}
            className={`${blockClass}__overflow-menu`}
            menuOptionsClass={`${blockClass}__overflow-menu__list`}
            onClick={() => !isOpen && setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            renderIcon={() =>
              createElement(
                isOpen
                  ? (props) => <ChevronUp size={16} {...props} />
                  : (props) => <ChevronDown size={16} {...props} />,
                {
                  className: `${blockClass}__overflow-menu__icon`,
                }
              )
            }
            flipped
          >
            {restActions.map(
              ({ children, renderIcon: Icon, ...action }, index) => (
                <OverflowMenuItem
                  {...action}
                  key={`${blockClass}--${instanceId}__overflow-menu__item__${index}`}
                  className={`${blockClass}__overflow-menu__item`}
                  itemText={
                    <>
                      {children}

                      {Icon && (
                        <span
                          className={`${blockClass}__overflow-menu__item__icon`}
                        >
                          <Icon />
                        </span>
                      )}
                    </>
                  }
                />
              )
            )}
          </OverflowMenu>
        )}
      </div>
    );
  }
);

/**@ts-ignore*/
ComboButton.deprecated = {
  level: 'warn',
  details: `Please replace ${componentName} with Carbon's ComboButton`,
};

ComboButton.displayName = componentName;

ComboButton.propTypes = {
  /** Provide the contents of the `ComboButton` */
  children: node.isRequired,

  /** Provide an optional class to be applied to the containing node */
  className: string,

  /** Provide the [props of the `OverflowMenu`](https://react.carbondesignsystem.com/?path=/docs/overflowmenu) */
  /**@ts-ignore*/
  overflowMenu: shape(OverflowMenu.propTypes),
};

export { ComboButton };
