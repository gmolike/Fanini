// seed/seeders/08-seedCreators.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, dateHelpers } from '../helpers/index.js';

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

const seedCreators = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

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
        member_id: (members as any[])[i].id,
        artist_name: data.kuenstlername,
        real_name: data.kuenstlername,
        description: data.profiltext,
        portfolio: data.portfolioLink || 'https://example.com',
        is_active: true,
        active_since: dateHelpers.randomMemberSince(),
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        website: data.website || null
      });

      const werkCount = Math.floor(Math.random() * 3) + 2;
      for (let w = 0; w < werkCount; w++) {
        werke.push({
          id: generateId('wrk'),
          creator_id: creatorId,
          title: `${data.kuenstlername} Werk ${w + 1}`,
          description: 'Ein kreatives Werk für unseren Verein.',
          type: ['image', 'video'][Math.floor(Math.random() * 2)],
          file_url: `https://storage.example.com/werke/${creatorId}_${w}.jpg`,
          thumbnail_url: `https://storage.example.com/werke/${creatorId}_${w}_thumb.jpg`,
          created_at: dateHelpers.withinLastWeek(),
          published_at: new Date(),
          is_public: true,
          order_position: w
        });
      }
    }

    for (const creator of creators) {
      await connection.execute(
        `INSERT INTO creators (
          id, member_id, artist_name, real_name, description, portfolio,
          is_active, active_since, instagram, twitter, website
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          creator.id, creator.member_id, creator.artist_name, creator.real_name,
          creator.description, creator.portfolio, creator.is_active,
          creator.active_since, creator.instagram, creator.twitter, creator.website
        ]
      );
    }

    for (const werk of werke) {
      await connection.execute(
        `INSERT INTO creator_works (
          id, creator_id, title, description, type, file_url,
          thumbnail_url, created_at, published_at, is_public, order_position
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          werk.id, werk.creator_id, werk.title, werk.description,
          werk.type, werk.file_url, werk.thumbnail_url, werk.created_at,
          werk.published_at, werk.is_public, werk.order_position
        ]
      );
    }

    await connection.commit();
    console.log(`✅ ${creators.length} Creators and ${werke.length} Works seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Creators seeding failed:', error);
    throw error;
  }
};

export default seedCreators;
