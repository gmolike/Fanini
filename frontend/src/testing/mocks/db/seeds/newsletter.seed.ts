// frontend/src/testing/mocks/db/seeds/newsletter.seed.ts
import { db } from '../index';

export const seedNewsletters = () => {
  console.info('[MSW] Seeding newsletters...');

  // Authors erstellen
  const authors = {
    redaktion: db.newsletterAuthor.create({
      id: 'author-redaktion',
      name: 'Fanini-Crew',
      role: 'Redaktion',
    }),
    alkanex: db.newsletterAuthor.create({
      id: 'author-alkanex',
      name: 'Alkanex',
      role: 'Vorstand',
    }),
    franzee: db.newsletterAuthor.create({
      id: 'author-franzee',
      name: 'franZee',
      role: 'Team Mitgliederverwaltung',
    }),
    kaya: db.newsletterAuthor.create({
      id: 'author-kaya',
      name: 'Kaya',
      role: 'Team Technik',
    }),
    rifton: db.newsletterAuthor.create({
      id: 'author-rifton',
      name: 'Rifton',
      role: 'Team Mediengestaltung',
    }),
    lisamon: db.newsletterAuthor.create({
      id: 'author-lisamon',
      name: 'lisamon',
      role: 'Team Events',
    }),
  };

  // Newsletter #1 erstellen
  const newsletter1 = db.newsletter.create({
    id: 'newsletter-1',
    edition: 1,
    title: 'Fanini-Newsletter #1 – Willkommen in der Fanini-Familie!',
    subtitle: 'Der allererste Newsletter der Faninitiative Spandau',
    publishedAt: '2025-07-03T10:00:00Z',
    authorId: authors.redaktion.id,
    status: 'published',
    tags: ['Vereinsgründung', 'Teams', 'Community'],
    headerImage: '/images/Gruendungsschild.png',
    introduction: `Hallo liebe Fanini-Mitglieder!
Wir freuen uns, euch den allerersten Fanini-Newsletter zu präsentieren!
Hier erfahrt ihr regelmäßig, was in unserer Community abgeht – von Events über Highlights bis hin zu Aktionen, bei denen ihr selbst gefragt seid.

Wer wir sind – kurz & knapp:
Die Faninitiative Spandau ist der Herzschlag hinter Eintracht Spandau – eine wachsende Gruppe von Fans, Freund:innen und Mitgestalter:innen.
Wir organisieren Events, erstellen lustige Memes, feiern gemeinsame Streams und leben einfach den Spirit der Spandauer Legenden™!`,
    closingMessage: `Danke, dass ihr Teil davon seid.
Auf viele weitere Aktionen – wir lesen uns bald wieder!

Eure Fanini-Crew`,
    nextEditionHint:
      'Rückmeldung? Ideen? Memes? → schreibt eine Nachricht an den Vorstand oder die Redaktion (@Coronas und @Flipper auf Discord!)',
  });

  // Artikel für Newsletter #1
  const articles = [
    // E-Sports Recap
    db.newsletterArticle.create({
      id: 'article-esports-recap',
      newsletterId: newsletter1.id,
      title: 'E-Sports-Recap',
      content: `Auch wenn aktuell Off-Season ist: sobald es wieder losgeht, bekommt ihr hier die wichtigsten Infos zu Matches, MVPs und Highlights!

Die Ergebnisse der letzten Spieltage sind:

Prime League Spring Split:
25.03. EINS 1:2 BIG
02.04. ROSS 2:0 EINS
08.04. EINS 2:0 KHK
15.04. TOG  2:1 EINS
22.04. EINS 0:2 CGN
25.04. USE  2:0 EINS
29.04. SGE  2:0 EINS
06.05. EINS 2:0 AFW
14.05. EWI  1:2 EINS

PRM-Pokal:
04.04. V9   1:2 EINS
09.05. EINS 0:2 CGN`,
      authorId: authors.redaktion.id,
      category: 'esports',
      order: 1,
      tags: ['Prime League', 'Ergebnisse'],
    }),

    // Baller League Update
    db.newsletterArticle.create({
      id: 'article-baller-league',
      newsletterId: newsletter1.id,
      title: 'BallerLeague Updates',
      content: `Sobald der Ball wieder rollt, liefern wir Spielberichte, Tabellen und spannende Stats.
Die 3. Season der Baller League haben wir leider nur als 7. Platz beenden können. Dafür konnten wir den polnischen Bulldozer Norbert Jasczak, der zur Hälfte der Season unser Team ordentlich verstärkt hat, für Season 4 dauerhaft unter Vertrag nehmen.`,
      authorId: authors.redaktion.id,
      category: 'baller-league',
      order: 2,
      tags: ['Baller League', 'Season 3'],
    }),

    // Fanini-Spotlight: Vorstand
    db.newsletterArticle.create({
      id: 'article-vorstand',
      newsletterId: newsletter1.id,
      title: 'Fanini-Spotlight: Die Vereinsgründung ist durch!',
      content: `Hallo zusammen! Wir, der Vorstand, freuen uns riesig, euch heute die vollständige Geschichte und die aktuellen Neuigkeiten zur Vereinsgründung der Faninitiative Spandau mitzuteilen. Viele von euch waren bei den Versammlungen persönlich dabei, aber hier ist der komplette Überblick für alle:

Unser Weg zum eingetragenen Verein begann mit einem großen Meilenstein: Am 15. Februar 2025 fand unsere Gründungsversammlung statt. Dort haben wir die Weichen für die Zukunft der Fanini gestellt und die Basis für unsere offizielle Anerkennung gelegt. Der nächste wichtige Schritt folgte am 10. März 2025 mit dem Notartermin für die Eintragung ins Vereinsregister.

Natürlich war der Weg nicht ganz ohne Herausforderungen. Am 31. März 2025 erhielten wir die erste Rückmeldung vom Vereinsregister, die einige Anpassungen an unserer Satzung forderte. Aber davon haben wir uns nicht beirren lassen! Wir haben schnell reagiert und am 20. April 2025 eine außerordentliche Mitgliederversammlung einberufen, um die notwendigen Änderungen an der Satzung gemäß den Vorgaben des Vereinsregisters vorzunehmen.

Und nun zur fantastischen Nachricht: Seit dem 6. Juni 2025 ist die Faninitiative Spandau offiziell ins Vereinsregister eingetragen! Dies ist ein riesiger Erfolg für uns alle und ein entscheidender Schritt, um die Fanini auf eine noch stabilere und professionellere Basis zu stellen.

Wir freuen uns darauf, euch bald weitere Updates zu geben und gemeinsam mit euch die Fanini weiterzuentwickeln!`,
      authorId: authors.alkanex.id,
      teamId: 'team-vorstand',
      teamName: 'Vorstand',
      category: 'announcement',
      order: 3,
      tags: ['Vereinsgründung', 'Meilenstein'],
    }),

    // Team Mitgliederverwaltung
    db.newsletterArticle.create({
      id: 'article-mitglieder',
      newsletterId: newsletter1.id,
      title: 'Team Update: Mitgliederverwaltung',
      content: `Die Baller League Season 3, die erstmalig in Berlin Tempelhof stattfand, ist zu Ende gegangen und dazu hatten wir wieder unser Kicktippspiel veranstaltet. Rund 20 aktive Fans aus der Community haben dort um die ersten drei Plätze getippt, um tolle Preise wie ein Eintracht Trikot und Knabe Malz abzustauben. Zur kommenden Season 4 planen wir, es wieder stattfinden zu lassen. Außerdem ist die Fanini seit der Gründungsveranstaltung im Februar auf 70 Mitglieder gewachsen.`,
      authorId: authors.franzee.id,
      teamId: 'team-mitglieder',
      teamName: 'Team Mitgliederverwaltung',
      category: 'team-update',
      order: 4,
      tags: ['Kicktippspiel', 'Mitgliederwachstum'],
    }),

    // Team Technik
    db.newsletterArticle.create({
      id: 'article-technik',
      newsletterId: newsletter1.id,
      title: 'Team Update: Technik stellt sich vor',
      content: `Ich stelle euch heute das Team Technik vor!

Erstmal, was machen wir überhaupt?
Wir sind für die technischen Angelegenheiten zuständig, die die Fanintiative Spandau betreffen.
Das heißt, wir stellen unter anderem Plattformen zur Kommunikation und Organisation zur Verfügung, wie zum Beispiel Discord-Server oder betreuen andere Plattformen, wie den Ticketverkauf für die Baller League.
Ebenso arbeiten wir an Projekten für größere Events, wie das Bingo, welches am Fanini-Stand letztes Jahr auf der Gamescom stattgefunden hat.

Was wir tun, wenn wir nicht an solchen großen Projekten arbeiten?
Wir kümmern uns um alle Belange, die die User*innen haben, sei es nun, dass eine Person einen Kanal auf unserem Discord nicht sehen kann oder beim Ticketverkauf für die Baller League Hilfe benötigt.

In der Zukunft wollen wir unser Themengebiet noch weiter ausbauen und coole Features für Events beisteuern. Zusätzlich freuen wir uns immer über eure Anfragen, wenn ihr Hilfe braucht, also immer her mit den Tickets!

Das wars auch schon wieder von uns, wenn ihr euch denkt, dass sowas für euch wäre, meldet euch doch gerne bei uns und wir überlegen gemeinsam, wie wir eure Stärken bei uns mitintegrieren können!`,
      authorId: authors.kaya.id,
      teamId: 'team-technik',
      teamName: 'Team Technik',
      category: 'team-update',
      order: 5,
      tags: ['Discord', 'Support'],
    }),

    // Team Mediengestaltung
    db.newsletterArticle.create({
      id: 'article-medien',
      newsletterId: newsletter1.id,
      title: 'Team Update: Neue Leitung bei Mediengestaltung',
      content: `Servus aus der Kreativ-Ecke! Wir vom Team Mediengestaltung sind diejenigen, die für die Memes, Grafiken und den ganzen visuellen Kram verantwortlich sind, den ihr von der Fanini seht.

Bei uns gibt es direkt ein paar wichtige News: Zuerst einmal ist Trommelpeter als Teamleiter zurückgetreten – ein riesiges Dankeschön an ihn für seine ganze Arbeit! Ich, Rifton, habe die Leitung nun kommissarisch übernommen und wir haben bereits neue Pläne geschmiedet. Wir haben einen neuen Postingplan entwickelt, um euch in Zukunft regelmäßiger mit coolem Content zu versorgen.

Dafür suchen wir aber auch aktiv nach Verstärkung! Wenn du ein kreatives Auge hast, gerne Designs erstellst, Videos schneidest oder einfach nur Bock hast, die besten Memes für Eintracht Spandau zu basteln, dann bist du bei uns goldrichtig. Melde dich einfach bei uns im Discord – wir freuen uns auf dich!`,
      authorId: authors.rifton.id,
      teamId: 'team-medien',
      teamName: 'Team Mediengestaltung',
      category: 'team-update',
      order: 6,
      tags: ['Kreativ', 'Memes', 'Teamsuche'],
    }),

    // Team Events
    db.newsletterArticle.create({
      id: 'article-events',
      newsletterId: newsletter1.id,
      title: 'Team Update: Events - Wir planen eure Highlights!',
      content: `Hey!
Wir sind Team Events, bestehend aus kreativen Köpfen, die sich um die Planung, Ideenfindung und Umsetzung von Aktionen kümmern.
Z.B. bei der Baller League.
Wir stellen sicher, dass jedes Treffen unvergesslich wird!

Bald schon beginnt eine aufregende Zeit:
Ein Sommerfest, die Gamescom, die neue Baller League Season und League Events!
Die müssen natürlich organisiert und geplant werden und genau das machen wir.

Für Kritik oder Vorschläge, bin ich immer zu haben. Schreibt mir dazu einfach eine DM.

Wir freuen uns euch vor Ort zu treffen :)`,
      authorId: authors.lisamon.id,
      teamId: 'team-events',
      teamName: 'Team Events',
      category: 'team-update',
      order: 7,
      tags: ['Events', 'Gamescom', 'Baller League'],
    }),

    // Fan der Woche Rubrik
    db.newsletterArticle.create({
      id: 'article-fan-week',
      newsletterId: newsletter1.id,
      title: 'Fan der Woche',
      content: `Ihr macht geilen Kram? Wir zeigen ihn! Egal ob Memes, Fan-Art oder besondere Aktionen, wir teilen eure kreativen Ideen!

Diese Rubrik startet ab dem nächsten Newsletter - schickt uns eure Kreationen!`,
      authorId: authors.redaktion.id,
      category: 'community',
      order: 8,
      tags: ['Community', 'Kreativ'],
    }),

    // Community-Aktionen
    db.newsletterArticle.create({
      id: 'article-community',
      newsletterId: newsletter1.id,
      title: 'Community-Aktionen',
      content: `Challenges, Votings & mehr – alles, wo eure Stimme zählt.

In Zukunft werden wir hier regelmäßig Aktionen vorstellen, bei denen ihr mitmachen könnt!`,
      authorId: authors.redaktion.id,
      category: 'community',
      order: 9,
      tags: ['Community', 'Mitmachen'],
    }),

    // Was steht an?
    db.newsletterArticle.create({
      id: 'article-upcoming',
      newsletterId: newsletter1.id,
      title: 'Was steht an?',
      content: `Vom 20.8. bis 24.8. schlägt in Köln wieder das Herz des Gamings: die Gamescom. Dazu wird es zu gegebener Zeit noch weitere Informationen geben, aber ihr könnt euch schonmal den Samstag freihalten, denn man munkelt von einer Aktion, die dort stattfinden wird....

Events, Meetups, Livestreams oder Public Viewings – hier verpasst ihr nichts!

Schon notiert?
20.8.-24.8.: Gamescom in Köln`,
      authorId: authors.redaktion.id,
      category: 'event-recap',
      order: 10,
      tags: ['Gamescom', 'Events'],
    }),
  ];

  return {
    newsletters: [newsletter1],
    authors: Object.values(authors),
    articles,
  };
};
