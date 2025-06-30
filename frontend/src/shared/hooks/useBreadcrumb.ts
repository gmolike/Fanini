import { useContext } from 'react';

import { BreadcrumbContext } from '../ui/breadcrumb';

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);

  return context;
};
