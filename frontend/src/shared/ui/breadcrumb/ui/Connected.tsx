import * as React from 'react'

import { Breadcrumb } from './Breadcrumb'
import { BreadcrumbContext } from '../model/context'

import type { BreadcrumbProps } from '../model/types'

type ConnectedBreadcrumbProps = Omit<BreadcrumbProps, 'items'> & {
  items?: BreadcrumbProps['items']
}

export const ConnectedBreadcrumb: React.FC<ConnectedBreadcrumbProps> = ({
  items: overrideItems,
  ...props
}) => {
  const context = React.useContext(BreadcrumbContext)

  if (!context) {
    throw new Error('ConnectedBreadcrumb must be used within BreadcrumbProvider')
  }

  const items = overrideItems ?? context.items

  return <Breadcrumb items={items} {...props} />
}
