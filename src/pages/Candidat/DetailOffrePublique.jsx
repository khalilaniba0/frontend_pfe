import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "constants/routes";
import Navbar from "components/miseEnPage/BarreNavigation.jsx";
import { useCandidateAuth } from "context/ContexteAuthCandidat";
import { getOffreById } from "service/restApiOffresEntreprise";
import { resolveEntrepriseMediaUrl, getPublicEntreprise } from "service/restApiEntreprise";
import PostulerModal from "components/Candidat/PostulerModal";

function formatPublishedDate(dateStr) {
  if (!dateStr) return null;
  var diff = Date.now() - new Date(dateStr).getTime();
  var days = Math.floor(diff / 86400000);
  var hours = Math.floor(diff / 3600000);
  if (days > 0) return "Publié il y a " + days + " jour" + (days > 1 ? "s" : "");
  if (hours > 0) return "Publié il y a " + hours + " heure" + (hours > 1 ? "s" : "");
  return "Publié récemment";
}

function formatDateFr(dateStr) {
  if (!dateStr) return null;
  var date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function extractOffre(response) {
  var payload = response?.data;
  if (!payload) return null;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }
  if (payload.offre && typeof payload.offre === "object") {
    return payload.offre;
  }
  if (payload._id) {
    return payload;
  }
  return null;
}

function toStringList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map(function (item) {
        if (typeof item === "string") return item.trim();
        return (item?.texte || item?.text || item?.nom || item?.name || "").trim();
      })
      .filter(Boolean);
  }
  if (typeof value === "string") {
    var normalizedValue = value.trim();
    if (!normalizedValue) return [];
    if (normalizedValue.indexOf("\n") === -1 && normalizedValue.length > 300) {
      return [normalizedValue];
    }
    return value
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }
  return [];
}

function getCompanyInitials(companyName) {
  var normalizedName = typeof companyName === "string" ? companyName.trim() : "";

  if (!normalizedName) {
    return "EN";
  }

  var words = normalizedName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return normalizedName.slice(0, 2).toUpperCase();
}

