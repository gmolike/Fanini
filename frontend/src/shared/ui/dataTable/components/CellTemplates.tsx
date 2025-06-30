import { BooleanDisplay, DateDisplay, EmailDisplay, TextDisplay } from '../../display';
import { Phone } from '../../display/Phone';

import { TableDeleteButton, TableEditButton } from './CellButtons';





export const ActionsCell = ({
  row,
  onEdit,
  onDelete,
}: {
  row: unknown;
  onEdit?: (rowData: unknown) => void;
  onDelete?: (rowData: unknown) => void;
}) => (
  <div className="flex items-center gap-2">
    {onEdit ? <TableEditButton onClick={() => { onEdit(row); }} /> : null}
    {onDelete ? <TableDeleteButton onClick={() => { onDelete(row); }} /> : null}
  </div>
);



export const BooleanCell = ({ value }: { value: unknown }) => (
  <BooleanDisplay value={value as boolean} />
);



export const DateCell = ({ value }: { value: unknown }) => (
  <DateDisplay date={value as string | Date | number | null | undefined} />
);



export const EmailCell = ({ value }: { value: unknown }) => (
  <EmailDisplay email={value as string | undefined} withIcon />
);



export const PhoneCell = ({ value }: { value: unknown }) => (
  <Phone phone={value as string | null | undefined} />
);

/**
 * Standard Cell Templates
 * Wiederverwendbare Zellen-Vorlagen für häufige Datentypen
 */
// Text Cell - Standard für Text
export const TextCell = ({ value }: { value: unknown }) => (
  <TextDisplay text={value as string | undefined | null} />
);
