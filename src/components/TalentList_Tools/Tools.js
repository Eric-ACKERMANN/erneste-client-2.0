import React from "react";
import Search from "../TalentList_Search";
import Button from "../../reactComponent/Button";
import { Link } from "react-router-dom";

import "./index.css";

export default function Tools({
  searchInput,
  searchType,
  handleClickDeleteButton,
  onClickClearSearch,
  deleteFilter,
  chevronFilter,
  onDeleteChevronFilterClick
}) {
  return (
    <div className="talentList-tools">
      <Search
        searchInput={searchInput}
        searchType={event => {
          searchType(event);
        }}
        onClickClearSearch={onClickClearSearch}
      />
      {/* This button links to the create talent page */}
      <Link to={`/admin/talent-create`}>
        <Button
          className="btn-primary"
          logoPosition={-1}
          logo={<i className="fas fa-plus" />}
        >
          Ajouter un talent
        </Button>
      </Link>
      {/* This button appears when a chevron is selected as filter */}
      <Button
        className={
          chevronFilter.length > 0
            ? "btn-secondary visible"
            : "btn-secondary invisible"
        }
        onClick={onDeleteChevronFilterClick}
      >
        Supprimer les filtres
      </Button>
      {/* This button appears when a talent is clicked to be deleted*/}
      <Button
        className={deleteFilter ? "btn-cancel visible" : "btn-cancel invisible"}
        logoPosition={-1}
        logo={<i className="fa fa-trash-alt" />}
        onClick={handleClickDeleteButton}
      >
        Supprimer les profils selectionnés
      </Button>
    </div>
  );
}
