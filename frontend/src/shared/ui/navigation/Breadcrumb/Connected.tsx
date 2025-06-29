import * as React from 'react'

import { useBreadcrumb } from '@/shared/hooks'

import { Breadcrumb } from './Breadcrumb'

import type { BreadcrumbProps } from './model/types'

type ConnectedBreadcrumbProps = Omit<BreadcrumbProps, 'items'> & {
  /**
   * Override items (falls nicht aus Context gelesen werden soll)
   */
  items?: BreadcrumbProps['items']
}

/**
 * Connected Breadcrumb
 * @description Breadcrumb Komponente connected mit Provider
 */
export const ConnectedBreadcrumb: React.FC<ConnectedBreadcrumbProps> = ({
  items: overrideItems,
  ...props
}) => {
  const { items: contextItems } = useBreadcrumb()
  const items = overrideItems ?? contextItems

  return <Breadcrumb items={items} {...props} />
}
