import { Lato } from "next/font/google";
import ProductsPage from '../src/screens/products/products.page';
import RouteGuard from "@/src/layout/route-guard.layout";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato"
});

export default function Home() {
  return (
    <main className={lato.className}>
      <RouteGuard>
        <ProductsPage />
      </RouteGuard>
    </main>
  );
}