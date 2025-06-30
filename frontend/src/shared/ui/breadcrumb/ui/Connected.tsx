import * as React from 'react';

import { BreadcrumbContext } from '../model/context';

import { Breadcrumb } from './Breadcrumb';

import type { BreadcrumbProps } from '../model/types';

type ConnectedBreadcrumbProps = Omit<BreadcrumbProps, 'items'> & {
  items?: BreadcrumbProps['items'];
};

export const ConnectedBreadcrumb: React.FC<ConnectedBreadcrumbProps> = ({
  items: overrideItems,
  ...props
}) => {
  const context = React.useContext(BreadcrumbContext);

  const items = overrideItems ?? context.items;

  return <Breadcrumb items={items} {...props} />;
};
