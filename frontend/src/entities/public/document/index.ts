export { useDocumentDetail, useDocumentList } from './api/queries';

// Model exports
export { documentListResponseSchema, documentSchema } from './model/schemas';
export * from './model/types';

// Zusätzlicher Hook für Satzung
export { useDocumentByCategory } from './api/queries';
