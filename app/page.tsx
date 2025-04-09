import ProductList from "@/components/product-list"
import { SearchFilters } from "@/components/search-filters"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <SearchFilters />
        <ProductList />
      </div>
    </main>
  )
}
