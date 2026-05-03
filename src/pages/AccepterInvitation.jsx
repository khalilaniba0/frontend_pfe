import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { checkInvitation, acceptInvitation } from "service/restApiUtilisateurs";
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

export default function AccepterInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ nom: "", motDePasse: "", tel: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkInvitation(token)
      .then((res) => {
        setEmail(res.data.email);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Ce lien est invalide ou a expiré");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const strength = getPasswordStrength(form.motDePasse);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || form.motDePasse.length < 8) return;
    setSubmitting(true);
    try {
      await acceptInvitation(token, form);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Erreur lors de l'activation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="animate-spin text-primary material-symbols-outlined text-4xl">progress_activity</div>
      </div>
    );
  }

  if (errorMsg && !email) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--rounded-lg)]"
            style={{ backgroundColor: "#ffe0e0" }}
          >
            <span className="material-symbols-outlined text-3xl" style={{ color: "#d00" }}>error</span>
          </div>
          <h2 className="mt-6 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>Lien invalide</h2>
          <p className="mt-2 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>{errorMsg}</p>
          <Link to={ROUTES.LOGIN} className="button-primary w-full mt-8">Retour à l'accueil</Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--rounded-lg)]"
            style={{ backgroundColor: "#e8f4e8" }}
          >
            <span className="material-symbols-outlined text-3xl" style={{ color: "#1d6b1d" }}>check_circle</span>
          </div>
          <h2 className="mt-6 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>Compte activé !</h2>
          <p className="mt-2 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>Vous pouvez maintenant vous connecter à votre espace RH.</p>
          <Link to={ROUTES.LOGIN} className="button-primary w-full mt-8">Se connecter</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--rounded-lg)]"
          style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-primary)" }}
        >
          <span className="material-symbols-outlined text-2xl">person_add</span>
        </div>
        <h2 className="mt-4 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>Activer votre compte</h2>
        <p className="mt-2 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>Complétez vos informations pour finaliser votre inscription.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-[var(--rounded-sm)] p-4 border" style={{ backgroundColor: "#ffe0e0", borderColor: "#ffc0c0", color: "#d00" }}>
          <p className="m-0 font-text text-[14px]">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Email</label>
          <input
            type="email"
            readOnly
            value={email}
            className="apple-input"
            style={{ backgroundColor: "var(--color-canvas-parchment)", cursor: "not-allowed" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Nom et prénom <span style={{ color: "var(--color-primary)" }}>*</span></label>
          <input
            type="text"
            name="nom"
            required
            value={form.nom}
            onChange={handleChange}
            placeholder="Sophie Martin"
            className="apple-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Mot de passe <span style={{ color: "var(--color-primary)" }}>*</span></label>
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
          disabled={submitting || form.motDePasse.length < 8 || !form.nom}
          className="button-primary w-full mt-2"
        >
          {submitting ? "Activation..." : "Activer mon compte"}
        </button>
      </form>
    </AuthLayout>
  );
}
