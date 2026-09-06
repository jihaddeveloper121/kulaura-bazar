import type { Metadata } from "next";
import "./globals.css";

import AIShoppingAssistant from "@/components/AIShoppingAssistant";
import WelcomePoster from "@/components/WelcomePoster";

export const metadata: Metadata = {
  title: "KULAURA BAZAR",
  description: "KULAURA BAZAR - Online Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}

        <AIShoppingAssistant />

        <WelcomePoster />
      </body>
    </html>
  );
}