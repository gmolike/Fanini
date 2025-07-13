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
      { name: "📋 Tasks", description: "Aufgabenverwaltung" },
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
        Task: {
          type: "object",
          properties: {
            id: { type: "string" },
            titel: { type: "string" },
            beschreibung: { type: "string" },
            context: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["event", "team", "general"] },
                id: { type: "string", nullable: true },
              },
            },
            verantwortlichId: { type: "string", nullable: true },
            zugewiesenAn: {
              type: "array",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: [
                "offen",
                "in_bearbeitung",
                "review",
                "erledigt",
                "blockiert",
              ],
            },
            prioritaet: {
              type: "string",
              enum: ["niedrig", "mittel", "hoch", "kritisch"],
            },
            frist: { type: "string", format: "date-time", nullable: true },
            materialien: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  menge: { type: "number" },
                  einheit: { type: "string" },
                  beschreibung: { type: "string" },
                  besorgt: { type: "boolean" },
                },
              },
            },
            istStandardaufgabe: { type: "boolean" },
            kategorie: { type: "string", nullable: true },
          },
        },
        CreateTask: {
          type: "object",
          required: ["titel", "context_type"],
          properties: {
            titel: { type: "string", minLength: 3, maxLength: 255 },
            beschreibung: { type: "string" },
            context_type: {
              type: "string",
              enum: ["event", "team", "general"],
            },
            context_id: { type: "string" },
            verantwortlich_id: { type: "string" },
            prioritaet: {
              type: "string",
              enum: ["niedrig", "mittel", "hoch", "kritisch"],
            },
            frist: { type: "string", format: "date-time" },
            materialien: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  menge: { type: "number" },
                  einheit: { type: "string" },
                  beschreibung: { type: "string" },
                },
              },
            },
            abhaengig_von: {
              type: "array",
              items: { type: "string" },
            },
            kategorie: { type: "string" },
          },
        },
        UpdateTask: {
          type: "object",
          properties: {
            titel: { type: "string", minLength: 3, maxLength: 255 },
            beschreibung: { type: "string" },
            verantwortlich_id: { type: "string" },
            prioritaet: {
              type: "string",
              enum: ["niedrig", "mittel", "hoch", "kritisch"],
            },
            frist: { type: "string", format: "date-time" },
            materialien: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  menge: { type: "number" },
                  einheit: { type: "string" },
                  beschreibung: { type: "string" },
                  besorgt: { type: "boolean" },
                },
              },
            },
            abhaengig_von: {
              type: "array",
              items: { type: "string" },
            },
            kategorie: { type: "string" },
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
