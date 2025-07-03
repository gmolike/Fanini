/* eslint-disable sonarjs/no-duplicate-string */
// frontend/src/testing/mocks/handlers/public/newsletter.handlers.ts
import { http, HttpResponse } from 'msw';

import type {
  Newsletter,
  NewsletterDetailResponse,
  NewsletterListItem,
  NewsletterListResponse,
} from '@/entities/public/newsletter';

// Echter Fanini Newsletter #1
const NEWSLETTER_DATA: Newsletter = {
  id: 'newsletter-2025-01',
  edition: 1,
  title: 'Fanini-Newsletter #1',
  subtitle: 'Willkommen in der Fanini-Familie!',
  publishedAt: '2025-06-15T10:00:00Z',
  author: {
    id: 'author-fanini',
    name: 'Fanini-Crew',
    role: 'Redaktion',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FaniniCrew',
  },
  status: 'published',
  tags: ['Newsletter', 'Community', 'Vereinsgründung', 'Teams'],
  headerImage: '/public/images/Gruendungsschild.png',
  introduction: `Hallo liebe Fanini-Mitglieder!

Wir freuen uns, euch den allerersten Fanini-Newsletter zu präsentieren!
Hier erfahrt ihr regelmäßig, was in unserer Community abgeht – von Events über Highlights bis hin zu Aktionen, bei denen ihr selbst gefragt seid.

Die Faninitiative Spandau ist der Herzschlag hinter Eintracht Spandau – eine wachsende Gruppe von Fans, Freund:innen und Mitgestalter:innen. Wir organisieren Events, erstellen lustige Memes, feiern gemeinsame Streams und leben einfach den Spirit der Spandauer Legenden™!`,
  articles: [
    {
      id: 'article-esports',
      title: 'E-Sports-Recap: Off-Season Update',
      content: `Auch wenn aktuell Off-Season ist: sobald es wieder losgeht, bekommt ihr hier die wichtigsten Infos zu Matches, MVPs und Highlights!

Die Ergebnisse der letzten Prime League Spring Split Spieltage:
- 25.03. EINS 1:2 BIG
- 02.04. ROSS 2:0 EINS
- 08.04. EINS 2:0 KHK
- 15.04. TOG 2:1 EINS
- 22.04. EINS 0:2 CGN
- 25.04. USE 2:0 EINS
- 29.04. SGE 2:0 EINS
- 06.05. EINS 2:0 AFW
- 14.05. EWI 1:2 EINS

PRM-Pokal:
- 04.04. V9 1:2 EINS
- 09.05. EINS 0:2 CGN

Die Saison hatte ihre Höhen und Tiefen, aber wir sind stolz auf unser Team und freuen uns schon auf die nächste Season!`,
      excerpt:
        'Die wichtigsten Ergebnisse der Prime League Spring Split und ein Ausblick auf die kommende Saison.',
      author: {
        id: 'author-esports',
        name: 'E-Sports Redaktion',
        role: 'Team Medien',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ESports',
      },
      teamName: 'Team Medien',
      category: 'esports',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
          caption: 'Unsere E-Sports Helden in Aktion',
          position: 'header',
        },
      ],
      order: 0,
      tags: ['E-Sports', 'Prime League', 'Ergebnisse'],
      readingTime: 3,
    },
    {
      id: 'article-baller',
      title: 'Baller League: Norbert Jasczak verstärkt das Team!',
      content: `Die 3. Season der Baller League haben wir leider nur als 7. Platz beenden können. Aber es gibt auch gute Nachrichten!

Dafür konnten wir den polnischen Bulldozer Norbert Jasczak, der zur Hälfte der Season unser Team ordentlich verstärkt hat, für Season 4 dauerhaft unter Vertrag nehmen.

Norbert bringt nicht nur technische Finesse mit, sondern auch die nötige Physis und Erfahrung, die unserem Team gefehlt hat. In seinen ersten Spielen für uns zeigte er bereits, warum er als einer der besten Spieler seiner Position gilt.

Die Vorbereitung auf Season 4 läuft bereits auf Hochtouren. Mit Norbert an Bord und einem verstärkten Trainerstab sind wir optimistisch, in der kommenden Saison eine bessere Platzierung zu erreichen.

Sobald der Ball wieder rollt, liefern wir euch Spielberichte, Tabellen und spannende Stats!`,
      excerpt:
        'Trotz Platz 7 in Season 3 gibt es Grund zur Freude: Norbert Jasczak bleibt bei Eintracht Spandau!',
      author: {
        id: 'author-baller',
        name: 'Baller League Redaktion',
        role: 'Team Medien',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BallerLeague',
      },
      category: 'baller-league',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1606924842584-ffa79285b531?w=800&h=600&fit=crop',
          caption: 'Die Baller League Arena in Berlin Tempelhof',
          position: 'header',
        },
      ],
      order: 1,
      tags: ['Baller League', 'Transfer', 'Season 4'],
      readingTime: 3,
    },
    {
      id: 'article-vorstand',
      title: 'Meilenstein erreicht: Faninitiative ist eingetragener Verein!',
      content: `Hallo zusammen! Wir, der Vorstand, freuen uns riesig, euch heute die vollständige Geschichte und die aktuellen Neuigkeiten zur Vereinsgründung der Faninitiative Spandau mitzuteilen.

Unser Weg zum eingetragenen Verein begann mit einem großen Meilenstein: Am 15. Februar 2025 fand unsere Gründungsversammlung statt. Dort haben wir die Weichen für die Zukunft der Fanini gestellt und die Basis für unsere offizielle Anerkennung gelegt.

Der nächste wichtige Schritt folgte am 10. März 2025 mit dem Notartermin für die Eintragung ins Vereinsregister.

Natürlich war der Weg nicht ganz ohne Herausforderungen. Am 31. März 2025 erhielten wir die erste Rückmeldung vom Vereinsregister, die einige Anpassungen an unserer Satzung forderte. Aber davon haben wir uns nicht beirren lassen! Wir haben schnell reagiert und am 20. April 2025 eine außerordentliche Mitgliederversammlung einberufen, um die notwendigen Änderungen an der Satzung gemäß den Vorgaben des Vereinsregisters vorzunehmen.

Und nun zur fantastischen Nachricht: Seit dem 6. Juni 2025 ist die Faninitiative Spandau offiziell ins Vereinsregister eingetragen! Dies ist ein riesiger Erfolg für uns alle und ein entscheidender Schritt, um die Fanini auf eine noch stabilere und professionellere Basis zu stellen.`,
      excerpt:
        'Die Faninitiative Spandau ist seit dem 6. Juni 2025 offiziell ein eingetragener Verein!',
      author: {
        id: 'author-alkanex',
        name: 'Alkanex',
        role: 'Vorstand',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alkanex',
      },
      teamName: 'Vorstand',
      category: 'announcement',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
          caption: 'Die Gründungsurkunde ist da!',
          position: 'header',
        },
      ],
      order: 2,
      tags: ['Vereinsgründung', 'Meilenstein', 'Vorstand'],
      readingTime: 4,
    },
    {
      id: 'article-mitglieder',
      title: 'Community wächst: 70 Mitglieder und Kicktipp-Erfolg!',
      content: `Die Baller League Season 3, die erstmalig in Berlin Tempelhof stattfand, ist zu Ende gegangen und dazu hatten wir wieder unser Kicktippspiel veranstaltet.

Rund 20 aktive Fans aus der Community haben dort um die ersten drei Plätze getippt, um tolle Preise wie ein Eintracht Trikot und Knabe Malz abzustauben. Das Tippspiel war ein voller Erfolg und hat die Community noch enger zusammengeschweißt.

Zur kommenden Season 4 planen wir, es wieder stattfinden zu lassen - mit noch besseren Preisen und hoffentlich noch mehr Teilnehmern!

Außerdem ist die Fanini seit der Gründungsveranstaltung im Februar auf 70 Mitglieder gewachsen. Diese Entwicklung zeigt, dass unser Konzept aufgeht und immer mehr Fans den Weg zu uns finden. Jedes neue Mitglied bereichert unsere Community und macht uns stärker!`,
      excerpt: 'Die Fanini wächst auf 70 Mitglieder und das Kicktipp-Spiel war ein voller Erfolg!',
      author: {
        id: 'author-franzee',
        name: 'franZee',
        role: 'Team Mitgliederverwaltung',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=franZee',
      },
      teamName: 'Team Verein',
      category: 'community',
      order: 3,
      tags: ['Mitglieder', 'Kicktipp', 'Wachstum'],
      readingTime: 2,
    },
    {
      id: 'article-technik',
      title: 'Team Technik: Die digitalen Helden im Hintergrund',
      content: `Ich stelle euch heute das Team Technik vor!

Erstmal, was machen wir überhaupt? Wir sind für die technischen Angelegenheiten zuständig, die die Fanintiative Spandau betreffen. Das heißt, wir stellen unter anderem Plattformen zur Kommunikation und Organisation zur Verfügung, wie zum Beispiel Discord-Server oder betreuen andere Plattformen, wie den Ticketverkauf für die Baller League.

Ebenso arbeiten wir an Projekten für größere Events, wie das Bingo, welches am Fanini-Stand letztes Jahr auf der Gamescom stattgefunden hat.

Was wir tun, wenn wir nicht an solchen großen Projekten arbeiten? Wir kümmern uns um alle Belange, die die User*innen haben, sei es nun, dass eine Person einen Kanal auf unserem Discord nicht sehen kann oder beim Ticketverkauf für die Baller League Hilfe benötigt.

In der Zukunft wollen wir unser Themengebiet noch weiter ausbauen und coole Features für Events beisteuern. Zusätzlich freuen wir uns immer über eure Anfragen, wenn ihr Hilfe braucht, also immer her mit den Tickets!

Das wars auch schon wieder von uns, wenn ihr euch denkt, dass sowas für euch wäre, meldet euch doch gerne bei uns und wir überlegen gemeinsam, wie wir eure Stärken bei uns mitintegrieren können!`,
      excerpt:
        'Das Team Technik stellt sich vor und sucht Verstärkung für coole digitale Projekte!',
      author: {
        id: 'author-kaya',
        name: 'Kaya',
        role: 'Team Technik',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kaya',
      },
      teamName: 'Team Technik',
      category: 'team-update',
      order: 4,
      tags: ['Team Technik', 'Discord', 'Digital'],
      readingTime: 3,
    },
    {
      id: 'article-medien',
      title: 'Kreativ-Update: Neue Leitung und frische Ideen!',
      content: `Servus aus der Kreativ-Ecke! Wir vom Team Mediengestaltung sind diejenigen, die für die Memes, Grafiken und den ganzen visuellen Kram verantwortlich sind, den ihr von der Fanini seht.

Bei uns gibt es direkt ein paar wichtige News: Zuerst einmal ist Trommelpeter als Teamleiter zurückgetreten – ein riesiges Dankeschön an ihn für seine ganze Arbeit! Ich, Rifton, habe die Leitung nun kommissarisch übernommen und wir haben bereits neue Pläne geschmiedet.

Wir haben einen neuen Postingplan entwickelt, um euch in Zukunft regelmäßiger mit coolem Content zu versorgen. Expect more Memes, mehr Grafiken und mehr von allem, was das Fanini-Herz begehrt!

Dafür suchen wir aber auch aktiv nach Verstärkung! Wenn du ein kreatives Auge hast, gerne Designs erstellst, Videos schneidest oder einfach nur Bock hast, die besten Memes für Eintracht Spandau zu basteln, dann bist du bei uns goldrichtig. Melde dich einfach bei uns im Discord – wir freuen uns auf dich!`,
      excerpt: 'Team Mediengestaltung unter neuer Leitung und auf der Suche nach kreativen Köpfen!',
      author: {
        id: 'author-rifton',
        name: 'Rifton',
        role: 'Team Mediengestaltung',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rifton',
      },
      teamName: 'Team Medien',
      category: 'team-update',
      order: 5,
      tags: ['Team Medien', 'Kreativ', 'Memes'],
      readingTime: 3,
    },
    {
      id: 'article-events',
      title: 'Team Events: Wo die Party steigt!',
      content: `Hey! Wir sind Team Events, bestehend aus kreativen Köpfen, die sich um die Planung, Ideenfindung und Umsetzung von Aktionen kümmern. Z.B. bei der Baller League. Wir stellen sicher, dass jedes Treffen unvergesslich wird!

Bald schon beginnt eine aufregende Zeit: Ein Sommerfest, die Gamescom, die neue Baller League Season und League Events! Die müssen natürlich organisiert und geplant werden und genau das machen wir.

Besonders freuen wir uns auf die Gamescom vom 20.8. bis 24.8. in Köln! Ihr könnt euch schonmal den Samstag freihalten, denn man munkelt von einer Aktion, die dort stattfinden wird... Mehr Details folgen bald!

Für Kritik oder Vorschläge, bin ich immer zu haben. Schreibt mir dazu einfach eine DM. Wir freuen uns euch vor Ort zu treffen :)`,
      excerpt: 'Team Events plant große Aktionen für Sommer und Gamescom - seid gespannt!',
      author: {
        id: 'author-lisamon',
        name: 'lisamon',
        role: 'Team Events',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisamon',
      },
      teamName: 'Team Event',
      category: 'event-recap',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          caption: 'Events, die verbinden!',
          position: 'header',
        },
      ],
      order: 6,
      tags: ['Events', 'Gamescom', 'Planung'],
      readingTime: 2,
    },
  ],
  closingMessage: `Mit dem Newsletter wollen wir euch vernetzen, informieren und inspirieren – damit die Fanini nicht nur irgendein Name bleibt, sondern ein Gefühl.

Danke, dass ihr Teil davon seid. Auf viele weitere Aktionen – wir lesen uns bald wieder!`,
  nextEditionHint: 'Der nächste Newsletter erscheint nach der Gamescom mit allen Highlights!',
  stats: {
    totalArticles: 7,
    estimatedReadTime: 20,
    teams: ['Team Medien', 'Vorstand', 'Team Verein', 'Team Technik', 'Team Event'],
  },
};

