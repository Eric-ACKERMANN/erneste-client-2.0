import React from "react";
import "./index.css";

import ClientListPopUp from "../ClientList_PopUp";

export default function ClientList_Tools({
  searchFilter,
  handleChange,
  togglePopup,
  deleteFilter,
  handleClickDeleteFilter,
  popUpAdd,
  token
}) {
  return (
    <div className="boxSearchBarAndButton">
      {/* 1-Search bar */}
      <div className="all-searchbar">
        <div className="research">
          <div className="loupe">
            <i className="fas fa-search" />
          </div>
          <input
            type="search"
            name="searchFilter"
            placeholder="rechercher client, secteur, taille"
            className="searchbar"
            value={searchFilter}
            onChange={event => {
              handleChange(event);
            }}
          />
        </div>

        {/* 2-button */}
        <div onClick={togglePopup} className="all-button-add-client">
          <div>
            <i className="fas fa-plus" />
          </div>
          <button className="addClientButton">Ajouter un client</button>
        </div>

        {/* 3-Delete Filter */}
        <div className="deleteFilter">
          {deleteFilter ? (
            <div
              onClick={() => {
                handleClickDeleteFilter();
              }}
              className="clientList-deleteFilter"
            >
              Supprimer les filtres
            </div>
          ) : null}
        </div>
      </div>

      {/* 2-1 page ajout client */}
      <div className="addClientPage">
        {popUpAdd && (
          <ClientListPopUp
            className="popUpWindow"
            text="Close Me"
            closePopup={togglePopup}
            token={token}
          />
        )}
      </div>
    </div>
  );
}
