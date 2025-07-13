// app/api-doc/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lade Scalar nur auf Client-Seite
const ApiReferenceReact = dynamic(
  () =>
    import("@scalar/api-reference-react").then((mod) => ({
      default: mod.ApiReferenceReact,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            API Dokumentation wird geladen...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    ),
  },
);

export default function ApiDocPage() {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/swagger")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Swagger spec loaded:", data);
        setSpec(data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der API-Docs:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Fehler beim Laden der API Dokumentation
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            API Dokumentation wird geladen...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Korrekte API für Scalar
  return (
    <div className="h-screen">
      <ApiReferenceReact
        configuration={{
          content: spec, // Nicht 'spec', sondern 'content'!
          theme: "purple",
          layout: "modern",
          darkMode: false,
          hideModels: false,
          searchHotKey: "k",
        }}
      />
    </div>
  );
}
