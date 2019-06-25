import React from "react";
import Search from "../TalentList_Search";
import AddTalent from "../TalentList_AddTalent";
import DeleteButton from "../TalentList_DeleteButton";

import "./index.css";

export default function Tools(props) {
  const { handleClickDeleteButton } = props;
  return (
    <div className="talentList-right-block-researchLine">
      <Search
        searchInput={props.searchInput}
        searchType={event => {
          props.searchType(event);
        }}
        onClickClearSearch={props.onClickClearSearch}
      />
      <AddTalent />

      {/* Button that appears when a talent is clicked to be deleted*/}
      {props.delete === true && (
        <DeleteButton handleClickDeleteButton={handleClickDeleteButton} />
      )}

      {/* Button that appears when a chevron is selected as filter */}
      {props.chevronFilter.length > 0 && (
        <div
          className="tools-deleteFilter"
          onClick={props.onDeleteChevronFilterClick}
        >
          Supprimer les filtres
        </div>
      )}
    </div>
  );
}
