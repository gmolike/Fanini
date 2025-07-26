// seed/seeders/08-seedCreators.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, dateHelpers } from '../helpers';

const CREATOR_DATA = [
  {
    kuenstlername: 'SpandauUltra',
    profiltext: 'Gestalte Choreografien und Fangesänge seit 2019. Spandau im Herzen!',
    instagram: 'spandau_ultra',
    portfolioLink: 'https://instagram.com/spandau_ultra'
  },
  {
    kuenstlername: 'BannerKing',
    profiltext: 'Spezialist für Blockfahnen und Banner. Jedes Design ein Unikat.',
    instagram: 'banner_king_berlin',
    website: 'https://bannerking.de'
  },
  {
    kuenstlername: 'FanArtSpandau',
    profiltext: 'Digitale Kunstwerke rund um Eintracht Spandau. NFTs coming soon!',
    twitter: 'fanart_spandau',
    instagram: 'fanart_spandau'
  },
  {
    kuenstlername: 'ChoreoCrew',
    profiltext: 'Wir machen Spandau sichtbar! Pyrotechnik & Choreografien.',
    instagram: 'choreo_crew_1904'
  },
  {
    kuenstlername: 'SpandauBeats',
    profiltext: 'Produziere Fangesänge und Stadionhymnen. 🎵',
    website: 'https://soundcloud.com/spandaubeats'
  },
  {
    kuenstlername: 'StickerMeister',
    profiltext: 'Sticker, Aufkleber und Merch-Design. Spandau everywhere!',
    instagram: 'sticker_meister_spandau'
  },
  {
    kuenstlername: 'VideoUltra04',
    profiltext: 'Filme und schneide Fanvideos. YouTube: VideoUltra04',
    instagram: 'video_ultra_04',
    website: 'https://youtube.com/@videoultra04'
  },
  {
    kuenstlername: 'TifoArtist',
    profiltext: 'Große Kunst für große Momente. Tifo-Spezialist seit 2020.',
    instagram: 'tifo_artist_berlin'
  }
];

export const seedCreators = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get random members
    const [members] = await connection.execute(
      'SELECT id FROM mitglieder WHERE ist_aktiv = 1 LIMIT 8'
    );

    const creators = [];
    const werke = [];

    for (let i = 0; i < CREATOR_DATA.length && i < (members as any[]).length; i++) {
      const creatorId = generateId('crt');
      const data = CREATOR_DATA[i];

      creators.push({
        id: creatorId,
        mitglied_id: (members as any[])[i].id,
        kuenstlername: data.kuenstlername,
        profiltext: data.profiltext,
        portfolio_link: data.portfolioLink || null,
        ist_aktiv: true,
        aktiv_seit: dateHelpers.randomMemberSince(),
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        website: data.website || null
      });

      // Create 2-4 works per creator
      const werkCount = Math.floor(Math.random() * 3) + 2;
      for (let w = 0; w < werkCount; w++) {
        werke.push({
          id: generateId('wrk'),
          creator_id: creatorId,
          titel: `${data.kuenstlername} Werk ${w + 1}`,
          beschreibung: 'Ein kreatives Werk für unseren Verein.',
          typ: ['BILD', 'VIDEO'][Math.floor(Math.random() * 2)],
          datei_url: `https://storage.example.com/werke/${creatorId}_${w}.jpg`,
          thumbnail_url: `https://storage.example.com/werke/${creatorId}_${w}_thumb.jpg`,
          erstellt_am: dateHelpers.withinLastWeek(),
          veroeffentlicht_am: new Date(),
          ist_oeffentlich: true,
          reihenfolge: w
        });
      }
    }

    // Insert creators
    for (const creator of creators) {
      await connection.execute(
        `INSERT INTO creators (
          id, mitglied_id, kuenstlername, profiltext, portfolio_link,
          ist_aktiv, aktiv_seit, instagram, twitter, website
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          creator.id, creator.mitglied_id, creator.kuenstlername,
          creator.profiltext, creator.portfolio_link, creator.ist_aktiv,
          creator.aktiv_seit, creator.instagram, creator.twitter, creator.website
        ]
      );
    }

    // Insert werke
    for (const werk of werke) {
      await connection.execute(
        `INSERT INTO werke (
          id, creator_id, titel, beschreibung, typ, datei_url,
          thumbnail_url, erstellt_am, veroeffentlicht_am,
          ist_oeffentlich, reihenfolge
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          werk.id, werk.creator_id, werk.titel, werk.beschreibung,
          werk.typ, werk.datei_url, werk.thumbnail_url, werk.erstellt_am,
          werk.veroeffentlicht_am, werk.ist_oeffentlich, werk.reihenfolge
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${creators.length} Creators and ${werke.length} Werke seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Creators seeding failed:', error);
    throw error;
  }
};

export default seedCreators;
