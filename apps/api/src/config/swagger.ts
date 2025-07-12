// src/config/swagger.ts
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Faninitiative Spandau API",
      version: "1.0.0",
      description: "Clean Architecture Backend API mit Slice-Organisation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    tags: [
      // Public
      {
        name: "🌐 Public Events",
        description: "Öffentliche Event-Informationen",
      },
      {
        name: "🌐 Public Creators",
        description: "Öffentliche Creator-Profile",
      },
      { name: "🌐 Public Documents", description: "Öffentliche Dokumente" },
      { name: "🌐 Public Newsletter", description: "Newsletter-Verwaltung" },
      { name: "🌐 Public Organization", description: "Vereinsstruktur" },
      { name: "🌐 Public Stats", description: "Öffentliche Statistiken" },

      // Protected
      { name: "🔐 Auth", description: "Authentifizierung" },
      { name: "📅 Events", description: "Event-Management (geschützt)" },
      { name: "👥 Members", description: "Mitgliederverwaltung" },
      { name: "📄 Documents", description: "Dokumentenverwaltung (geschützt)" },
    ],
    "x-tagGroups": [
      {
        name: "Public API",
        tags: [
          "🌐 Public Events",
          "🌐 Public Creators",
          "🌐 Public Documents",
          "🌐 Public Newsletter",
          "🌐 Public Organization",
          "🌐 Public Stats",
        ],
      },
      {
        name: "Authentication",
        tags: ["🔐 Auth"],
      },
      {
        name: "Protected API",
        tags: ["📅 Events", "👥 Members", "📄 Documents"],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Event: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
            location: { type: "string" },
            status: {
              type: "string",
              enum: ["draft", "published", "cancelled"],
            },
          },
        },
        Member: {
          type: "object",
          properties: {
            id: { type: "string" },
            vorname: { type: "string" },
            nachname: { type: "string" },
            email: { type: "string" },
            istAktiv: { type: "boolean" },
          },
        },
        Document: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            category: { type: "string" },
            fileUrl: { type: "string" },
            isPublic: { type: "boolean" },
          },
        },
      },
    },
  },
  apis: [
    "./src/presentation/controllers/**/*.ts", // UPDATED!
    "./src/presentation/routes/**/*.ts", // UPDATED!
    "./app/api/documents/upload/route.ts", // Special route
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
