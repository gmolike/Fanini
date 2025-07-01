// frontend/src/features/public/event-detail/ui/Description.tsx
type DescriptionProps = {
  description: string;
};

/**
 * Description Component
 * @description Zeigt die Event-Beschreibung
 */
export const Description = ({ description }: DescriptionProps) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Beschreibung</h3>
      <p className="text-muted-foreground text-sm whitespace-pre-wrap">{description}</p>
    </div>
  );
};
