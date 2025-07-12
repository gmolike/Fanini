// apps/api/app/api/test-key/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!base64Key) {
    return NextResponse.json({ error: "No Base64 key found" });
  }

  try {
    // Decode Base64
    const jsonString = Buffer.from(base64Key, "base64").toString("utf-8");
    const parsed = JSON.parse(jsonString);

    // Analysiere den Private Key
    const privateKey = parsed.private_key || "";
    const keyLines = privateKey.split("\n");

    return NextResponse.json({
      success: true,
      analysis: {
        hasBase64Key: true,
        decodedLength: jsonString.length,
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKeyAnalysis: {
          exists: !!parsed.private_key,
          length: privateKey.length,
          startsWithBegin: privateKey.startsWith("-----BEGIN PRIVATE KEY-----"),
          endsWithEnd: privateKey.endsWith("-----END PRIVATE KEY-----\n"),
          lineCount: keyLines.length,
          firstLine: keyLines[0],
          lastLine: keyLines[keyLines.length - 1],
          hasNewlines: privateKey.includes("\n"),
          newlineCount: (privateKey.match(/\n/g) || []).length,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
