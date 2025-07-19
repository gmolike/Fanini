// apps/api/app/api/swagger/route.ts
import { NextResponse } from 'next/server';
import { swaggerSpec } from '../../../src/config/swagger';

export async function GET() {
  try {
    // Type-safe Zugriff
    const spec = {
      openapi: swaggerSpec.openapi,
      info: swaggerSpec.info,
      servers: swaggerSpec.servers || [],
      tags: swaggerSpec.tags || [],
      paths: swaggerSpec.paths || {},
      components: swaggerSpec.components || {},
    };

    console.log('Swagger spec keys:', Object.keys(spec));
    console.log('Swagger paths:', Object.keys(spec.paths));

    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error generating swagger spec:', error);

    // Fallback spec
    return NextResponse.json({
      openapi: '3.0.0',
      info: {
        title: 'Faninitiative Spandau API',
        version: '1.0.0',
        description: 'API Dokumentation konnte nicht vollständig geladen werden',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development Server',
        },
      ],
      paths: {},
    });
  }
}
