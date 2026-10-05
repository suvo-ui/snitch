import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/app.store";
import type { Product } from "../services/product.api";
import { useProduct } from "../hooks/useProduct";

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
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

function imageUrl(image: Product["images"] extends (infer T)[] | undefined ? T : never): string {
  return typeof image === "string" ? image : image?.url ?? "";
}

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { fetchProductById } = useProduct();
  const product = useSelector((state: RootState) => state.product.product) as Product | null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (!productId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    setSelectedImage(0);
    void fetchProductById(productId)
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId, fetchProductById]);

  const images = (product?.images ?? []).map((image) => ({
    url: imageUrl(image),
    alt: typeof image === "string" ? product?.title ?? "Product image" : image.alt ?? product?.title ?? "Product image",
  })).filter((image) => image.url);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-[#1E293B] sm:px-10 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-4 w-32 animate-pulse rounded bg-[#E8E4DC]" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#F0EDE7]" />
            <div className="space-y-5 py-4"><div className="h-4 w-28 animate-pulse rounded bg-[#E8E4DC]" /><div className="h-9 w-3/4 animate-pulse rounded bg-[#F0EDE7]" /><div className="h-6 w-32 animate-pulse rounded bg-[#E8E4DC]" /><div className="h-24 animate-pulse rounded bg-[#F0EDE7]" /></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 text-center text-[#1E293B]">
        <div className="max-w-md rounded-3xl border border-[#E8E4DC] bg-white p-10 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4A6B5D]">Product details</p>
          <h1 className="mt-3 text-2xl font-semibold">We couldn’t find this piece</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">It may have been removed, or there may be a connection issue.</p>
          <button onClick={() => navigate(-1)} className="mt-6 rounded-xl bg-[#4A6B5D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3B574A]">Go back</button>
          <div><Link to="/" className="mt-4 inline-block text-sm font-medium text-[#4A6B5D] underline underline-offset-4">Browse all products</Link></div>
        </div>
      </main>
    );
  }

  const activeImage = images[selectedImage];

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-7 font-['Inter',sans-serif] text-[#1E293B] sm:px-10 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#4A6B5D]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to collection
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <section aria-label="Product images" className="min-w-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#E8E4DC] bg-[#F5F2EC] shadow-[0_12px_40px_-12px_rgba(74,107,93,0.1)]">
              {activeImage ? (
                <img src={activeImage.url} alt={activeImage.alt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-[#A8A398]">
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2 1.5-1.5a2 2 0 012.8 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm5-10h.01" /></svg>
                  <span className="text-sm">No product images available</span>
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4A6B5D] shadow-sm backdrop-blur">Snitch collection</span>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button key={`${image.url}-${index}`} type="button" onClick={() => setSelectedImage(index)} aria-label={`View product image ${index + 1}`} aria-pressed={selectedImage === index} className={`aspect-square overflow-hidden rounded-xl border-2 bg-[#F5F2EC] transition ${selectedImage === index ? "border-[#4A6B5D]" : "border-transparent hover:border-[#C8D5CE]"}`}>
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col lg:py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4A6B5D]">The collection</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{product.title || "Untitled product"}</h1>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[#1E293B]">{formatPrice(product)}</p>
            <div className="my-7 h-px bg-[#E8E4DC]" />

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#475569]">About this piece</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#64748B]">{product.description || "A considered addition to your everyday wardrobe."}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]">Price currency</p>
                <p className="mt-1.5 text-sm font-semibold text-[#1E293B]">{product.price?.currency ?? "INR"}</p>
              </div>
              <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]">Availability</p>
                <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#4A6B5D]"><span className="h-2 w-2 rounded-full bg-[#4A6B5D]" />Available</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#DDE8E1] bg-[#C6EAD8]/20 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#4A6B5D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m9 12 2 2 4-4m5.5.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div><h2 className="text-sm font-semibold text-[#1E293B]">Made to be part of your everyday</h2><p className="mt-1 text-xs leading-relaxed text-[#64748B]">Explore the collection for thoughtfully selected pieces with a focus on comfort and personal style.</p></div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#4A6B5D] bg-white px-6 py-3.5 text-sm font-semibold text-[#4A6B5D] transition hover:bg-[#F5F2EC]">
                Add to cart
              </button>
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A6B5D] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(74,107,93,0.18)] transition hover:bg-[#3B574A] active:scale-[0.99]">
                Buy now
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
