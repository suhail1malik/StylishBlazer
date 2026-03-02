import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
// Update the path below if the file is located elsewhere
// Update the path below if the file is located elsewhere
import DeleteProductButton from "@/components/admin/DeleteProductButton";

type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  featured: boolean;
  category?: {
    name: string;
  } | null;
};

export default async function AdminProductsPage() {
  const products: Product[] = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Total {products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">No products yet</p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">
                    Featured
                  </th>
                  <th className="text-right px-6 py-3 text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            👕
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? "bg-green-50 text-green-700"
                            : product.stock > 0
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="text-yellow-500 text-lg">⭐</span>
                      ) : (
                        <span className="text-gray-300 text-lg">☆</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          name={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
