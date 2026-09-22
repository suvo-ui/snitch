import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const countryCodes = [
  { code: "+91", country: "IN", label: "India (+91)" },
  { code: "+1", country: "US", label: "United States (+1)" },
  { code: "+44", country: "GB", label: "United Kingdom (+44)" },
  { code: "+61", country: "AU", label: "Australia (+61)" },
  { code: "+49", country: "DE", label: "Germany (+49)" },
  { code: "+33", country: "FR", label: "France (+33)" },
  { code: "+971", country: "AE", label: "UAE (+971)" },
  { code: "+65", country: "SG", label: "Singapore (+65)" },
  { code: "+81", country: "JP", label: "Japan (+81)" },
];

export default function Register() {
  const navigate = useNavigate();
  const { handleRegister, loading, error: serverError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    contactNumber: "",
    password: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Evaluate password strength (0 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(formData.password);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-[#E2DDD4]",
    "bg-[#D97706]",
    "bg-[#5C8374]",
    "bg-[#4A6B5D]",
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter a valid full name";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^\d{7,15}$/.test(formData.contactNumber.replace(/[\s-]/g, ""))) {
      errors.contactNumber = "Please enter a valid phone number (7-15 digits)";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const fullContactNumber = `${formData.countryCode} ${formData.contactNumber.trim()}`;
      await handleRegister({
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        contactNumber: fullContactNumber,
        password: formData.password,
        isSeller: formData.isSeller,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      // Error handled via Redux slice and displayed below
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans antialiased flex flex-col justify-between selection:bg-[#4A6B5D]/15 selection:text-[#1E293B]">
      {/* Top Ambient Navigation / Brand Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#4A6B5D] text-white flex items-center justify-center font-serif text-lg font-medium shadow-sm transition-transform duration-300 group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-lg text-[#1E293B]">
              SNITCH
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#64748B] -mt-1 font-medium">
              Studio & Collective
            </span>
          </div>
        </Link>

        <div className="text-xs text-[#64748B] hidden sm:flex items-center gap-1.5">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="text-[#4A6B5D] hover:text-[#3B574A] font-medium transition-colors hover:underline"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Container Well */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {/* Card Container */}
          <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 shadow-[0_12px_40px_-12px_rgba(74,107,93,0.06),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300">
            
            {/* Header section with breathing room */}
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EC] border border-[#E8E4DC] text-[#4A6B5D] text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B5D] animate-pulse"></span>
                Join our tranquil collective
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
                Create your account
              </h1>
              <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                Experience intentional commerce designed with calm, clarity, and precision.
              </p>
            </div>

            {/* Server Error Notification */}
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-[#FFF5F5] border border-[#FCDAD7] text-[#9E2A2B] text-xs leading-relaxed flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5 text-[#BA1A1A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Success Notification */}
            {isSuccess ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F5F2] text-[#4A6B5D] flex items-center justify-center mb-4 border border-[#C6EAD8]">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  Account created peacefully
                </h3>
                <p className="text-sm text-[#64748B] mt-1">
                  Welcome to Snitch. Redirecting to your workspace...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* 1. Full Name Input */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold tracking-wide uppercase text-[#475569] mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Julian Hayes"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 rounded-xl bg-[#F5F2EC]/60 border text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:bg-white focus:outline-none ${
                        formErrors.fullName
                          ? "border-[#A35C5C] focus:ring-2 focus:ring-[#A35C5C]/20"
                          : "border-[#E8E4DC] focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15"
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-xs text-[#A35C5C] mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold tracking-wide uppercase text-[#475569] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full h-12 px-4 rounded-xl bg-[#F5F2EC]/60 border text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:bg-white focus:outline-none ${
                      formErrors.email
                        ? "border-[#A35C5C] focus:ring-2 focus:ring-[#A35C5C]/20"
                        : "border-[#E8E4DC] focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-[#A35C5C] mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* 3. Contact Number Input with Integrated Country Code */}
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="block text-xs font-semibold tracking-wide uppercase text-[#475569] mb-1.5"
                  >
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Country code selector */}
                    <div className="relative shrink-0">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="h-12 pl-3 pr-8 rounded-xl bg-[#F5F2EC]/60 border border-[#E8E4DC] text-xs font-medium text-[#334155] focus:bg-white focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.country} {item.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex-1">
                      <input
                        id="contactNumber"
                        name="contactNumber"
                        type="tel"
                        placeholder="98765 43210"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className={`w-full h-12 px-4 rounded-xl bg-[#F5F2EC]/60 border text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:bg-white focus:outline-none ${
                          formErrors.contactNumber
                            ? "border-[#A35C5C] focus:ring-2 focus:ring-[#A35C5C]/20"
                            : "border-[#E8E4DC] focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15"
                        }`}
                      />
                    </div>
                  </div>
                  {formErrors.contactNumber && (
                    <p className="text-xs text-[#A35C5C] mt-1">
                      {formErrors.contactNumber}
                    </p>
                  )}
                </div>

                {/* 4. Password Input + Toggle & Soft Strength Meter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold tracking-wide uppercase text-[#475569]"
                    >
                      Password
                    </label>
                    {formData.password && (
                      <span className="text-[11px] text-[#64748B] font-medium">
                        Strength:{" "}
                        <span className="text-[#4A6B5D] font-semibold">
                          {strengthLabels[strengthScore - 1] || "Weak"}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full h-12 pl-4 pr-12 rounded-xl bg-[#F5F2EC]/60 border text-sm text-[#1E293B] placeholder-[#94A3B8] transition-all duration-200 focus:bg-white focus:outline-none ${
                        formErrors.password
                          ? "border-[#A35C5C] focus:ring-2 focus:ring-[#A35C5C]/20"
                          : "border-[#E8E4DC] focus:border-[#4A6B5D] focus:ring-2 focus:ring-[#4A6B5D]/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Bars */}
                  {formData.password && (
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            strengthScore >= step
                              ? strengthColors[strengthScore - 1]
                              : "bg-[#E8E4DC]"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {formErrors.password && (
                    <p className="text-xs text-[#A35C5C] mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* 5. isSeller Checkbox / Dedicated Merchant Card */}
                <div className="pt-1">
                  <label
                    htmlFor="isSeller"
                    className={`block p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                      formData.isSeller
                        ? "bg-[#F4F7F5] border-[#4A6B5D]/40 shadow-sm"
                        : "bg-[#FBF9F6] border-[#E8E4DC] hover:border-[#D5D0C5]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="pt-0.5">
                        <input
                          id="isSeller"
                          name="isSeller"
                          type="checkbox"
                          checked={formData.isSeller}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-200 ${
                            formData.isSeller
                              ? "bg-[#4A6B5D] border-[#4A6B5D] text-white"
                              : "bg-white border-[#C9C4B8]"
                          }`}
                        >
                          {formData.isSeller && (
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1E293B]">
                            Register as a Seller / Merchant
                          </span>
                          {formData.isSeller && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#4A6B5D] text-white rounded-full">
                              Merchant Mode
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                          Unlock seller studio, publish collections, manage catalog inventory, and view direct analytics.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 px-6 rounded-xl bg-[#4A6B5D] hover:bg-[#3B574A] active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(74,107,93,0.18)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </div>

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-center text-[#94A3B8] leading-normal pt-1">
                  By creating an account, you agree to Snitch’s{" "}
                  <a href="#" className="underline hover:text-[#475569]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-[#475569]">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}

            {/* Mobile Sign In Link */}
            <div className="mt-8 pt-6 border-t border-[#E8E4DC] text-center sm:hidden text-xs text-[#64748B]">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-[#4A6B5D] font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Footer Tranquility & Trust Badge */}
          <div className="mt-8 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#5C8374]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              256-bit Encrypted
            </span>
            <span>•</span>
            <span>Zero Spam Guarantee</span>
            <span>•</span>
            <span>Serene Experience</span>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-[11px] text-[#A8A29E]">
        © {new Date().getFullYear()} Snitch Collective. All rights reserved.
      </footer>
    </div>
  );
}
