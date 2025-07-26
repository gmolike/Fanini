// seed/seeders/12-seedSocialMediaPosts.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, randomElement, dateHelpers, PREDEFINED_IDS } from '../helpers';

const POST_TEMPLATES = [
  {
    inhalt: '🔥 MATCHDAY! Heute um 15:00 Uhr gegen Union Berlin II! Wir sehen uns im Block! #Spandau1904 #NurDerESV',
    plattform: ['twitter', 'instagram'],
    hashtags: ['Spandau1904', 'NurDerESV', 'Matchday']
  },
  {
    inhalt: '📸 Impressionen vom letzten Heimspiel! Was für eine Stimmung! 💙 Danke an alle die dabei waren!',
    plattform: ['instagram', 'facebook'],
    hashtags: ['EintrachtSpandau', 'Heimspiel', 'Fans']
  },
  {
    inhalt: '🚌 Noch Plätze frei für die Auswärtsfahrt nach Cottbus! Anmeldung über unsere Website.',
    plattform: ['twitter', 'instagram', 'facebook'],
    hashtags: ['Auswärtsfahrt', 'Spandau', 'OnTour']
  },
  {
    inhalt: '🎮 Unser LoL-Team hat es in die Playoffs geschafft! GG WP! #SpandauEsports',
    plattform: ['twitter', 'instagram'],
    hashtags: ['SpandauEsports', 'LeagueOfLegends', 'Playoffs']
  },
  {
    inhalt: '📅 Save the Date: Jahreshauptversammlung am 15.03.! Alle Mitglieder sind herzlich eingeladen.',
    plattform: ['facebook'],
    hashtags: ['JHV', 'Vereinsleben']
  }
];

export const seedSocialMediaPosts = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get some events for context
    const [events] = await connection.execute(
      'SELECT id, titel FROM events WHERE ist_oeffentlich = 1 LIMIT 10'
    );

    const posts = [];

    // Create 20-30 posts
    const postCount = Math.floor(Math.random() * 10) + 20;

    for (let i = 0; i < postCount; i++) {
      const template = randomElement(POST_TEMPLATES);
      const relatedEvent = Math.random() > 0.5 ? randomElement(events as any[]) : null;
      const status = randomElement(['ENTWURF', 'GEPLANT', 'VEROEFFENTLICHT', 'VEROEFFENTLICHT']);

      let inhalt = template.inhalt;
      if (relatedEvent) {
        inhalt += `\n\n👉 ${relatedEvent.titel}`;
      }

      posts.push({
        id: generateId('smp'),
        inhalt,
        plattform: JSON.stringify(template.plattform),
        event_id: relatedEvent?.id || null,
        post_datum: status === 'VEROEFFENTLICHT'
          ? dateHelpers.withinLastWeek()
          : dateHelpers.withinNextMonth(),
        status,
        erstellt_von: PREDEFINED_IDS.teamMedien1,
        erstellt_am: new Date(),
        approved_von: status === 'VEROEFFENTLICHT' ? PREDEFINED_IDS.beirat1 : null,
        approved_am: status === 'VEROEFFENTLICHT' ? new Date() : null,
        hashtags: JSON.stringify(template.hashtags),
        medien_urls: Math.random() > 0.5
          ? JSON.stringify([`https://storage.example.com/social/${generateId('img')}.jpg`])
          : null
      });
    }

    // Insert posts
    for (const post of posts) {
      await connection.execute(
        `INSERT INTO social_media_posts (
          id, inhalt, plattform, event_id, post_datum, status,
          erstellt_von, erstellt_am, approved_von, approved_am,
          hashtags, medien_urls
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.id, post.inhalt, post.plattform, post.event_id,
          post.post_datum, post.status, post.erstellt_von,
          post.erstellt_am, post.approved_von, post.approved_am,
          post.hashtags, post.medien_urls
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${posts.length} Social Media Posts seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Social Media Posts seeding failed:', error);
    throw error;
  }
};

export default seedSocialMediaPosts;
