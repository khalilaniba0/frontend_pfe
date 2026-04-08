# Rapport Frontend - Talentia ATS

Date: 2026-04-07
Perimetre: frontend React (CRA) du projet Talentia ATS

## 1. Vue d'ensemble

Le frontend Talentia ATS est organise autour de trois espaces fonctionnels:
- espace public (landing, authentification, offres publiques)
- espace admin/RH (dashboard, recrutement, offres, entretiens, utilisateurs, parametres)
- espace candidat (dashboard candidat, candidatures, offres, profil, notifications)

L'application repose sur un routage structure avec protection d'acces selon le role et le contexte utilisateur.

## 2. Technologies et stack

- React 19 avec react-dom
- Create React App via react-scripts 5
- React Router DOM v6
- Tailwind CSS (+ plugin @tailwindcss/forms)
- Axios pour les appels API
- Chart.js pour les graphiques du dashboard
- Font Awesome et Lucide React pour les icones
- web-vitals pour les metriques frontend

Fichiers de reference:
- package.json
- tailwind.config.js
- src/config/api.js
- jsconfig.json

## 3. Architecture applicative

### 3.1 Point d'entree

- src/index.js: monte BrowserRouter, AuthProvider, CandidateAuthProvider, puis App
- src/App.jsx: definit les routes publiques, admin et candidat

### 3.2 Routage et protection

- routes centralisees dans src/constants/routes.js
- garde admin/RH: src/components/commun/RouteProtegee.jsx
- garde candidat: src/components/commun/GardeAuthCandidat.jsx

### 3.3 Layouts

- public: src/components/miseEnPage/MiseEnPagePublique.jsx
- admin: src/components/miseEnPage/MiseEnPageAdmin.jsx
- candidat: src/components/miseEnPage/MiseEnPageCandidat.jsx
- auth: src/layouts/MiseEnPageAuth.jsx

### 3.4 Contextes d'authentification

- admin/RH: src/context/ContexteAuth.jsx
- candidat: src/context/ContexteAuthCandidat.jsx

Le projet utilise deux contextes separes pour les deux types de sessions (admin/RH et candidat).

## 4. Modules metier principaux

- Dashboard admin: src/pages/TableauDeBord.jsx
- Recrutement kanban: src/pages/Recrutement.jsx
- Gestion des offres: src/pages/Offres.jsx
- Gestion des entretiens: src/pages/Entretiens.jsx
- Gestion des utilisateurs: src/pages/Utilisateurs.jsx
- Parametres: src/pages/Parametres.jsx
- Dashboard candidat: src/pages/Candidat/TableauDeBordCandidat.jsx
- Mes candidatures: src/pages/Candidat/MesCandidatures.jsx
- Offres publiques et detail: src/pages/Candidat/ListeOffresPubliques.jsx, src/pages/Candidat/DetailOffrePublique.jsx
- Profil candidat: src/pages/Candidat/ProfilCandidat.jsx

## 5. Inventaire des formulaires

### 5.1 Formulaires d'authentification

1. Connexion entreprise/admin
- fichier: src/pages/Connexion.jsx
- champs: email, mot de passe
- service principal: loginUser (restApiAuthentification)

2. Inscription entreprise
- fichier: src/pages/Inscription.jsx
- champs: nom entreprise, email entreprise, nom admin, email admin, mot de passe admin, validation des conditions
- service principal: registerEntreprise

3. Mot de passe oublie
- fichier: src/pages/MotDePasseOublie.jsx
- champs: email

4. Connexion candidat
- fichier: src/pages/Candidat/ConnexionCandidat.jsx
- champs: email, mot de passe
- service principal: connecterCandidat

5. Inscription candidat
- fichier: src/pages/Candidat/InscriptionCandidat.jsx
- champs: nom, email, mot de passe
- service principal: inscrireCandidat

### 5.2 Formulaires profil et candidature

6. Formulaire profil public
- fichier: src/pages/FormulaireProfil.jsx
- champs: nom, prenom, email, telephone, upload CV, experiences

7. Profil candidat
- fichier: src/pages/Candidat/ProfilCandidat.jsx
- champs: nom, telephone, portfolio_url, upload CV
- service principal: mettreAJourProfil

