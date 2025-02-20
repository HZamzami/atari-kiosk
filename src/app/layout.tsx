import type { Metadata } from "next";
import { fonts } from "@/lib/fonts";

import "./globals.css";
import {
  LanguageProvider,
  useLanguage,
} from "@/context/LanguageContext";
import LanguageDirSetter from "@/components/LanguageDirSetter";

// export const metadata: Metadata = {
//   title: "Kiosk App",
//   description: "Self-service kiosk for emergency department",
// };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fonts}>
      <body className="antialiased">
        <LanguageProvider>
          <LanguageDirSetter />
          <main className="flex-grow flex items-center justify-center">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
