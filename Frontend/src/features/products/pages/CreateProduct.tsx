import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  title: string;
  description: string;
  priceAmount: string;
  priceCurrency: string;
}

interface FormErrors {
  title?: string;
  priceAmount?: string;
  priceCurrency?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_SLOTS = [
  { label: "Fabric Detail" },
  { label: "Fit Reference" },
  { label: "Flat Lay" },
];

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", name: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", name: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", name: "GBP (£) - British Pound" },
  { code: "JPY", symbol: "¥", name: "JPY (¥) - Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "CAD (CA$) - Canadian Dollar" },
  { code: "AUD", symbol: "AU$", name: "AUD (AU$) - Australian Dollar" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "AU$",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({
  number,
  label,
  trailing,
}: {
  number: string;
  label: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#4A6B5D] inline-block shrink-0" />
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#475569]">
        {number}. {label}
      </h2>
    </div>
    {trailing}
  </div>
);

const FieldLabel = ({
  htmlFor,
  required,
  children,
  trailing,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569]"
    >
      {children}
      {required && <span className="text-[#A35C5C] ml-0.5">*</span>}
    </label>
    {trailing}
  </div>
);

const inputBase =
  "w-full bg-[#F5F2EC]/70 border border-[#E8E4DC] rounded-xl px-4 py-3 text-[#1E293B] text-sm focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15 transition-all outline-none placeholder:text-[#94A3B8]";

const inputError =
  "border-[#A35C5C] focus:border-[#A35C5C] focus:ring-[#A35C5C]/15";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProduct();

  // ── Form State ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const descCharCount = form.description.length;
  const currentSymbol = CURRENCY_SYMBOLS[form.priceCurrency] || "₹";

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim() || form.title.trim().length < 2) {
      e.title = "Product title must be at least 2 characters";
    }
    const parsedAmount = parseFloat(form.priceAmount.replace(/,/g, ""));
    if (!form.priceAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      e.priceAmount = "A valid amount greater than 0 is required";
    }
    if (!form.priceCurrency) {
      e.priceCurrency = "Currency is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Field Handlers ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ── Image Handlers ────────────────────────────────────────────────────────────
  const processFiles = useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files).slice(0, 5);
    setImages((prev) => {
      const available = 5 - prev.length;
      return [
        ...prev,
        ...incoming.slice(0, available).map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          label: prev.length === 0 ? "Cover Photo" : file.name,
        })),
      ];
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      if (updated.length > 0 && !prev.find((img) => img.label === "Cover Photo" && img.id !== id)) {
        updated[0] = { ...updated[0], label: "Cover Photo" };
      }
      return updated;
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      if (form.description.trim()) {
        formData.append("description", form.description.trim());
      }
      formData.append("priceAmount", form.priceAmount.replace(/,/g, ""));
      formData.append("priceCurrency", form.priceCurrency || "INR");

      images.forEach((img) => {
        formData.append("images", img.file);
      });

      await addProduct(formData as unknown as any);
      setSubmitted(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        "Failed to create product. Please check your inputs and permissions.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center py-16 px-8">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F5F2] text-[#4A6B5D] flex items-center justify-center mb-5 mx-auto border border-[#C6EAD8]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#1E293B] tracking-tight">
            Product archived successfully
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Redirecting to your catalog...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans antialiased flex flex-col">

      {/* ── Header ── */}
      <header className="bg-[#FAF8F5] sticky top-0 z-40 border-b border-[#E8E4DC]">
        <div className="flex items-center justify-between px-8 w-full h-16 max-w-[1600px] mx-auto">

          {/* Brand + Breadcrumb */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-[#4A6B5D] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-widest uppercase text-sm text-[#1E293B] leading-none">
                  SNITCH
                </span>
                <span className="text-[10px] tracking-wider uppercase text-[#64748B] font-medium">
                  Studio &amp; Collective
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#64748B] border-l border-[#E8E4DC] pl-8">
              <Link to="/seller" className="hover:text-[#4A6B5D] transition-colors">Seller Studio</Link>
              <span className="text-[#C0BAB0]">/</span>
              <Link to="/seller/catalog" className="hover:text-[#4A6B5D] transition-colors">Catalog</Link>
              <span className="text-[#C0BAB0]">/</span>
              <span className="text-[#4A6B5D] bg-[#C6EAD8]/40 px-2 py-0.5 rounded-md">New Product</span>
            </nav>
          </div>

          {/* Trailing actions */}
          <div className="flex items-center gap-3">
            <button className="hidden lg:flex items-center gap-1.5 text-[#64748B] hover:text-[#4A6B5D] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[#F5F2EC]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Need Help?
            </button>

            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#F5F2EC] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4A6B5D] ring-2 ring-[#FAF8F5]" />
            </button>

            <div className="h-5 w-px bg-[#E8E4DC] hidden sm:block" />

            <div className="flex items-center gap-2 pl-1 py-1 rounded-xl pr-2 hover:bg-[#F5F2EC] cursor-pointer transition-colors border border-[#E8E4DC]">
              <div className="w-7 h-7 rounded-lg bg-[#EAE8E5] border border-[#E8E4DC] flex items-center justify-center font-semibold text-xs text-[#4A6B5D]">
                AS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1E293B] leading-tight">Atelier Snitch</p>
                <p className="text-[10px] text-[#64748B]">Paris · Mumbai</p>
              </div>
              <svg className="w-3.5 h-3.5 text-[#94A3B8]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">

        {/* ── Main Canvas ── */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">

            {/* LEFT COLUMN — Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_-12px_rgba(74,107,93,0.06)]">

                {/* Page Header */}
                <div className="border-b border-[#E8E4DC] pb-6 mb-8">
                  <div className="flex items-center gap-2 text-[#4A6B5D] text-[11px] font-bold uppercase tracking-widest mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#4A6B5D] animate-pulse" />
                    Garment Atelier Archive
                  </div>
                  <h1 className="text-2xl font-semibold text-[#1E293B] tracking-tight">
                    Create New Garment &amp; Archive Item
                  </h1>
                  <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                    Provide curated styling details, pricing amount, currency, and rich media for the Snitch Collective storefront.
                  </p>
                </div>

                {serverError && (
                  <div className="mb-6 p-4 rounded-2xl bg-[#A35C5C]/10 border border-[#A35C5C]/30 text-[#A35C5C] text-sm flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}

                <form
                  className="space-y-10"
                  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                  noValidate
                >

                  {/* ── Section 1: Basic Information ── */}
                  <section className="space-y-5">
                    <SectionHeader number="01" label="Basic Information" />
                    <div className="space-y-4">

                      {/* Product Title */}
                      <div>
                        <FieldLabel htmlFor="title" required>Product Title</FieldLabel>
                        <input
                          id="title" name="title" type="text"
                          placeholder="e.g. Oversized Structured Sage Linen Blazer"
                          value={form.title}
                          onChange={handleChange}
                          className={`${inputBase} ${errors.title ? inputError : ""}`}
                        />
                        {errors.title && <p className="text-xs text-[#A35C5C] mt-1">{errors.title}</p>}
                      </div>

                      {/* Description */}
                      <div>
                        <FieldLabel
                          htmlFor="description"
                          trailing={
                            <span className="text-[11px] text-[#94A3B8]">
                              {descCharCount} / 1,000 characters
                            </span>
                          }
                        >
                          Editorial Description
                        </FieldLabel>
                        <textarea
                          id="description" name="description"
                          rows={4}
                          maxLength={1000}
                          placeholder="Describe the garment's material, silhouette, and key details..."
                          value={form.description}
                          onChange={handleChange}
                          className={`${inputBase} resize-none leading-relaxed`}
                        />
                      </div>
                    </div>
                  </section>

                  {/* ── Section 2: Pricing (Amount & Currency) ── */}
                  <section className="space-y-5 pt-6 border-t border-[#E8E4DC]/60">
                    <SectionHeader number="02" label="Pricing &amp; Currency" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Amount */}
                      <div>
                        <FieldLabel htmlFor="priceAmount" required>Amount</FieldLabel>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] font-semibold text-sm">
                            {currentSymbol}
                          </span>
                          <input
                            id="priceAmount"
                            name="priceAmount"
                            type="text"
                            placeholder="0.00"
                            value={form.priceAmount}
                            onChange={handleChange}
                            className={`${inputBase} pl-9 ${errors.priceAmount ? inputError : ""}`}
                          />
                        </div>
                        {errors.priceAmount && <p className="text-xs text-[#A35C5C] mt-1">{errors.priceAmount}</p>}
                      </div>

                      {/* Currency */}
                      <div>
                        <FieldLabel htmlFor="priceCurrency" required>Currency</FieldLabel>
                        <select
                          id="priceCurrency"
                          name="priceCurrency"
                          value={form.priceCurrency}
                          onChange={handleChange}
                          className={`${inputBase} cursor-pointer`}
                        >
                          {CURRENCIES.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                              {curr.name}
                            </option>
                          ))}
                        </select>
                        {errors.priceCurrency && <p className="text-xs text-[#A35C5C] mt-1">{errors.priceCurrency}</p>}
                      </div>
                    </div>
                  </section>

                  {/* ── Section 3: Visual Assets & Media ── */}
                  <section className="space-y-5 pt-6 border-t border-[#E8E4DC]/60">
                    <SectionHeader
                      number="03"
                      label="Visual Assets &amp; Media"
                      trailing={
                        <span className="text-[11px] text-[#94A3B8]">
                          {images.length} of 5 slots utilized
                        </span>
                      }
                    />

                    {/* Dropzone */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileInput}
                      className="sr-only"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${isDragOver
                        ? "border-[#4A6B5D] bg-[#F0F5F2]"
                        : "border-[#4A6B5D]/40 bg-[#F5F2EC]/40 hover:bg-[#F5F2EC]/80 hover:border-[#4A6B5D]"
                        }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#C6EAD8]/50 text-[#4A6B5D] flex items-center justify-center mb-3 transition-transform hover:scale-105">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-[#1E293B]">
                        Drop editorial images here or click to browse
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Supports PNG, JPG, WebP up to 15MB each (High-res 3:4 portrait recommended)
                      </p>
                    </div>

                    {/* Image Thumbnail Tray */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-[#4A6B5D] aspect-3/4 bg-[#F5F2EC] shadow-sm">
                          <img
                            src={img.preview}
                            alt={img.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              title="Remove"
                              className="w-8 h-8 rounded-full bg-white/90 text-[#A35C5C] flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          {img.label === "Cover Photo" && (
                            <span className="absolute top-2 left-2 bg-[#4A6B5D] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Cover Photo
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Empty placeholder slots */}
                      {PLACEHOLDER_SLOTS.slice(0, Math.max(0, 4 - images.length)).map((slot) => (
                        <div
                          key={slot.label}
                          onClick={() => fileInputRef.current?.click()}
                          className="relative rounded-xl border border-dashed border-[#E8E4DC] bg-[#F5F2EC]/60 aspect-3/4 flex flex-col items-center justify-center p-3 text-center hover:border-[#4A6B5D]/50 cursor-pointer transition-colors"
                        >
                          <svg className="w-5 h-5 text-[#94A3B8] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[11px] text-[#64748B] font-medium">{slot.label}</span>
                          <span className="text-[10px] text-[#94A3B8] mt-0.5">+ Upload</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ── Form Footer ── */}
                  <div className="pt-6 border-t border-[#E8E4DC] flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-[#4A6B5D] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(74,107,93,0.2)] hover:bg-[#3B574A] transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Product
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN — Live Storefront Preview */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">

              {/* Preview Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#4A6B5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#475569]">
                    Live Storefront Preview
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F5F2EC] border border-[#E8E4DC] px-2.5 py-1 rounded-full text-[11px] text-[#1E293B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B5D]" />
                  Desktop View
                </div>
              </div>

              {/* Product Card Preview */}
              <div className="bg-white border border-[#E8E4DC] rounded-3xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(74,107,93,0.08)] group">

                {/* Product Image */}
                <div className="relative aspect-3/4 w-full bg-[#F5F2EC] overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[0].preview}
                      alt="Product preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#C0BAB0]">
                      <svg className="w-12 h-12 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-[#C0BAB0]">Upload images to preview</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1E293B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      New Arrival
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#64748B] hover:text-[#A35C5C] flex items-center justify-center shadow-md transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Info Body */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-[#1E293B] leading-tight">
                      {form.title || (
                        <span className="text-[#C0BAB0]">Product title will appear here</span>
                      )}
                    </h3>
                    {form.description && (
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {form.priceAmount ? (
                      <span className="text-xl font-semibold text-[#1E293B]">
                        {currentSymbol} {form.priceAmount}
                      </span>
                    ) : (
                      <span className="text-[#C0BAB0] text-sm">
                        {currentSymbol} 0.00
                      </span>
                    )}
                    <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">
                      ({form.priceCurrency})
                    </span>
                  </div>

                  {/* Sync note */}
                  <div className="pt-3 border-t border-[#E8E4DC]/60 flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <svg className="w-4 h-4 text-[#4A6B5D] animate-spin [animation-duration:3s]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Live simulation updates automatically as you input garment attributes.
                  </div>
                </div>
              </div>

              {/* Editorial Note */}
              <div className="p-4 rounded-2xl bg-[#C6EAD8]/20 border border-[#E8E4DC] flex items-start gap-3">
                <svg className="w-5 h-5 text-[#4A6B5D] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  This garment adheres to the{" "}
                  <strong className="text-[#1E293B] font-medium">Snitch Editorial Standard</strong>.
                  High-resolution primary lookbook imagery is verified for seamless responsiveness
                  across mobile and ultra-wide devices.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}