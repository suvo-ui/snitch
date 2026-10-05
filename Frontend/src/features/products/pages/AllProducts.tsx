import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../../app/app.store";
import type { Product } from "../services/product.api";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router-dom";

type SortOrder = "newest" | "price-low" | "price-high" | "title";

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "AU$",
};

function getImageUrl(product: Product): string | undefined {
  const image = product.images?.[0];
  return typeof image === "string" ? image : image?.url;
}

function formatPrice(product: Product): string {
  const currency = product.price?.currency ?? "INR";
  const amount = Number(product.price?.amount ?? 0);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${currencySymbols[currency] ?? "$"}${amount.toLocaleString("en-IN")}`;
  }
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void | Promise<void>;
}) {
  const imageUrl = getImageUrl(product);

  return (
    <article
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_4px_20px_-4px_rgba(74,107,93,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_-8px_rgba(74,107,93,0.16)]"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-[#F5F2EC]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.title || "Product"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#A8A398]">
            <svg
              className="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2 1.5-1.5a2 2 0 012.8 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm5-10h.01"
              />
            </svg>
            <span className="text-xs font-medium">Image coming soon</span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#1E293B] shadow-sm backdrop-blur">
          {formatPrice(product)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-1 text-base font-semibold text-[#1E293B] transition-colors group-hover:text-[#4A6B5D]">
          {product.title || "Untitled product"}
        </h2>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-[#64748B]">
          {product.description || "Discover this piece from our collection."}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[#F1EFE9] pt-3 text-xs">
          <span className="uppercase tracking-wider text-[#94A3B8]">
            Available now
          </span>
          <span className="font-medium text-[#4A6B5D]">
            {product.price?.currency ?? "INR"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function AllProducts() {
  const navigate = useNavigate();
  const products = useSelector(
    (state: RootState) => state.product.products,
  ) as Product[];
  const { fetchAllProducts } = useProduct();
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    void fetchAllProducts()
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchAllProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) =>
      `${product.title ?? ""} ${product.description ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery),
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "title")
        return (a.title ?? "").localeCompare(b.title ?? "");
      if (sortOrder === "price-low" || sortOrder === "price-high") {
        const difference =
          Number(a.price?.amount ?? 0) - Number(b.price?.amount ?? 0);
        return sortOrder === "price-low" ? difference : -difference;
      }
      return (
        new Date(String(b.createdAt ?? 0)).getTime() -
        new Date(String(a.createdAt ?? 0)).getTime()
      );
    });
  }, [products, query, sortOrder]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-8 font-['Inter',sans-serif] text-[#1E293B] sm:px-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-[#E8E4DC] pb-7 sm:mb-10 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4A6B5D]">
              The collection
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              All Products
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#64748B]">
              Thoughtfully made pieces, ready to find their place in your
              wardrobe.
            </p>
          </div>
          <p className="mt-5 text-sm text-[#64748B] sm:mt-0">
            {loading
              ? "Loading collection…"
              : `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`}
          </p>
        </header>

        <section aria-label="Product collection">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">Search products</span>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="1.7" />
                <path d="m16 16 4 4" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the collection"
                className="w-full rounded-xl border border-[#E8E4DC] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A8A398] focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/10"
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-[#64748B]">
              <span>Sort by</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                className="rounded-xl border border-[#E8E4DC] bg-white px-3 py-3 text-sm text-[#1E293B] outline-none focus:border-[#4A6B5D]"
              >
                <option value="newest">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="title">Name</option>
              </select>
            </label>
          </div>

          {error ? (
            <div className="rounded-3xl border border-[#E8E4DC] bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-lg font-semibold">
                We couldn’t load the collection
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
                Please check your connection and try again.
              </p>
              <button
                onClick={() =>
                  void fetchAllProducts().catch(() => setError(true))
                }
                className="mt-6 rounded-xl bg-[#4A6B5D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3B574A]"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Loading products"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white"
                >
                  <div className="aspect-4/5 animate-pulse bg-[#F0EDE7]" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#F0EDE7]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#F5F2EC]" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D8D3C9] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F2EC] text-[#4A6B5D]">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold">
                {products.length === 0
                  ? "The collection is on its way"
                  : "No matching products"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
                {products.length === 0
                  ? "There aren’t any products to show just yet. Please come back soon."
                  : "Try another search to find what you’re looking for."}
              </p>
              {products.length > 0 && (
                <button
                  onClick={() => setQuery("")}
                  className="mt-5 text-sm font-semibold text-[#4A6B5D] underline underline-offset-4"
                >
                  Clear search
                </button>
              )}
              {products.length === 0 && (
                <Link
                  to="/seller/create-product"
                  className="mt-5 inline-flex rounded-xl bg-[#4A6B5D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B574A]"
                >
                  Add a product
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  onClick={() =>
                    navigate(`/products/${product._id ?? product.id}`)
                  }
                  key={product._id ?? product.id ?? index}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
