import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitnessePro — Track. Train. Transform.",
  description: "Your ultimate fitness tracking companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
