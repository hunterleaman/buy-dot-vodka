import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "BUY.VODKA",
  description: "BUY.VODKA Studio and site",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
