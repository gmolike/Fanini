import { memo } from 'react';

import { cn } from '@/shared/lib';

import { useController } from './model/useController';

import type { Props } from './model/types';

/**
 * Header Component - Form header with flexible layout options
 *
 * @param title - Main title text (required)
 * @param description - Description text or ReactNode
 * @param subtitle - Additional subtitle text
 * @param icon - Lucide icon component
 * @param avatar - Custom avatar/image element
 * @param badge - Badge element (e.g., status indicator)
 * @param actions - Action buttons to display on the right
 * @param className - Additional CSS classes
 * @param titleClassName - CSS classes for the title
 * @param descriptionClassName - CSS classes for the description
 * @param variant - Layout variant ('default' | 'centered' | 'minimal')
 *
 * @example
 * ```tsx
 * <FormHeader
 *   title="Create User"
 *   description="Fill in all required fields"
 *   icon={UserPlus}
 *   variant="default"
 * />
 * ```
 */
const Component = ({
  title,
  description,
  subtitle,
  icon: Icon,
  avatar,
  badge,
  actions,
  className,
  titleClassName,
  descriptionClassName,
  variant = 'default',
}: Props) => {
  const {
    hasIcon,
    isCentered,
    getVariantClasses,
    getIconClasses,
    getIconSize,
    getDescriptionMargin,
  } = useController({
    title,
    description,
    subtitle,
    icon: Icon,
    avatar,
    badge,
    actions,
    variant,
  });

  const variantClasses = getVariantClasses();

  return (
    <div className={cn(variantClasses.container, className)}>
      {/* Header with Icon/Avatar and Actions */}
      <div className={cn(variantClasses.flexLayout)}>
        {/* Icon or Avatar */}
        {hasIcon ? (
          <div className={getIconClasses()}>
            {Icon ? <Icon className={getIconSize()} /> : null}
            {avatar ?? null}
          </div>
        ) : null}

        {/* Title and Actions Container */}
        <div className={cn('flex-1', isCentered && 'w-full')}>
          <div className={cn('flex items-start justify-between', isCentered && 'flex-col gap-2')}>
            {/* Title and Badge */}
            <div className={cn('space-y-1', isCentered && 'flex flex-col items-center')}>
              <div className="flex items-center gap-2">
                <h1
                  className={cn(
                    'font-semibold tracking-tight',
                    variantClasses.titleSize,
                    titleClassName
                  )}
                >
                  {title}
                </h1>
                {badge}
              </div>

              {subtitle ? (
                <p
                  className={cn(
                    'text-muted-foreground text-sm font-medium',
                    isCentered && 'text-center'
                  )}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* Actions */}
            <div className={cn('flex items-center gap-2', isCentered && 'w-full justify-center')}>
              {actions}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={getDescriptionMargin()}>
        <div
          className={cn(
            'text-muted-foreground',
            variant === 'minimal' ? 'text-sm' : 'text-base',
            isCentered && 'text-center',
            descriptionClassName
          )}
        >
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
      </div>
    </div>
  );
};

export const Header = memo(Component);
