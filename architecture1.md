# Architecture Frontend - Talentia ATS (CRA)

Mise a jour: 2026-04-05

## Objectif

Ce document liste les fichiers frontend importants, leur role, et ou ils sont utilises.
Perimetre: `frontend_pfe/` (code source maintenable, pas les artefacts `build/`).

## Fichiers racine frontend_pfe/

- `frontend_pfe/.env` : variables d'environnement frontend (ex: URL API CRA).
- `frontend_pfe/.gitignore` : regles git pour les fichiers a ignorer (node_modules, build, fichiers d'environnement local). Utilise par git lors des commits.
- `frontend_pfe/package.json` : dependances et scripts CRA. Utilise par npm/yarn.
- `frontend_pfe/package-lock.json` : verrouillage des versions npm.
- `frontend_pfe/jsconfig.json` : alias et resolution imports (`components/...`, `pages/...`). Utilise par tout le code `src`.
- `frontend_pfe/tailwind.config.js` : configuration Tailwind. Utilise par `src/assets/styles/tailwind.css`.
- `frontend_pfe/src_usage_map.txt` : inventaire/trace des usages dans `src`.
- `frontend_pfe/architecture1.md` : cartographie des fichiers frontend (ce document).

## Public

- `frontend_pfe/public/index.html` : page HTML racine CRA. Utilise par `src/index.js`.
- `frontend_pfe/public/manifest.json` : metadonnees PWA.
- `frontend_pfe/public/robots.txt` : directives robots.
- `frontend_pfe/public/favicon.ico` : icone navigateur/onglet de l'application.
- `frontend_pfe/public/logo192.png` : logo PWA 192x192. Utilise par `public/manifest.json`.
- `frontend_pfe/public/logo512.png` : logo PWA 512x512. Utilise par `public/manifest.json`.

## Noyau src/

- `src/index.js` : point d'entree React, monte `AuthProvider`, `CandidateAuthProvider`, `BrowserRouter`, puis `App`.
- `src/App.jsx` : routeur principal (`Routes`, `ProtectedRoute`, `CandidateAuthGuard`) et montage des pages.
- `src/assets/styles/tailwind.css` : styles globaux Tailwind + tokens UI. Importe dans `src/index.js`.
- `src/assets/auth-hero-visual.svg` : illustration auth. Utilisee dans `src/components/Sections/HeroAuthentification.jsx`.
- `src/config/api.js` : definit `API_URL` / `API_ORIGIN`. Utilise par tous les `src/service/restApi*.js`.
- `src/constants/routes.js` : routes centralisees (`ROUTES`). Utilise par `src/App.jsx` + pages/layouts.
- `src/constants/navigation.js` : menu lateral admin (`NAV_ITEMS`). Utilise par `src/components/miseEnPage/BarreLaterale.jsx`.
- `src/context/ContexteAuth.jsx` : contexte auth admin/RH (`useAuth`). Utilise par pages/layouts admin.
- `src/context/ContexteAuthCandidat.jsx` : contexte auth candidat (`useCandidateAuth`). Utilise par pages/layouts candidat.
- `src/layouts/MiseEnPageAuth.jsx` : layout pages auth publiques. Utilise par `src/pages/Connexion.jsx`, `src/pages/Inscription.jsx`, `src/pages/MotDePasseOublie.jsx`.

## Pages src/pages/

- `src/pages/PageSelection.jsx` : page de selection de profil. Utilise `CarteSelection`, `LogoMarque`. Montee dans `App`.
- `src/pages/PageAccueil.jsx` : landing page publique. Utilise `BarreNavigation`, `BanniereHero`, `SectionFonctionnalites`, `PiedDePage`.
- `src/pages/Connexion.jsx` : connexion entreprise/admin. Utilise `MiseEnPageAuth`, `HeroAuthentification`, `LogoMarque`, `ContexteAuth`.
- `src/pages/Inscription.jsx` : inscription entreprise. Utilise `MiseEnPageAuth`, `HeroAuthentification`, `LogoMarque`, `restApiAuthentification`.
- `src/pages/MotDePasseOublie.jsx` : demande de reset mot de passe. Utilise `MiseEnPageAuth`.
- `src/pages/FormulaireProfil.jsx` : formulaire onboarding profil (public).
- `src/pages/TableauDeBord.jsx` : dashboard admin/RH. Utilise `useTableauDeBord` + composants `TableauDeBord/*`.
- `src/pages/Recrutement.jsx` : pipeline recrutement. Utilise `ColonnePipeline`, `ModalCandidat`, `EntretienModal`, `restApiRecrutement`.
- `src/pages/Offres.jsx` : gestion offres entreprise. Utilise `useOffresEntreprise`, `TableauOffres`, `CarteStatistiqueOffre`, `ModalCreationOffre`.
- `src/pages/Entretiens.jsx` : gestion entretiens admin/RH. Utilise `useEntretiens`, `MiseEnPageEntretiens`, `CalendrierEntretiens`, `ModalCreationEntretien`, `ModalDetailsEntretien`.
- `src/pages/Utilisateurs.jsx` : gestion utilisateurs. Utilise `useUtilisateurs`, `TableauUtilisateurs`, `ModalCreationUtilisateur`.
- `src/pages/Parametres.jsx` : shell parametres. Utilise `MiseEnPageParametres`, `EntrepriseTab`, `IntegrationsTab`, `SecuriteTab`.

## Pages candidat src/pages/Candidat/

- `src/pages/Candidat/ConnexionCandidat.jsx` : connexion candidat. Utilise `ContexteAuthCandidat`, `LogoMarque`.
- `src/pages/Candidat/InscriptionCandidat.jsx` : inscription candidat. Utilise `ContexteAuthCandidat`, `LogoMarque`.
- `src/pages/Candidat/TableauDeBordCandidat.jsx` : dashboard candidat. Utilise `useOffresPubliques`, `restApiCandidature`, `CarteRecommandationOffre`, `CarteStatistique`.
- `src/pages/Candidat/MesCandidatures.jsx` : liste candidatures candidat. Utilise `CandidatureCard`, `ModalDetailsCandidature`, `restApiCandidature`, `useNotificationsToast`.
- `src/pages/Candidat/EntretiensCandidat.jsx` : vue simplifiee des entretiens candidat. Utilise `restApiCandidature`.
- `src/pages/Candidat/ListeOffresCandidat.jsx` : offres cote espace candidat. Utilise `useOffresPubliques`, `CarteOffre`.
- `src/pages/Candidat/ListeOffresPubliques.jsx` : offres publiques. Utilise `useOffresPubliques`, `CarteOffre`, `BarreNavigation`.
- `src/pages/Candidat/DetailOffrePublique.jsx` : details offre publique + postulation. Utilise `PostulerModal`, `restApiOffresEntreprise`, `resolveEntrepriseMediaUrl`.
- `src/pages/Candidat/DetailOffreCandidat.jsx` : wrapper detail offre en espace candidat (reutilise `DetailOffrePublique`).
- `src/pages/Candidat/ProfilCandidat.jsx` : edition profil candidat. Utilise `ContexteAuthCandidat`, `restApiCandidat`.

## Composants Candidat src/components/Candidat/

- `src/components/Candidat/CandidatureCard.jsx` : carte resume d'une candidature.
  Utilise par: `src/pages/Candidat/MesCandidatures.jsx`.
  Important: utilise `resolveEntrepriseMediaUrl` importe depuis `src/service/restApiEntreprise.js` pour convertir le logo entreprise en URL affichable.
- `src/components/Candidat/ModalDetailsCandidature.jsx` : modal de detail candidature. Utilise par `src/pages/Candidat/MesCandidatures.jsx`.
- `src/components/Candidat/CarteOffre.jsx` : carte offre (liste candidat/public). Utilise par `src/pages/Candidat/ListeOffresCandidat.jsx` et `src/pages/Candidat/ListeOffresPubliques.jsx`.
- `src/components/Candidat/CarteRecommandationOffre.jsx` : carte recommandation offre. Utilise par `src/pages/Candidat/TableauDeBordCandidat.jsx`.
- `src/components/Candidat/PanneauNotifications.jsx` : panneau notifications candidat. Utilise par `src/components/miseEnPage/MiseEnPageCandidat.jsx`.
- `src/components/Candidat/PostulerModal.jsx` : modal de candidature. Utilise par `src/pages/Candidat/DetailOffrePublique.jsx`.

## Composants communs src/components/commun/

- `src/components/commun/RouteProtegee.jsx` : garde d'acces admin/RH. Utilise par `src/App.jsx`.
- `src/components/commun/GardeAuthCandidat.jsx` : garde d'acces candidat. Utilise par `src/App.jsx`.
- `src/components/commun/LogoMarque.jsx` : logo de marque reutilisable. Utilise par pages auth et layouts.
- `src/components/commun/NotificationToast.jsx` : toast systeme. Utilise par pages/modules Offres, Entretiens, Candidatures, Parametres.
- `src/components/commun/FondModal.jsx` : backdrop modal generique. Utilise par modales Offres/Recrutement/Entretiens/Candidat.
- `src/components/commun/CarteSelection.jsx` : carte choix profil. Utilise par `src/pages/PageSelection.jsx`.

## Composants mise en page src/components/miseEnPage/

- `src/components/miseEnPage/MiseEnPagePublique.jsx` : layout public. Utilise par `src/App.jsx`.
- `src/components/miseEnPage/MiseEnPageAdmin.jsx` : layout admin/RH. Utilise par `src/App.jsx`.
- `src/components/miseEnPage/MiseEnPageCandidat.jsx` : layout candidat. Utilise par `src/App.jsx`.
- `src/components/miseEnPage/BarreLaterale.jsx` : sidebar admin/RH. Utilise par `MiseEnPageAdmin`.
- `src/components/miseEnPage/BarreNavigationAdmin.jsx` : navbar admin. Utilise par `MiseEnPageAdmin`.
- `src/components/miseEnPage/BarreNavigation.jsx` : navbar publique/candidat. Utilise par `PageAccueil`, `ListeOffresPubliques`, `DetailOffrePublique`.
- `src/components/miseEnPage/PiedDePage.jsx` : footer public. Utilise par `PageAccueil`.

## Composants Entretiens src/components/Entretiens/

- `src/components/Entretiens/MiseEnPageEntretiens.jsx` : header/toolbar module entretiens. Utilise par `src/pages/Entretiens.jsx`.
- `src/components/Entretiens/CalendrierEntretiens.jsx` : calendrier entretiens. Utilise par `src/pages/Entretiens.jsx`.
- `src/components/Entretiens/EntretiensEnLigneTab.jsx` : tab entretiens en ligne. Utilise par `src/pages/Entretiens.jsx`.
- `src/components/Entretiens/ModalCreationEntretien.jsx` : modal creation entretien. Utilise par `src/pages/Entretiens.jsx`.
- `src/components/Entretiens/ModalDetailsEntretien.jsx` : modal detail entretien. Utilise par `src/pages/Entretiens.jsx`.

## Composants Offres src/components/Offres/

- `src/components/Offres/TableauOffres.jsx` : tableau principal des offres. Utilise par `src/pages/Offres.jsx`.
- `src/components/Offres/LigneOffre.jsx` : ligne offre. Utilise par `TableauOffres`.
- `src/components/Offres/EnteteTableauOffres.jsx` : entete tableau offres. Utilise par `TableauOffres`.
- `src/components/Offres/PaginationTableauOffres.jsx` : pagination offres. Utilise par `TableauOffres`.
- `src/components/Offres/BadgeStatut.jsx` : badge statut offre. Utilise par `LigneOffre`.
- `src/components/Offres/CarteStatistiqueOffre.jsx` : KPI offres. Utilise par `src/pages/Offres.jsx`.
- `src/components/Offres/ModalCreationOffre.jsx` : creation offre. Utilise par `src/pages/Offres.jsx`.

## Composants Recrutement src/components/Recrutement/

- `src/components/Recrutement/ColonnePipeline.jsx` : colonne du pipeline. Utilise par `src/pages/Recrutement.jsx`.
- `src/components/Recrutement/CarteCandidat.jsx` : carte candidat pipeline. Utilise par `ColonnePipeline`.
- `src/components/Recrutement/ModalCandidat.jsx` : detail candidat recrutement. Utilise par `src/pages/Recrutement.jsx`.
- `src/components/Recrutement/EntretienModal.jsx` : modal action entretien depuis recrutement. Utilise par `src/pages/Recrutement.jsx`.

## Composants Parametres src/components/Parametres/

- `src/components/Parametres/MiseEnPageParametres.jsx` : shell tabs parametres. Utilise par `src/pages/Parametres.jsx`.
- `src/components/Parametres/ModalGestionUtilisateurs.jsx` : gestion utilisateurs/password depuis securite. Utilise par `src/components/Parametres/tabs/SecuriteTab.jsx`.
- `src/components/Parametres/tabs/EntrepriseTab.jsx` : infos entreprise/logo. Utilise par `src/pages/Parametres.jsx`.
- `src/components/Parametres/tabs/IntegrationsTab.jsx` : integration Google Calendar. Utilise par `src/pages/Parametres.jsx`.
- `src/components/Parametres/tabs/SecuriteTab.jsx` : securite mot de passe + modal utilisateurs. Utilise par `src/pages/Parametres.jsx`.
- `src/components/Parametres/tabs/ApparenceTab.jsx` : tab apparence (present mais non monte dans `Parametres.jsx`).
- `src/components/Parametres/tabs/NotificationsTab.jsx` : tab notifications (present mais non monte dans `Parametres.jsx`).

## Composants Tableau de bord src/components/TableauDeBord/

- `src/components/TableauDeBord/CarteStatistique.jsx` : carte KPI. Utilise par `src/pages/TableauDeBord.jsx` et `src/pages/Candidat/TableauDeBordCandidat.jsx`.
- `src/components/TableauDeBord/GraphiqueRecrutement.jsx` : graphe de recrutement. Utilise par `src/pages/TableauDeBord.jsx`.
- `src/components/TableauDeBord/ActiviteRecente.jsx` : activite recente. Utilise par `src/pages/TableauDeBord.jsx`.
- `src/components/TableauDeBord/ProchainsEntretiens.jsx` : prochains entretiens. Utilise par `src/pages/TableauDeBord.jsx`.

## Composants Utilisateurs src/components/Utilisateurs/

- `src/components/Utilisateurs/TableauUtilisateurs.jsx` : tableau utilisateurs. Utilise par `src/pages/Utilisateurs.jsx`.
- `src/components/Utilisateurs/LigneUtilisateur.jsx` : ligne utilisateur. Utilise par `TableauUtilisateurs`.
- `src/components/Utilisateurs/EnteteTableauUtilisateurs.jsx` : entete tableau utilisateurs. Utilise par `TableauUtilisateurs`.
- `src/components/Utilisateurs/ModalCreationUtilisateur.jsx` : creation utilisateur. Utilise par `src/pages/Utilisateurs.jsx`.

## Composants Sections marketing src/components/Sections/

- `src/components/Sections/BanniereHero.jsx` : hero landing page. Utilise par `src/pages/PageAccueil.jsx`.
- `src/components/Sections/SectionFonctionnalites.jsx` : section regroupant les cartes de fonctionnalites. Utilise par `src/pages/PageAccueil.jsx`.
- `src/components/Sections/CarteFonctionnalite.jsx` : carte de base reutilisee par les cartes ci-dessous.
- `src/components/Sections/CartePipelineKanban.jsx` : carte feature pipeline. Utilise par `SectionFonctionnalites`.
- `src/components/Sections/GestionCandidatsCard.jsx` : carte feature candidats. Utilise par `SectionFonctionnalites`.
- `src/components/Sections/PlanningEntretiensCard.jsx` : carte feature entretiens. Utilise par `SectionFonctionnalites`.
- `src/components/Sections/CarteAnalysesRapports.jsx` : carte feature analyses. Utilise par `SectionFonctionnalites`.
- `src/components/Sections/AutomatisationCard.jsx` : carte feature automatisation. Utilise par `SectionFonctionnalites`.
- `src/components/Sections/HeroAuthentification.jsx` : visuel lateral pages auth. Utilise par `src/pages/Connexion.jsx` et `src/pages/Inscription.jsx`.

## Hooks src/hooks/

- `src/hooks/useTableauDeBord.js` : logique dashboard admin/RH. Utilise par `src/pages/TableauDeBord.jsx`.
- `src/hooks/useEntretiens.js` : logique entretiens (calendar + pipeline). Utilise par `src/pages/Entretiens.jsx`.
- `src/hooks/useOffresEntreprise.js` : logique CRUD offres entreprise. Utilise par `src/pages/Offres.jsx`.
- `src/hooks/useOffresPubliques.js` : logique lecture offres publiques/candidat. Utilise par pages candidat d'offres.
- `src/hooks/useRecrutement.js` : logique recrutement (exporte `useRecruitment`; hook present mais non consomme directement actuellement).
- `src/hooks/useUtilisateurs.js` : logique gestion utilisateurs. Utilise par `src/pages/Utilisateurs.jsx`.
- `src/hooks/useNotificationsSysteme.js` : notifications candidat. Utilise par `PanneauNotifications` et `MiseEnPageCandidat`.
- `src/hooks/useNotificationsToast.js` : helper toast global. Utilise par pages et composants avec feedback utilisateur.

## Services API src/service/

- `src/service/restApiAuthentification.js` : login/logout/register/updatePassword. Utilise par `ContexteAuth`, `Inscription`, `SecuriteTab`, `ModalGestionUtilisateurs`.
- `src/service/restApiCandidat.js` : auth/profil candidat. Utilise par `ContexteAuthCandidat`, `ProfilCandidat`.
- `src/service/restApiCandidature.js` : candidatures candidat (`getMesCandidatures`, `postuler`, `annulerCandidature`). Utilise par pages candidat + `PostulerModal`.
- `src/service/restApiEntreprise.js` : entreprise + media URL resolver.
  Fonction cle: `resolveEntrepriseMediaUrl(mediaPath)`.
  Utilise par: `CandidatureCard`, `CarteOffre`, `BarreNavigationAdmin`, `DetailOffrePublique`.
- `src/service/restApiEntretiens.js` : endpoints entretiens + Google connect. Utilise par `useEntretiens`, `Entretiens`, `IntegrationsTab`.
- `src/service/restApiNotifications.js` : endpoints notifications candidat. Utilise par `useNotificationsSysteme`.
- `src/service/restApiOffresEntreprise.js` : endpoints offres entreprise. Utilise par `useOffresEntreprise`, `ModalCreationOffre`, `DetailOffrePublique`, `useOffresPubliques`.
- `src/service/restApiOffresPubliques.js` : lecture offres publiques + token candidat. Utilise par `useOffresPubliques`, `BarreNavigation`.
- `src/service/restApiRecrutement.js` : endpoints pipeline recrutement. Utilise par `useRecrutement`, `useEntretiens`, `Recrutement`, `Offres`.
- `src/service/restApiTableauDeBord.js` : endpoints stats dashboard admin. Utilise par `useTableauDeBord`.
- `src/service/restApiUtilisateurs.js` : endpoints utilisateurs. Utilise par `ContexteAuth`, `useUtilisateurs`, `TableauUtilisateurs`, `Entretiens`, `IntegrationsTab`, `ModalGestionUtilisateurs`.

## Dossiers sans fichiers actifs

- `src/components/auth/` : dossier present mais sans fichier.
- `src/components/ui/` : dossier present mais sans fichier.

## Exemple demande (trace explicite)

- `src/components/Candidat/CandidatureCard.jsx` : composant consomme depuis `src/pages/Candidat/MesCandidatures.jsx`.
- Dans ce composant, `resolveEntrepriseMediaUrl` est importe depuis `src/service/restApiEntreprise.js` pour construire l'URL finale du logo entreprise.
