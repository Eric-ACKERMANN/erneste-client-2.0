import React from "react";
import "./index.css";

export default function DeleteButton({ handleClickDeleteButton }) {
  return (
    <div className="tool_deleteButton">
      <i className="far fa-trash-alt" />
      <button onClick={() => handleClickDeleteButton()}>
        Supprimer les profils séléctionnés
      </button>
    </div>
  );
}
