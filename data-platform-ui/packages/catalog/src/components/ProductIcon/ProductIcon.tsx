import React from 'react';
import cn from 'classnames';
import DatasetIcon from './DatasetIcon';
import ResourceIcon from './ResourceIcon';

const BASE_CLASS_NAME = 'nlss-product-icon';
export default function ProductIcon({
                                        resource,
                                        className: _className,
                                        primaryColor,
                                        ...props
                                    }: Props): React.ReactElement {

    return resource === true ? (
        <ResourceIcon {...props} primaryColor={primaryColor}
                      className={cn(BASE_CLASS_NAME, 'nlss-product-icon--resource', {
                          'nlss-product-icon--primary': primaryColor === true
                      }, _className)}/>
    ) : (
        <DatasetIcon {...props} primaryColor={primaryColor}
                     className={cn(BASE_CLASS_NAME, 'nlss-product-icon--dataset', {
                         'nlss-product-icon--primary': primaryColor === true
                     }, _className)}/>
    );
}

type Props = IProductIconProps;

export interface IProductIconProps extends Omit<React.HTMLAttributes<HTMLOrSVGElement>, 'resource'> {
    resource?: boolean;
    primaryColor?: boolean;
}
