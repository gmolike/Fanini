import type { BaseFieldProps } from '../../input/model/types';
import type { IconProps } from '../../types';
import type { ReactNode } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

/**
 * Props for the DialogButton controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  disabled?: boolean;
  placeholder?: string;
  children: ReactNode | ((value: unknown) => ReactNode);
};

/**
 * Return value of the DialogButton controller hook
 */
export type ControllerResult = {
  isDisabled: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleClick: () => void;
  getDisplayContent: (value: unknown) => ReactNode;
  hasValue: (value: unknown) => boolean;
};

/**
 * Props for the DialogButton component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> &
  IconProps & {
    /**
     * Children to render in the button
     */
    children: ReactNode | ((value: unknown) => ReactNode);

    /**
     * Additional content below button
     */
    additionalContent?: ReactNode | ((value: unknown) => ReactNode);

    /**
     * Button variant
     * @default 'outline'
     */
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

    /**
     * Button size
     * @default 'default'
     */
    size?: 'default' | 'sm' | 'lg' | 'icon';

    /**
     * Icon at start
     */
    startIcon?: IconProps['icon'];

    /**
     * Icon at end
     */
    endIcon?: IconProps['icon'];

    /**
     * Dialog render function
     */
    dialog: (props: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      value: unknown;
      onChange: (value: any) => void;
      name: string;
    }) => ReactNode;

    /**
     * Button class name
     */
    buttonClassName?: string;

    /**
     * Full width
     * @default true
     */
    fullWidth?: boolean;
  };
