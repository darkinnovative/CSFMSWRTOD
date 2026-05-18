import type { Metadata } from "next";
import "./globals.css";
import BottomNavBar from "../components/BottomNavBar";

export const metadata: Metadata = {
  title: "Dark Innovative - Construction & Fleet Management",
  description: "Real-time construction site and vehicle tracking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNavBar />
      </body>
    </html>
  );
}

