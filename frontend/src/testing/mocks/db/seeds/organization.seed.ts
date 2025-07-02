import { db } from '@/testing/mocks/db';

export const seedBoardMembers = () => {
  console.info('[MSW] Seeding board members...');

  const members = [
    db.boardMember.create({
      id: '1',
      name: 'Anna Schmidt',
      role: 'erste_vorsitzende',
      roleLabel: 'Erste Vorsitzende',
      email: 'vorsitz@fanini-spandau.de',
      memberSince: '2022-01-15',
      responsibilities: ['Vereinsführung', 'Repräsentation', 'Strategische Planung'],
      order: 1,
      description: 'Führt den Verein seit der Gründung mit Leidenschaft und Engagement.',
    }),
    db.boardMember.create({
      id: '2',
      name: 'Max Müller',
      role: 'zweite_vorsitzende',
      roleLabel: 'Zweiter Vorsitzender',
      email: 'stellvertreter@fanini-spandau.de',
      memberSince: '2022-01-15',
      responsibilities: ['Stellvertretung', 'Mitgliederbetreuung', 'Veranstaltungskoordination'],
      order: 2,
    }),
    db.boardMember.create({
      id: '3',
      name: 'Sarah Weber',
      role: 'kassenwartin',
      roleLabel: 'Kassenwartin',
      email: 'kasse@fanini-spandau.de',
      memberSince: '2022-03-01',
      responsibilities: ['Finanzverwaltung', 'Budgetplanung', 'Mitgliedsbeiträge'],
      order: 3,
    }),
  ];

  return members;
};

export const seedDocuments = () => {
  console.info('[MSW] Seeding documents...');

  const documents = [
    db.document.create({
      id: '1',
      title: 'Vereinssatzung',
      type: 'satzung',
      fileUrl: '/dokumente/Satzung.pdf',
      fileSize: 245678,
      updatedAt: new Date().toISOString(),
      category: 'Rechtliches',
    }),
    db.document.create({
      id: '2',
      title: 'Werteleitbild',
      type: 'other',
      fileUrl: '/dokumente/Werteleitbild.pdf',
      fileSize: 178234,
      updatedAt: new Date().toISOString(),
      category: 'Organisation',
    }),
    db.document.create({
      id: '3',
      title: 'Organiesationsstruktur',
      type: 'geschaeftsordnung',
      fileUrl: '/dokumente/Organiesationsstruktur.pdf',
      fileSize: 156789,
      updatedAt: new Date().toISOString(),
      category: 'Protokolle',
    }),
  ];

  return documents;
};
