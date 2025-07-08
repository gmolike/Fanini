"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function ApiDocPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Hole die Swagger-Spezifikation
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Fehler beim Laden der API-Docs:", err));
  }, []);

  if (!spec) {
    return (
      <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <h1>API Dokumentation wird geladen...</h1>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={1}
        tryItOutEnabled={true}
      />
    </div>
  );
}
