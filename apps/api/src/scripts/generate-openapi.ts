// apps/api/src/scripts/generate-openapi.ts
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { OpenAPIV3 } from 'openapi-types';
import { swaggerSpec } from '../config/swagger';
import { domainSchemas } from '../config/swagger-schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generiert OpenAPI Schema für Frontend Type Generation
 * @description Exportiert das vollständige API Schema
 */
const generateOpenAPISchema = () => {
  try {
    // Erweitere das Swagger Spec mit allen Domain Schemas
    const extendedSpec: OpenAPIV3.Document = {
      ...swaggerSpec,
      components: {
        ...swaggerSpec.components,
        schemas: {
          ...swaggerSpec.components?.schemas,
          ...domainSchemas,
        },
      },
    };

    // Output Pfad
    const outputPath = resolve(__dirname, '../../../../packages/shared/src/generated/openapi.json');

    // Erstelle Verzeichnis falls nicht vorhanden
    mkdirSync(dirname(outputPath), { recursive: true });

    // Schreibe Schema
    writeFileSync(outputPath, JSON.stringify(extendedSpec, null, 2));

    console.log('✅ OpenAPI Schema generated at:', outputPath);
    console.log('📊 Total schemas:', Object.keys(extendedSpec.components?.schemas || {}).length);
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI schema:', error);
    process.exit(1);
  }
};

// Führe direkt aus
generateOpenAPISchema();
