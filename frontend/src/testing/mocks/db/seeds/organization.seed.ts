import { createDocument } from '@/testing/mocks/db/factories';

// testing/mocks/db/seeds/organization.seed.ts
export const seedDocuments = () => {
  console.info('[MSW] Seeding documents...');

  const documents = [
    createDocument({
      title: 'Vereinssatzung',
      type: 'satzung',
      fileUrl: '/dokumente/Satzung.pdf',
      fileSize: 245678,
      category: 'Rechtliches',
    }),
    createDocument({
      title: 'Werteleitbild',
      type: 'other',
      fileUrl: '/dokumente/Werteleitbild.pdf',
      fileSize: 178234,
      category: 'Organisation',
    }),
    createDocument({
      title: 'Geschäftsordnung Beirat',
      type: 'geschaeftsordnung',
      fileUrl: '/dokumente/Organiesationsstruktur.pdf',
      fileSize: 156789,
      category: 'Organisation',
    }),
  ];

  return documents;
};
