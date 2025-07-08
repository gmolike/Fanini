import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Faninitiative Spandau API",
      version: "1.0.0",
      description: `
# 🏟️ Faninitiative Spandau e.V. API

Dies ist die offizielle API für die Webplattform der Faninitiative Spandau.

## 🔑 Authentifizierung

Die meisten Endpoints benötigen eine Authentifizierung über Bearer Token:

\`\`\`
Authorization: Bearer <dein-token>
\`\`\`

## 📝 Response Format

Alle Responses folgen diesem Format:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}
\`\`\`

## 🚦 Status Codes

- \`200\` - OK
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`500\` - Internal Server Error
      `,
      contact: {
        name: "Faninitiative Spandau Tech Team",
        email: "tech@faninitiative-spandau.de",
      },
      license: {
        name: "Private",
        url: "https://faninitiative-spandau.de",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
      {
        url: "https://api.faninitiative-spandau.de",
        description: "Production Server",
      },
    ],
    tags: [
      {
        name: "Public",
        description: "Öffentlich zugängliche Endpoints",
      },
      {
        name: "Auth",
        description: "Authentifizierung und Autorisierung",
      },
      {
        name: "Events",
        description: "Event-Management",
      },
      {
        name: "Members",
        description: "Mitgliederverwaltung",
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
  apis: ["./app/api/**/*.ts", "./src/presentation/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
