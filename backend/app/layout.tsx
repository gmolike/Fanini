export const metadata = {
  title: "Faninitiative Spandau API",
  description: "Backend API für die Faninitiative Spandau e.V.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
