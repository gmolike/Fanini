// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

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
      // Hauptkategorien (Slices)
      {
        name: "🔐 Auth",
        description: "Authentifizierung und Autorisierung",
        "x-displayName": "Authentication",
      },
      {
        name: "📅 Events",
        description: "Event-Management",
        "x-displayName": "Events",
      },
      {
        name: "👥 Members",
        description: "Mitgliederverwaltung",
        "x-displayName": "Members",
      },
      {
        name: "📄 Documents",
        description: "Dokumentenverwaltung",
        "x-displayName": "Documents",
      },
      {
        name: "📊 Stats",
        description: "Statistiken und Metriken",
        "x-displayName": "Statistics",
      },
      {
        name: "🎨 Creators",
        description: "Creator-Profile und Werke",
        "x-displayName": "Creators",
      },
      {
        name: "📰 Newsletter",
        description: "Newsletter-Verwaltung",
        "x-displayName": "Newsletter",
      },
    ],
    "x-tagGroups": [
      {
        name: "Public API",
        tags: ["🌐 Public"],
      },
      {
        name: "Core Features",
        tags: ["🔐 Auth", "📅 Events", "👥 Members"],
      },
      {
        name: "Content Management",
        tags: ["📄 Documents", "🎨 Creators", "📰 Newsletter"],
      },
      {
        name: "Analytics",
        tags: ["📊 Stats"],
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
    },
  },
  apis: [
    "./src/presentation/routes/**/*.ts",
    "./src/presentation/controllers/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
