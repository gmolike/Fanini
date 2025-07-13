import { cn } from '@/shared/lib';

type SocialIconProps = {
  icon: string; // SVG path data from simple-icons
  className?: string;
  size?: number;
}

export const SocialIcon = ({ icon, className, size = 20 }: SocialIconProps) => {
  return (
    <img
      src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${encodeURIComponent(
        icon
      )}'/></svg>`}
      width={size}
      height={size}
      className={cn('fill-current', className)}
      alt='Social icon'
    />
  );
};
