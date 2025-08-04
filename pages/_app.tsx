import { AuthProvider } from "@/src/context/auth.context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lato, Outfit } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${outfit.className} ${lato.variable}`}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}