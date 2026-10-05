import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "AU$",
};

const Dashboard = () => {
  const { fetchProducts } = useProduct();
  const products = useSelector((state: any) => state.product?.sellerProducts ?? []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] antialiased font-['Inter',sans-serif] px-6 py-8 sm:px-12 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8E4DC] pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A6B5D]">
              Seller Studio
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#1E293B]">
              My Products
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Showing all uploaded products in your catalog ({products.length} {products.length === 1 ? "item" : "items"}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/seller/create-product"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#3B574A] active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Product Cards Grid / Empty State */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F2EC] text-[#4A6B5D]">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#1E293B]">No products uploaded yet</h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-md mx-auto">
              Your product catalog is empty. Click below to add and publish your first product.
            </p>
            <div className="mt-6">
              <Link
                to="/seller/create-product"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A6B5D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#3B574A]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add First Product</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any, index: number) => {
              const price = product?.price ?? {};
              const amount = Number(price.amount ?? 0);
              const currency = price.currency ?? "INR";
              const symbol = CURRENCY_SYMBOLS[currency] || (currency === "INR" ? "₹" : "$");
              const firstImage = product?.images?.[0]?.url || product?.images?.[0];

              return (
                <div
                  key={product?._id ?? product?.id ?? index}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_4px_20px_-4px_rgba(74,107,93,0.05)] transition-all hover:shadow-[0_12px_32px_-4px_rgba(74,107,93,0.12)] hover:-translate-y-0.5"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F2EC]">
                    {firstImage ? (
                      <img
                        src={typeof firstImage === "string" ? firstImage : firstImage?.url}
                        alt={product?.title ?? "Product image"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[#94A3B8]">
                        No image uploaded
                      </div>
                    )}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-[#1E293B] shadow-xs">
                      {symbol}{Number.isFinite(amount) ? amount.toLocaleString("en-IN") : 0}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h2 className="text-base font-semibold text-[#1E293B] group-hover:text-[#4A6B5D] transition-colors line-clamp-1">
                        {product?.title || "Untitled Product"}
                      </h2>
                      <p className="mt-1.5 text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {product?.description || "No description provided."}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#F1EFE9] pt-3 text-xs">
                      <span className="text-[#64748B]">Currency</span>
                      <span className="font-semibold text-[#1E293B]">{currency}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
