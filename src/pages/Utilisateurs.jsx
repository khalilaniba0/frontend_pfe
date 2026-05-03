// Lignes : 103 | Couche : page | Depend de : useUsers, UserTable, CreateUserModal
import React, { useState } from "react";
import UserTable from "components/Utilisateurs/TableauUtilisateurs";
import CreateUserModal from "components/Utilisateurs/ModalCreationUtilisateur";
import { useUsers } from "hooks/useUtilisateurs";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);
  const {
    users,
    loading,
    error,
    createUser,
  } = useUsers();

  const handleCreateUser = async function (payload) {
    const result = await createUser(payload);
    var userName =
      result?.data?.data?.nom ||
      result?.data?.nom ||
      payload?.nom ||
      "L'utilisateur";
    setLastCreated(userName);
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(function () {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <>
      <div className="animate-fade-in">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display font-semibold" style={{ fontSize: '34px', lineHeight: 1.47, letterSpacing: '-0.374px', color: 'var(--color-ink)' }}>
              Gestion des utilisateurs
            </h1>
          </div>
          <button
            type="button"
            onClick={function () {
              setShowModal(true);
            }}
            className="button-primary"
          >
            <span className="material-symbols-outlined text-base">
              person_add
            </span>
            Créer un compte RH
          </button>
        </header>

        {showSuccess && (
          <div className="mb-5 flex animate-slide-up items-center gap-3 rounded-[var(--rounded-sm)] px-4 py-3" style={{ backgroundColor: '#e8f4e8', border: '1px solid #c2e0c2' }}>
            <span className="material-symbols-outlined flex-shrink-0 text-xl" style={{ color: '#1d6b1d' }}>
              check_circle
            </span>
            <div className="flex-1">
              <p className="font-text text-[14px] font-semibold" style={{ color: '#1d6b1d' }}>
                Compte créé avec succès
              </p>
              <p className="font-text text-[12px]" style={{ color: '#1d6b1d' }}>
                {lastCreated} peut maintenant se connecter à la plateforme.
              </p>
            </div>
            <button
              type="button"
              onClick={function () {
                setShowSuccess(false);
              }}
              className="button-icon-circular"
              style={{ width: '32px', height: '32px', background: 'transparent' }}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        <UserTable
          usersData={users}
          externalLoading={loading}
          externalError={error}
        />
      </div>

      {showModal && (
        <CreateUserModal
          onClose={function () {
            setShowModal(false);
          }}
          onSubmit={handleCreateUser}
        />
      )}
    </>
  );
}
