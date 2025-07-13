// frontend/src/widgets/shared/componentShowcase/ComponentCategory.tsx
import { cn } from '@/shared/lib';

type ComponentCategoryProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Component Category
 * @description Container für eine Kategorie von Komponenten
 */
export const ComponentCategory = ({
  title,
  description,
  children,
  className,
}: ComponentCategoryProps) => {
  return (
    <section className={cn('space-y-8', className)}>
      <div>
        <h2 className="text-fanini-blue-700 text-2xl font-bold">{title}</h2>
        {description ? <p className="text-muted-foreground mt-2">{description}</p> : null}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">{children}</div>
    </section>
  );
};
