export const metadata = {
  title: "Faninitiative Spandau API",
  description: "Clean Architecture Backend API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
