"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/app/components/layout/MainLayout";

const ROLE_LABELS = {
  agent: "סוכן",
  customer: "לקוח",
  admin: "מנהל מערכת",
  manager: "מנהל",
};

function buildCouponCode(user) {
  if (!user) return "";

  if (user.couponCode) {
    return String(user.couponCode).trim();
  }

  const rawName = String(user.fullName || user.name || "סוכן").trim();
  const sanitizedName = rawName.replace(/\s+/g, "");
  const baseName = sanitizedName || "סוכן";

  let sequence = user?.couponSequence;
  if (sequence === undefined || sequence === null || sequence === "") {
    const numericFromId = String(user?._id ?? "").replace(/\D/g, "").slice(-3);
    if (numericFromId) {
      sequence = numericFromId;
    }
  }

  const sequenceStr = String(sequence ?? "1").trim() || "1";
  return `${baseName}${sequenceStr}`;
}

function getInitials(user) {
  const name = String(user?.fullName || user?.name || "").trim();
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name[0].toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          throw new Error("AUTH_FAILED");
        }

        const data = await res.json();
        let mergedUser = data?.user || null;

        if (mergedUser) {
          try {
            const profileRes = await fetch("/api/users/me");
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              if (profileData?.user) {
                mergedUser = { ...mergedUser, ...profileData.user };
              }
            }
          } catch (profileError) {
            console.error("Failed to fetch extended profile:", profileError);
          }
        }

        setUser(mergedUser);
        setError("");
        setFormData({
          fullName: mergedUser?.fullName || "",
          phone: mergedUser?.phone || "",
          email: mergedUser?.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setError("אירעה שגיאה בטעינת הפרופיל. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const couponCode = buildCouponCode(user);
  const roleLabel = ROLE_LABELS[user?.role] || "משתמש";
  const initials = getInitials(user);

  const handleEditClick = () => {
    setFormError("");
    setFormSuccess("");
    setFormData({
      fullName: user?.fullName || user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaving(false);
    setFormError("");
    setFormSuccess("");
    setFormData({
      fullName: user?.fullName || user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    const trimmed = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };

    if (!trimmed.fullName) {
      setFormError("יש להזין שם מלא");
      return;
    }

    setSaving(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmed),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "שמירת הפרופיל נכשלה");
      }

      if (data?.user) {
        setUser(data.user);
        setFormSuccess("הפרטים נשמרו בהצלחה");
        setIsEditing(false);
        setFormData({
          fullName: data.user.fullName || data.user.name || "",
          phone: data.user.phone || "",
          email: data.user.email || "",
        });
      } else {
        setFormSuccess("הפרטים עודכנו");
      }
    } catch (submitError) {
      console.error("Failed to save profile:", submitError);
      setFormError(submitError.message || "שמירת הפרופיל נכשלה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-slate-50 via-white to-slate-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-white border border-rose-100 text-rose-600 rounded-3xl shadow-sm p-8 text-center">
              <p className="text-lg font-semibold mb-2">לא הצלחנו לטעון את הפרופיל</p>
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          ) : user ? (
            <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 p-6 sm:p-8 text-white">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {initials}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">{roleLabel} ב-VIPO</p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {user.fullName || user.name || "סוכן VIPO"}
                      </h1>
                      {user.email && (
                        <p className="text-sm text-white/80 mt-1">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3 text-right">
                    {couponCode && (
                      <div className="bg-white/15 border border-white/20 rounded-2xl px-5 py-3 font-semibold tracking-wide">
                        <span className="text-sm sm:text-base">קוד קופון:</span>{" "}
                        <span className="text-lg sm:text-xl">{couponCode.toUpperCase()}</span>
                      </div>
                    )}
                    {user?.couponSlug && (
                      <span className="text-xs text-white/70">קישור אישי: {user.couponSlug}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm text-right">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">פרטי קשר</h2>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">טלפון</p>
                        <p className="text-base font-medium text-slate-900">
                          {user.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">אימייל</p>
                        <p className="text-base font-medium text-slate-900">
                          {user.email || "—"}
                        </p>
                      </div>
                      {user.city && (
                        <div>
                          <p className="text-xs text-slate-500">עיר</p>
                          <p className="text-base font-medium text-slate-900">{user.city}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm text-right">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">פרטי חשבון</h2>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">תפקיד</p>
                        <p className="text-base font-medium text-slate-900">{roleLabel}</p>
                      </div>
                      {user?.couponSequence && (
                        <div>
                          <p className="text-xs text-slate-500">מספר סוכן</p>
                          <p className="text-base font-medium text-slate-900">{user.couponSequence}</p>
                        </div>
                      )}
                      {user?.createdAt && (
                        <div>
                          <p className="text-xs text-slate-500">תאריך הצטרפות</p>
                          <p className="text-base font-medium text-slate-900">
                            {new Date(user.createdAt).toLocaleDateString("he-IL")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 shadow-sm text-right">
                  <h2 className="text-lg font-semibold text-indigo-900 mb-3">הגדרות חשבון ופעולות</h2>
                  <p className="text-sm text-indigo-900/80 leading-relaxed">
                    בקרוב תוכלו לעדכן פרטי חשבון, לבחור אמצעי תשלום לעמלות ולנהל הגדרות אבטחה. בינתיים, אם יש צורך בעדכון – פנו למנהל הקשר האישי שלכם או לצוות התמיכה.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <a
                      href="mailto:support@vipo.agents"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-white/80 transition-all"
                    >
                      תמיכה במייל
                    </a>
                    <a
                      href="https://wa.me/972533858881"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                    >
                      יצירת קשר ב-WhatsApp
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">עדכון פרטים אישיים</h2>
                      <p className="text-sm text-slate-500">ניתן לעדכן את השם, מספר הטלפון והאימייל שלך.</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={handleEditClick}
                        className="self-end inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all"
                      >
                        ערוך פרטים
                      </button>
                    )}
                  </div>

                  {formSuccess && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {formSuccess}
                    </div>
                  )}
                  {formError && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  )}

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-right text-sm font-medium text-slate-600">
                          שם מלא
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange("fullName")}
                            className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="שם מלא"
                          />
                        </label>
                        <label className="flex flex-col text-right text-sm font-medium text-slate-600">
                          טלפון
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange("phone")}
                            className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="מספר טלפון"
                          />
                        </label>
                        <label className="flex flex-col text-right text-sm font-medium text-slate-600 md:col-span-2">
                          אימייל
                          <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="אימייל"
                          />
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                          disabled={saving}
                        >
                          בטל
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:cursor-not-allowed disabled:bg-indigo-400"
                          disabled={saving}
                        >
                          {saving ? "שומר..." : "שמור שינויים"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-sm text-slate-600 leading-relaxed">
                      <p>
                        עדכן את הפרטים שלך כך שהלקוחות והמנהל יוכלו ליצור איתך קשר במהירות. שינוי אימייל יעדכן גם את פרטי ההתחברות שלך.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 text-center">
              <p className="text-slate-600">לא נמצאו נתוני משתמש להצגה.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