8. Postuler a une offre
- composant: src/components/Candidat/PostulerModal.jsx
- champs: nom, email, telephone, lettre de motivation, CV
- service principal: postuler (multipart/form-data)

### 5.3 Formulaires metier admin/RH

9. Creation/edition d'offre
- page/composant: src/pages/Offres.jsx + src/components/Offres/ModalCreationOffre.jsx
- champs: poste, typeContrat, modeContrat, niveauExperience, langues, description, exigences
- services: createOffre, updateOffre, toggleOffreStatus, deleteOffre

10. Creation d'entretien
- composant: src/components/Entretiens/ModalCreationEntretien.jsx
- champs: candidatEmail, candidatNom, poste, date, heureDebut, type, lienVisio
- services: createEntretien

11. Gestion utilisateurs RH
- page/composant: src/pages/Utilisateurs.jsx + src/components/Utilisateurs/ModalCreationUtilisateur.jsx
- champs: firstName, lastName, email, password
- services: createRh, updateUser, deleteUser

12. Parametres
- page: src/pages/Parametres.jsx
- tabs montes: Entreprise, Integrations, Securite
- composants: src/components/Parametres/tabs/EntrepriseTab.jsx, src/components/Parametres/tabs/IntegrationsTab.jsx, src/components/Parametres/tabs/SecuriteTab.jsx

## 6. Couche data: hooks et services

### 6.1 Hooks

Les hooks centralisent la logique de chargement, mutation et gestion d'erreurs:
- src/hooks/useTableauDeBord.js
- src/hooks/useEntretiens.js
- src/hooks/useOffresEntreprise.js
- src/hooks/useOffresPubliques.js
- src/hooks/useRecrutement.js
- src/hooks/useUtilisateurs.js
- src/hooks/useNotificationsSysteme.js
- src/hooks/useNotificationsToast.js

### 6.2 Services API

Les services sont segmentes par domaine dans src/service:
- restApiAuthentification.js
- restApiCandidat.js
- restApiCandidature.js
- restApiEntreprise.js
- restApiEntretiens.js
- restApiNotifications.js
- restApiOffresEntreprise.js
- restApiOffresPubliques.js
- restApiRecrutement.js
- restApiTableauDeBord.js
- restApiUtilisateurs.js

Le pattern dominant est un acces API Axios avec authentification par cookies (withCredentials).

## 7. UX transversale

- notifications toast: src/components/commun/NotificationToast.jsx
- panneau notifications candidat: src/components/Candidat/PanneauNotifications.jsx
- fond de modal mutualise: src/components/commun/FondModal.jsx
- composant logo commun reutilise: src/components/commun/LogoMarque.jsx

## 8. Points de qualite et risques

1. Double contexte auth
- deux sessions distinctes a synchroniser (admin/RH vs candidat)
- risque de complexite sur transitions de session

2. Variabilite des payloads API
- certains flux doivent gerer plusieurs structures de reponse
- risque de duplication de logique de parsing

3. Validation formulaire
- validation surtout locale et heterogene selon les pages
- opportunite d'uniformiser les regles de validation

4. Gestion d'erreurs
- gestion principalement locale dans les hooks/pages
- opportunite de centraliser certaines erreurs globales

5. Notifications
- polling periodique cote candidat
- possible latence et cout API si volumetrie elevee

## 9. Recommandations

### Court terme
- normaliser le parsing des reponses API
- harmoniser les messages d'erreur utilisateur
- auditer les validations des formulaires critiques

### Moyen terme
- standardiser les comportements des modales (accessibilite et interactions)
- extraire des utilitaires communs pour les dates et formats
- renforcer les tests fonctionnels des parcours formulaires

### Long terme
- simplifier la coordination des flux d'authentification multi-profils
- envisager une strategie temps reel pour notifications (si besoin produit)

## 10. Conclusion

Le frontend est bien decoupe par domaines metier avec une architecture claire (routes, contexts, hooks, services).
Les evolutions recommandees concernent surtout l'homogeneite technique, la robustesse des formulaires, et la reduction de la dette de maintenance.
