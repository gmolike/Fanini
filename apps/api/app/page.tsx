export default function HomePage() {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#1a56db" }}>🏟️ Faninitiative Spandau API</h1>

      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        Willkommen zur Backend-API der Faninitiative Spandau e.V.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2>📚 Wichtige Links:</h2>
        <ul style={{ lineHeight: "2" }}>
          <li>
            <a href="/api-doc" style={{ color: "#1a56db", fontSize: "1.1rem" }}>
              📖 API Dokumentation (Swagger UI)
            </a>
          </li>
          <li>
            <a
              href="/api/swagger"
              style={{ color: "#1a56db", fontSize: "1.1rem" }}
            >
              📄 OpenAPI Specification (JSON)
            </a>
          </li>
          <li>
            <a
              href="/api/stats/public"
              style={{ color: "#1a56db", fontSize: "1.1rem" }}
            >
              📊 Public Stats Endpoint
            </a>
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
        }}
      >
        <h3>🚀 Quick Start:</h3>
        <pre
          style={{
            backgroundColor: "#1f2937",
            color: "#f9fafb",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          {`# Test the API
curl http://localhost:3000/api/stats/public

# Response:
{
  "data": {
    "memberCount": 42,
    "eventsPerYear": 24,
    "foundedYear": 2019,
    "passionPercentage": 100
  }
}`}
        </pre>
      </div>
    </div>
  );
}
