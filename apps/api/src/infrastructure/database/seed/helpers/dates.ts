// seed/helpers/dates.ts
export const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const dateHelpers = {
  randomMemberSince: () => randomDate(
    new Date(2019, 0, 1),
    new Date(2024, 11, 31)
  ),

  upcomingEventDate: () => randomDate(
    new Date(),
    new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  ),

  pastEventDate: () => randomDate(
    new Date(2023, 0, 1),
    new Date()
  ),

  withinLastWeek: () => randomDate(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ),

  withinNextMonth: () => randomDate(
    new Date(),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ),

  // Zusätzlich randomDate direkt verfügbar machen
  randomDate: randomDate
} as const;
