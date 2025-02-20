import { Inter, JetBrains_Mono } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

const fontIBM = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  fallback: ["system-ui", "arial"],
});
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["system-ui", "arial"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  fallback: ["system-ui", "arial"],
});

export { fontIBM, fontSans, fontMono };
export const fonts = `${fontIBM.variable} ${fontSans.variable} ${fontMono.variable}`;
