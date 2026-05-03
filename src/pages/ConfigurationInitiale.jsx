import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { useAuth } from "context/ContexteAuth";
import { completeSetup } from "service/restApiUtilisateurs";
import { ROUTES } from "constants/routes";

function getPasswordStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}
const STRENGTH_LABEL = ["", "Faible", "Correct", "Bon", "Excellent"];
const STRENGTH_TEXT_COLOR = ["", "text-red-500", "text-amber-500", "text-amber-600", "text-emerald-600"];
const STRENGTH_BAR_COLOR = ["", "bg-red-400", "bg-amber-400", "bg-amber-500", "bg-emerald-500"];

export default function ConfigurationInitiale() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({ nom: user?.nom || "", motDePasse: "", motDePasseConfirm: "", tel: user?.tel || "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!user?.firstLogin) {
    navigate(ROUTES.ADMIN.ROOT, { replace: true });
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const strength = getPasswordStrength(form.motDePasse);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || form.motDePasse.length < 8) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (mot de passe 8 car. min)");
      return;
    }
    if (form.motDePasse !== form.motDePasseConfirm) {
      setErrorMsg("Les mots de passe ne correspondent pas");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await completeSetup({ nom: form.nom, motDePasse: form.motDePasse, tel: form.tel });
      if (setUser) {
        setUser({ ...user, ...data.data, firstLogin: false });
      }
      navigate(ROUTES.ADMIN.ROOT, { replace: true });
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Erreur lors de la configuration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--rounded-lg)]"
          style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-primary)" }}
        >
          <span className="material-symbols-outlined text-3xl">rocket_launch</span>
        </div>
        <h2 className="mt-6 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>Bienvenue sur Talentia !</h2>
        <p className="mt-3 font-text text-[14px] leading-relaxed" style={{ color: "var(--color-ink-muted-48)" }}>
          C'est votre première connexion.<br/>Veuillez configurer votre profil administrateur pour commencer.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-[var(--rounded-sm)] p-4 border" style={{ backgroundColor: "#ffe0e0", borderColor: "#ffc0c0", color: "#d00" }}>
          <span className="material-symbols-outlined">error</span>
          <p className="m-0 font-text text-[14px]">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Nom complet <span style={{ color: "var(--color-primary)" }}>*</span></label>
          <input
            type="text"
            name="nom"
            required
            value={form.nom}
            onChange={handleChange}
            placeholder="Jean Dupont"
            className="apple-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Nouveau mot de passe <span style={{ color: "var(--color-primary)" }}>*</span></label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="motDePasse"
              required
              minLength={8}
              value={form.motDePasse}
              onChange={handleChange}
              placeholder="Min. 8 caractères"
              className="apple-input"
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 transition-colors"
              style={{ color: "var(--color-ink-muted-48)" }}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {form.motDePasse && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? STRENGTH_BAR_COLOR[strength] : "bg-border"}`} />
                ))}
              </div>
              <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>
                Force : <span className={`font-medium ${STRENGTH_TEXT_COLOR[strength]}`}>{STRENGTH_LABEL[strength]}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Confirmer le mot de passe <span style={{ color: "var(--color-primary)" }}>*</span></label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="motDePasseConfirm"
              required
              minLength={8}
              value={form.motDePasseConfirm}
              onChange={handleChange}
              placeholder="Retapez votre mot de passe"
              className="apple-input"
              style={{ paddingRight: "48px" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Téléphone (optionnel)</label>
          <input
            type="tel"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            placeholder="+33 6 00 00 00 00"
            className="apple-input"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || form.motDePasse.length < 8 || !form.nom || form.motDePasse !== form.motDePasseConfirm}
          className="button-primary w-full mt-2"
        >
          {submitting ? "Configuration..." : "Commencer à utiliser Talentia"}
        </button>
      </form>
    </AuthLayout>
  );
}
