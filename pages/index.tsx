import ProductsPage from '../src/screens/products/products.page';
import RouteGuard from "@/src/layout/route-guard.layout";



export default function Home() {
  return (
      <RouteGuard>
        <ProductsPage />
      </RouteGuard>
  );
}