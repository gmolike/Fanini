// app/api-doc/page.tsx
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function ApiDocPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Fehler beim Laden der API-Docs:", err));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            API Dokumentation wird geladen...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI
        spec={spec}
        docExpansion="none" // Fix: direkt als string literal
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        tryItOutEnabled={true}
        displayOperationId={false}
        displayRequestDuration={true}
        deepLinking={true}
        persistAuthorization={true}
        defaultModelsExpandDepth={-1}
        defaultModelExpandDepth={1}
        onComplete={(system) => {
          // Custom styling
          const style = document.createElement("style");
          style.innerHTML = `
            .swagger-ui .topbar { display: none; }
            .swagger-ui .info {
              margin-bottom: 2rem;
              background: linear-gradient(135deg, #34687e 0%, #b94f46 100%);
              color: white;
              padding: 2rem;
              border-radius: 8px;
            }
            .swagger-ui .info .title { color: white; }
            .swagger-ui .info .description p { color: rgba(255,255,255,0.9); }
            .swagger-ui .tag-description { font-size: 0.95rem; }
            .swagger-ui .opblock-tag {
              font-size: 1.1rem;
              font-weight: 600;
              border-bottom: 2px solid #e8f0f4;
              margin-bottom: 1rem;
            }
            .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #61affe; }
            .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #49cc90; }
            .swagger-ui .opblock.opblock-put .opblock-summary { border-color: #fca130; }
            .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: #f93e3e; }
            .swagger-ui select { padding: 5px 10px; }
          `;
          document.head.appendChild(style);
        }}
      />
    </div>
  );
}
