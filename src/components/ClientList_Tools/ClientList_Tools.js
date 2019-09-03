import React from "react";

import ClientListPopUp from "../ClientList_PopUp";
import Search from "../../reactComponent/Search";
import Button from "../../reactComponent/Button";

export default function ClientList_Tools({
  searchInput,
  setSearchInput,
  togglePopup,
  deleteFilter,
  handleClickDeleteFilter,
  popUp,
  token,
  clearSearchInput
}) {
  return (
    <div className="boxSearchBarAndButton">
      <div className="all-searchbar">
        <Search
          input={searchInput}
          setInput={setSearchInput}
          clearInput={clearSearchInput}
          placeholder="rechercher client, secteur, taille"
        />
        <Button
          className="btn-primary"
          logoPosition={-1}
          logo={<i className="fas fa-plus" />}
          onClick={togglePopup}
        >
          Ajouter un client
        </Button>

        {deleteFilter && (
          <Button
            className={
              deleteFilter ? "btn-secondary visible" : "btn-secondary invisible"
            }
            onClick={handleClickDeleteFilter}
          >
            Supprimer les filtres
          </Button>
        )}
      </div>

      {/* 2-1 page ajout client */}
      <div className="addClientPage">
        {popUp && (
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
