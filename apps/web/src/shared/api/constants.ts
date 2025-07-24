// apps/web/src/shared/api/constants.ts

const API_ROOT = '/api';
const PUBLIC_ROOT = `${API_ROOT}/public`;
const INTERNAL_ROOT = `${API_ROOT}/internal`;

// Public API Endpoints
const PUBLIC_EVENTS = `${PUBLIC_ROOT}/events`;
const PUBLIC_STATS = `${PUBLIC_ROOT}/stats`;
const PUBLIC_DOCUMENTS = `${PUBLIC_ROOT}/documents`;
const PUBLIC_ORGANIZATION = `${PUBLIC_ROOT}/organization`;
const PUBLIC_TEAM_HISTORY = `${PUBLIC_ROOT}/team-history`;
const PUBLIC_NEWSLETTER = `${PUBLIC_ROOT}/newsletter`;
const PUBLIC_CREATORS = `${PUBLIC_ROOT}/creators`;
const PUBLIC_FAQ = `${PUBLIC_ROOT}/faq`;

// Internal API Endpoints
const INTERNAL_EVENTS = `${INTERNAL_ROOT}/events`;
const INTERNAL_TASKS = `${INTERNAL_ROOT}/tasks`;
const INTERNAL_TEAMS = `${INTERNAL_ROOT}/teams`;
const MEMBERS = `${API_ROOT}/members`;
const AUTH = `${API_ROOT}/auth`;

export const API_ROUTES = {
  PUBLIC: {
    EVENTS: {
      LIST: PUBLIC_EVENTS,
      DETAIL: (eventId: string) => `${PUBLIC_EVENTS}/${eventId}`,
    },
    STATS: PUBLIC_STATS,
    DOCUMENTS: {
      LIST: PUBLIC_DOCUMENTS,
      DETAIL: (documentId: string) => `${PUBLIC_DOCUMENTS}/${documentId}`,
      BY_CATEGORY: (category: string) => `${PUBLIC_DOCUMENTS}/category/${category}`,
    },
    ORGANIZATION: {
      STRUCTURE: `${PUBLIC_ORGANIZATION}/structure`,
      DOCUMENTS: `${PUBLIC_ORGANIZATION}/documents`,
      GREMIEN: {
        LIST: `${PUBLIC_ORGANIZATION}/gremien`,
        DETAIL: (gremiumId: string) => `${PUBLIC_ORGANIZATION}/gremien/${gremiumId}`,
      },
    },
    TEAM_HISTORY: {
      YEARS: `${PUBLIC_TEAM_HISTORY}/years`,
      BY_YEAR: (year: number) => `${PUBLIC_TEAM_HISTORY}/${year.toString()}`,
    },
    NEWSLETTER: {
      LIST: `${PUBLIC_NEWSLETTER}/list`,
      DETAIL: (newsletterId: string) => `${PUBLIC_NEWSLETTER}/${newsletterId}`,
      SUBSCRIBE: `${PUBLIC_NEWSLETTER}/subscribe`,
      CONFIRM: `${PUBLIC_NEWSLETTER}/confirm`,
      UNSUBSCRIBE: `${PUBLIC_NEWSLETTER}/unsubscribe`,
    },
    CREATORS: {
      LIST: `${PUBLIC_CREATORS}/list`,
      DETAIL: (creatorId: string) => `${PUBLIC_CREATORS}/${creatorId}`,
      GALLERY: `${PUBLIC_CREATORS}/gallery`,
      WORKS: (creatorId: string, page = 1, limit = 12) =>
        `${PUBLIC_CREATORS}/${creatorId}/works?page=${page.toString()}&limit=${limit.toString()}`,
    },
    FAQ: PUBLIC_FAQ,
  },
  INTERNAL: {
    EVENTS: {
      LIST: INTERNAL_EVENTS,
      DETAIL: (id: string) => `${INTERNAL_EVENTS}/${id}`,
      CREATE: INTERNAL_EVENTS,
      UPDATE: (id: string) => `${INTERNAL_EVENTS}/${id}`,
      DELETE: (id: string) => `${INTERNAL_EVENTS}/${id}`,
      STATUS: (id: string) => `${INTERNAL_EVENTS}/${id}/status`,
    },
    TASKS: {
      LIST: INTERNAL_TASKS,
      DETAIL: (id: string) => `${INTERNAL_TASKS}/${id}`,
      CREATE: INTERNAL_TASKS,
      UPDATE: (id: string) => `${INTERNAL_TASKS}/${id}`,
      DELETE: (id: string) => `${INTERNAL_TASKS}/${id}`,
      STATUS: (id: string) => `${INTERNAL_TASKS}/${id}/status`,
      ASSIGN: (id: string) => `${INTERNAL_TASKS}/${id}/assign`,
      UNASSIGN: (id: string, memberId: string) => `${INTERNAL_TASKS}/${id}/assign/${memberId}`,
      COMMENTS: (id: string) => `${INTERNAL_TASKS}/${id}/comments`,
      MY_TASKS: `${INTERNAL_TASKS}/my-tasks`,
      BY_MEMBER: (memberId: string) => `${INTERNAL_TASKS}/member/${memberId}`,
      BY_EVENT: (eventId: string) => `${INTERNAL_EVENTS}/${eventId}/tasks`,
      BY_TEAM: (teamId: string) => `${INTERNAL_TEAMS}/${teamId}/tasks`,
      COMPLETE: (id: string) => `${INTERNAL_TASKS}/${id}/complete`,
      BLOCK: (id: string) => `${INTERNAL_TASKS}/${id}/block`,
      FROM_TEMPLATE: `${INTERNAL_TASKS}/create-from-template`,
      TEMPLATES: `${INTERNAL_TASKS}/templates`,
    },
  },
  MEMBERS: {
    LIST: MEMBERS,
    DETAIL: (id: string) => `${MEMBERS}/${id}`,
    LOCAL: `${MEMBERS}/local`,
    PASSWORD: (id: string) => `${MEMBERS}/${id}/password`,
  },
  AUTH: {
    LOGIN: `${AUTH}/login`,
    LOGOUT: `${AUTH}/logout`,
    REGISTER: `${AUTH}/register`,
    REFRESH: `${AUTH}/refresh`,
  },
} as const;

// Export root constants für andere Verwendungen
export { API_ROOT, INTERNAL_ROOT, PUBLIC_ROOT };