function JobHero(props) {
  var titre = props.titre;
  var typeContrat = props.typeContrat;
  var publishedLabel = props.publishedLabel;
  var entrepriseNom = props.entrepriseNom;
  var localisation = props.localisation;
  var isClosed = props.isClosed;
  var onPostulerClick = props.onPostulerClick;

  return (
    <section
      className="relative overflow-hidden px-4 py-10 md:px-8 md:py-14"
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid var(--color-hairline)" }}
    >
      {/* Conteneur principal (limité à max-w-7xl) pour l'alignement */}
      <div className="relative z-20 mx-auto max-w-7xl">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" style={{ color: "var(--color-ink)" }}>
          <div className="max-w-3xl">
            {(typeContrat || publishedLabel) && (
              <div className="mb-4 flex items-center gap-3">
                {typeContrat && (
                  <span className="badge-count" style={{ backgroundColor: "#e8f0fb", color: "var(--color-primary)" }}>
                    {typeContrat}
                  </span>
                )}
                {publishedLabel && (
                  <span className="font-text text-[14px]" style={{ color: "var(--color-body-muted)" }}>{publishedLabel}</span>
                )}
              </div>
            )}

            <h1
              className="mb-4 font-display font-semibold"
              style={{ fontSize: "clamp(34px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.28px" }}
            >
              {titre}
            </h1>

            <div className="flex flex-wrap items-center gap-4 font-text text-[14px] sm:gap-6" style={{ color: "var(--color-body-muted)" }}>
              {entrepriseNom && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] opacity-80">business</span>
                  <span>{entrepriseNom}</span>
                </div>
              )}
              {localisation && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] opacity-80">location_on</span>
                  <span>{localisation}</span>
                </div>
              )}
            </div>
          </div>

          {onPostulerClick && !isClosed && (
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={onPostulerClick}
                className="button-primary inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Postuler
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JobDetailsPanel(props) {
  var descriptionParagraphs = props.descriptionParagraphs;
  var responsibilities = props.responsibilities;

  return (
    <div className="min-w-0 overflow-hidden lg:col-span-8">
      <section className="apple-card">
        <h2 className="mb-6 flex items-center gap-3 font-display text-[34px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "-0.374px" }}>
          <span className="h-8 w-2 rounded-[var(--rounded-pill)]" style={{ backgroundColor: "var(--color-primary)" }} />
          Description du poste
        </h2>

        <div className="space-y-6 break-words overflow-wrap-anywhere font-text text-[17px] leading-[1.47]" style={{ color: "var(--color-ink-muted-80)" }}>
          {descriptionParagraphs.length > 0 ? (
            descriptionParagraphs.map(function (paragraph, idx) {
              return (
                <p key={idx} className="break-words whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })
          ) : (
            <p>Aucune description fournie par l'entreprise.</p>
          )}

          {responsibilities.length > 0 && (
            <ul className="space-y-4 pt-4">
              {responsibilities.map(function (line, idx) {
                return (
                  <li key={idx} className="flex gap-4">
                    <span className="material-symbols-outlined mt-1" style={{ color: "var(--color-primary)" }}>
                      check_circle
                    </span>
                    <span>{line}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function JobSkillsPanel(props) {
  var skills = props.skills;
  var additionalInfo = props.additionalInfo;

  return (
    <section className="apple-card">
      <h2 className="mb-6 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "0.231px" }}>Compétences requises</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="mb-4 font-text text-[12px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
            Technical Stack
          </h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map(function (skill, idx) {
                return (
                  <span
                    key={idx}
                    className="badge-count px-4 py-2"
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>Compétences non renseignées.</p>
          )}
        </div>
        <div>
          <h3 className="mb-4 font-text text-[12px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
            Informations clés
          </h3>
          {additionalInfo.length > 0 ? (
            <ul className="space-y-3 font-text text-[14px]" style={{ color: "var(--color-ink-muted-80)" }}>
              {additionalInfo.map(function (item) {
                return (
                  <li key={item.label} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
                    <span>
                      <strong>{item.label}:</strong> {item.value}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>Aucune information complémentaire fournie.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function CompanyAboutCard(props) {
  var entrepriseNom = props.entrepriseNom;
  var logoEntreprise = props.logoEntreprise;
  var apropos = props.apropos;
  var siteWeb = props.siteWeb;
  var email = props.email;
  var [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(
    function () {
      setLogoLoadError(false);
    },
    [logoEntreprise]
  );

  var shouldShowLogo = Boolean(logoEntreprise) && !logoLoadError;

  return (
    <div className="apple-card p-8">
      <h3 className="mb-5 flex items-center gap-2 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "0.231px" }}>
        <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-primary)" }}>apartment</span>
        À propos de l'entreprise
      </h3>

      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[var(--rounded-sm)]" style={{ backgroundColor: "var(--color-canvas-parchment)" }}>
          {shouldShowLogo ? (
            <img
              src={logoEntreprise}
              alt={entrepriseNom}
              className="allow-product-shadow h-full w-full object-cover"
              onError={function () {
                setLogoLoadError(true);
              }}
            />
          ) : (
            <span className="font-display text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
              {getCompanyInitials(entrepriseNom)}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>{entrepriseNom}</h4>
        </div>
      </div>

      {apropos ? (
        <>
          <div className="mb-5 h-px w-full" style={{ backgroundColor: "var(--color-divider-soft)" }} />
          <p className="whitespace-pre-line font-text text-[14px] leading-relaxed" style={{ color: "var(--color-ink-muted-80)" }}>
            {apropos}
          </p>
        </>
      ) : null}

      {(siteWeb || email) ? (
        <div className={"flex flex-col gap-2 " + (apropos ? "mt-5" : "")}>
          {siteWeb && (
            <a
              href={siteWeb.startsWith("http") ? siteWeb : "https://" + siteWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex items-center gap-2 font-text text-[14px] font-semibold"
            >
              <span className="material-symbols-outlined text-base">language</span>
              {siteWeb.replace(/^https?:\/\//, "")}
            </a>
          )}
          {email && (
            <a
              href={"mailto:" + email}
              className="text-link inline-flex items-center gap-2 font-text text-[14px] font-semibold"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              {email}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}

function JobSidebar(props) {
  var entrepriseNom = props.entrepriseNom;
  var logoEntreprise = props.logoEntreprise;
  var skills = props.skills;
  var additionalInfo = props.additionalInfo;
  var entrepriseData = props.entrepriseData;

  return (
    <aside className="space-y-6 lg:col-span-4">
      <CompanyAboutCard
        entrepriseNom={entrepriseNom}
        logoEntreprise={logoEntreprise}
        apropos={entrepriseData?.apropos || ""}
        siteWeb={entrepriseData?.siteWeb || ""}
        email={entrepriseData?.email || ""}
      />

      <JobSkillsPanel
        skills={skills}
        additionalInfo={additionalInfo}
      />
    </aside>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto mt-10 max-w-7xl animate-pulse px-8">
      <div className="mb-6 h-8 w-1/3 rounded bg-[#e0e3e5]" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="h-40 rounded-[2rem] bg-[#eceef0]" />
          <div className="h-56 rounded-[2rem] bg-[#eceef0]" />
        </div>
        <div className="space-y-4 lg:col-span-4">
          <div className="h-72 rounded-[2rem] bg-[#eceef0]" />
          <div className="h-48 rounded-[2rem] bg-[#eceef0]" />
        </div>
      </div>
    </div>
  );
}

function ErrorState(props) {
  var message = props.message;
  var onBack = props.onBack;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-28 text-center">
      <span className="material-symbols-outlined mb-4 text-6xl text-red-500">error</span>
      <h2 className="mb-2 font-display text-[34px] font-semibold" style={{ color: "var(--color-ink)" }}>Offre introuvable</h2>
      <p className="mb-8 font-text text-[17px]" style={{ color: "var(--color-ink-muted-80)" }}>{message || "Impossible de charger cette offre."}</p>
      <button
        type="button"
        onClick={onBack}
        className="button-primary"
      >
        Retour aux offres
      </button>
    </div>
  );
}

export default function JobDetail(props) {
  var showNavbar = props.showNavbar === true;
  var forceCandidateApply = Boolean(props.forceCandidateApply);
  var backToRoute = props.backToRoute || ROUTES.CANDIDATE.OFFRES;
  var params = useParams();
  var id = params.id;
  var navigate = useNavigate();
  var candidateAuth = useCandidateAuth();
  var isAuthenticated = candidateAuth.isAuthenticated;

  var [offre, setOffre] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [showPostulerModal, setShowPostulerModal] = useState(false);

  useEffect(
    function () {
      if (!id) {
        setError("Identifiant d'offre manquant.");
        setLoading(false);
        return;
      }

      async function fetchOffre() {
        try {
          setLoading(true);
          setError(null);
          var response = await getOffreById(id);
          var data = extractOffre(response);
          if (!data) {
            throw new Error("Format de réponse inattendu.");
          }
          setOffre(data);
        } catch (err) {
          setError(
            err?.response?.data?.message ||
              "Impossible de charger cette offre. Veuillez réessayer."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchOffre();
    },
    [id]
  );

  var titre = offre?.poste || offre?.titre || offre?.title || "Offre d'emploi";
  var entrepriseNom =
    offre?.entreprise?.nom ||
    offre?.entreprise?.name ||
    offre?.nomEntreprise ||
    "Entreprise non renseignée";
  var localisation = offre?.localisation || offre?.location || null;
  var typeContrat = offre?.typeContrat || offre?.contrat || offre?.type || null;
  var salaireDirect = offre?.salaire || offre?.salary || null;
  var salaireMin = offre?.salaireMin;
  var salaireMax = offre?.salaireMax;
  var salaire = salaireDirect;
  if (!salaire && (salaireMin || salaireMax)) {
    if (salaireMin && salaireMax) {
      salaire = salaireMin + "€ - " + salaireMax + "€";
    } else if (salaireMin) {
      salaire = "A partir de " + salaireMin + "€";
    } else {
      salaire = "Jusqu'à " + salaireMax + "€";
    }
  }
  var datePublication = offre?.createdAt || offre?.publishedAt || null;
  var publishedLabel = formatPublishedDate(datePublication);
  var rawStatus = String(offre?.statut || offre?.status || "").toLowerCase();
  var isStatusClosed = rawStatus === "closed" || rawStatus === "fermee" || rawStatus === "fermée";
  var isDatePassed =
    offre?.dateLimite && new Date(offre.dateLimite).getTime() < Date.now();
  var isClosed = isStatusClosed || isDatePassed;
  var modeContratRaw = offre?.modeContrat || null;
  var modeContrat =
    modeContratRaw === "presentiel"
      ? "Présentiel"
      : modeContratRaw === "hybride"
        ? "Hybride"
        : modeContratRaw === "remote"
          ? "Remote"
          : modeContratRaw;
  var departement = offre?.departement || null;
  var niveauExperience = offre?.niveauExperience || offre?.experience || null;
  var dateLimite = formatDateFr(offre?.dateLimite);

  var descriptionParagraphs = useMemo(
    function () {
      var baseDescription = offre?.description || offre?.about || "";
      var lines = toStringList(baseDescription);
      return lines;
    },
    [offre]
  );

  var responsibilities = useMemo(
    function () {
      return toStringList(offre?.responsabilites || offre?.responsibilities);
    },
    [offre]
  );

  var skills = useMemo(
    function () {
      return toStringList(offre?.competences || offre?.skills || offre?.exigences || offre?.requirements || offre?.technologies);
    },
    [offre]
  );

  var additionalInfo = useMemo(
    function () {
      var items = [];
      if (niveauExperience) {
        items.push({ label: "Niveau", value: String(niveauExperience) });
      }
      if (departement) {
        items.push({ label: "Département", value: String(departement) });
      }
      if (modeContrat) {
        items.push({ label: "Mode de travail", value: String(modeContrat) });
      }
      if (dateLimite) {
        items.push({ label: "Date limite", value: String(dateLimite) });
      }
      return items;
    },
    [niveauExperience, departement, modeContrat, dateLimite]
  );

  var logoEntreprise = resolveEntrepriseMediaUrl(
    offre?.entreprise?.logo || offre?.logoEntreprise || offre?.logo || ""
  );



  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-ink)", fontFamily: "var(--font-text)" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {showNavbar ? <Navbar /> : null}

      <main className={"pb-20 " + (showNavbar ? "pt-24" : "-mt-8 pt-0")}>
        {!loading && !error && showNavbar && (
          <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 md:px-8">
            <button
              type="button"
              onClick={function () { navigate(backToRoute); }}
              className="button-ghost-pill inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Retour aux offres
            </button>
          </div>
        )}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error}
            onBack={function () {
              navigate(backToRoute);
            }}
          />
        ) : (
          <>
            <JobHero
              titre={titre}
              typeContrat={typeContrat}
              publishedLabel={publishedLabel}
              entrepriseNom={entrepriseNom}
              localisation={localisation}
              isClosed={isClosed}
              onPostulerClick={function () {
                if (!isAuthenticated || !candidateAuth.candidat) {
                  navigate(
                    `${ROUTES.CANDIDATE.LOGIN}?redirect=${encodeURIComponent(`/offres/${id}`)}`
                  );
                  return;
                }

                setShowPostulerModal(true);
              }}
            />

            <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 md:mt-12 md:gap-8 md:px-8 lg:grid-cols-12">
              <JobDetailsPanel
                descriptionParagraphs={descriptionParagraphs}
                responsibilities={responsibilities}
              />
              <JobSidebar
                entrepriseNom={entrepriseNom}
                logoEntreprise={logoEntreprise}
                skills={skills}
                additionalInfo={additionalInfo}
                entrepriseData={offre?.entreprise || null}
              />
            </div>

            {showPostulerModal && (
              <PostulerModal
                offreId={id}
                offreTitre={titre}
                onClose={function () {
                  setShowPostulerModal(false);
                }}
                onSuccess={function () {
                  setShowPostulerModal(false);
                  navigate(ROUTES.CANDIDATE.MES_CANDIDATURES);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}