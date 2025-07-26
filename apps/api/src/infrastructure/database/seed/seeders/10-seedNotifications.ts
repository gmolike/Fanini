// seed/seeders/10-seedNotifications.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, randomElement, dateHelpers } from '../helpers';

const NOTIFICATION_TEMPLATES = [
  {
    typ: 'EVENT_ANMELDUNG',
    titel: 'Neue Event-Anmeldung',
    nachricht: 'Du wurdest erfolgreich für das Event angemeldet.'
  },
  {
    typ: 'AUFGABE_ZUGEWIESEN',
    titel: 'Neue Aufgabe zugewiesen',
    nachricht: 'Dir wurde eine neue Aufgabe zugewiesen.'
  },
  {
    typ: 'EVENT_REMINDER',
    titel: 'Event-Erinnerung',
    nachricht: 'Nicht vergessen: Morgen findet das Event statt!'
  },
  {
    typ: 'KOMMENTAR_ERWAEHNUNG',
    titel: 'Du wurdest erwähnt',
    nachricht: 'Du wurdest in einem Kommentar erwähnt.'
  },
  {
    typ: 'EVENT_ABGESAGT',
    titel: 'Event abgesagt',
    nachricht: 'Leider musste das Event abgesagt werden.'
  }
];

export const seedNotifications = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get members
    const [members] = await connection.execute('SELECT id FROM mitglieder WHERE ist_aktiv = 1');
    const memberIds = (members as any[]).map(m => m.id);

    const notifications = [];

    // Create 50-100 notifications
    const notificationCount = Math.floor(Math.random() * 50) + 50;

    for (let i = 0; i < notificationCount; i++) {
      const template = randomElement(NOTIFICATION_TEMPLATES);
      const isRead = Math.random() > 0.3; // 70% gelesen
      const sentDate = dateHelpers.randomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      );

      notifications.push({
        id: generateId('ntf'),
        empfaenger_id: randomElement(memberIds),
        typ: template.typ,
        titel: template.titel,
        nachricht: template.nachricht,
        gelesen: isRead,
        gelesen_am: isRead ? dateHelpers.randomDate(sentDate, new Date()) : null,
        versendet_am: sentDate,
        prioritaet: randomElement(['NIEDRIG', 'MITTEL', 'HOCH'])
      });
    }

    // Insert notifications
    for (const notification of notifications) {
      await connection.execute(
        `INSERT INTO benachrichtigungen (
          id, empfaenger_id, typ, titel, nachricht, gelesen,
          gelesen_am, versendet_am, prioritaet
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notification.id, notification.empfaenger_id, notification.typ,
          notification.titel, notification.nachricht, notification.gelesen,
          notification.gelesen_am, notification.versendet_am, notification.prioritaet
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${notifications.length} Notifications seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Notifications seeding failed:', error);
    throw error;
  }
};

export default seedNotifications;
