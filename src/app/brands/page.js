import { api } from "@/services/api";
import BrandList from "@/components/BrandList";

export const revalidate = 0;

export default async function BrandsPage() {
  const data = await api.getBrands();
  const brands = data?.data || [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Brands</h1>
        <p className="text-gray-600">Shop from trusted brands you love</p>
      </div>
      
      <BrandList brands={brands} />
    </div>
  );
}


