import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import type { RootState } from "../../../app/app.store";

export default function RoleSelection() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { handleSelectRole, loading, error: serverError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller">("buyer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.roleSelectionRequired) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await handleSelectRole(selectedRole);
      navigate("/", { replace: true });
    } catch {
      // Error handled via Redux slice and displayed below
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] font-sans antialiased flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-[#E8E4DC] bg-white p-8 shadow-[0_12px_40px_-12px_rgba(74,107,93,0.06),0_1px_3px_rgba(0,0,0,0.02)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-[#F5F2EC] px-3 py-1 text-xs font-medium text-[#4A6B5D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4A6B5D] animate-pulse" />
            Finish setup
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1E293B] sm:text-3xl">
            Choose how you want to use Snitch
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Pick the role that best fits your account. You can change it later
            from your settings.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 rounded-xl border border-[#FCDAD7] bg-[#FFF5F5] p-4 text-xs text-[#9E2A2B]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedRole("buyer")}
              className={`rounded-2xl border p-5 text-left transition-all ${
                selectedRole === "buyer"
                  ? "border-[#4A6B5D] bg-[#F0F5F2] shadow-sm"
                  : "border-[#E8E4DC] bg-[#F5F2EC]/40 hover:border-[#C9D7CD]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-[#1E293B]">
                  Buyer
                </span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#4A6B5D]">
                  Selected
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#64748B]">
                Shop, save favorites, and manage your purchases with a simple
                buyer account.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("seller")}
              className={`rounded-2xl border p-5 text-left transition-all ${
                selectedRole === "seller"
                  ? "border-[#4A6B5D] bg-[#F0F5F2] shadow-sm"
                  : "border-[#E8E4DC] bg-[#F5F2EC]/40 hover:border-[#C9D7CD]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-[#1E293B]">
                  Seller
                </span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#4A6B5D]">
                  Selected
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#64748B]">
                List products, manage inventory, and run your storefront as a
                seller.
              </p>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full rounded-xl bg-[#4A6B5D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3B574A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading || isSubmitting
              ? "Saving..."
              : `Continue as ${selectedRole}`}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#64748B]">
          {user?.email
            ? `Signed in as ${user.email}`
            : "Checking your account..."}
        </p>
      </div>
    </div>
  );
}
