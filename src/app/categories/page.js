import { api } from "@/services/api";
import CategoryList from "@/components/CategoryList";

export const revalidate = 0;

export default async function CategoriesPage() {
  const data = await api.getCategories();
  const categories = data?.data || [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-gray-600">Discover products from your favorite categories</p>
      </div>
      
      <CategoryList categories={categories} />
    </div>
  );
}


