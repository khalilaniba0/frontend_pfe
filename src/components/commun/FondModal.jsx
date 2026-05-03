import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

/**
 * Composant backdrop standardisé pour tous les modals de l'application.
 * Applique un fond flouté uniforme et gère la fermeture au clic extérieur.
 * Utilise createPortal pour un rendu dans document.body.
 *
 * Mobile : modal plein écran centré avec scroll interne.
 * Desktop : modal centré avec margin auto, max-width défini par l'enfant.
 */
export default function ModalBackdrop({ children, onClose = function () {} }) {
  return ReactDOM.createPortal(
    <div
      onClick={function (e) {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {children}
    </div>,
    document.body
  );
}

ModalBackdrop.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};