// Newsletter List Item
const NEWSLETTER_LIST_ITEM: NewsletterListItem = {
  id: NEWSLETTER_DATA.id,
  edition: NEWSLETTER_DATA.edition,
  title: NEWSLETTER_DATA.title,
  subtitle: NEWSLETTER_DATA.subtitle,
  publishedAt: NEWSLETTER_DATA.publishedAt,
  tags: NEWSLETTER_DATA.tags,
  headerImage: NEWSLETTER_DATA.headerImage,
  preview:
    'Der allererste Fanini-Newsletter ist da! Erfahrt alles über die Vereinsgründung, Team-Updates und kommende Events.',
  articleCount: NEWSLETTER_DATA.articles.length,
};

export const newsletterHandlers = [
  // Newsletter List
  http.get('/api/public/newsletter/list', () => {
    const response: NewsletterListResponse = {
      data: [NEWSLETTER_LIST_ITEM],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        hasMore: false,
      },
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Detail
  http.get('/api/public/newsletter/:id', () => {
    const response: NewsletterDetailResponse = {
      data: NEWSLETTER_DATA,
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Subscribe
  http.post('/api/public/newsletter/subscribe', () => {
    return HttpResponse.json({
      success: true,
      message: 'Erfolgreich angemeldet',
      confirmationRequired: true,
      subscriberId: `sub_${Date.now()}`,
    });
  }),
];
