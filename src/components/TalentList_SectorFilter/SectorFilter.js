import React from "react";
import "./index.css";
import deletecross from "../../features/icons/Group.svg";

export default function SectorFilter(props) {
  const {
    sectorInputValue,
    sectorSelected,
    sectorSuggestionsShown,
    onChangeSectorInput,
    onClickSector,
    sectorActiveSuggestion,
    onKeyDownSectorInput,
    sectorListFiltered,
    onDeleteAllSectorClick,
    onSingleSectorDeleteClick
  } = props;

  // Suggestions List is the list that appears when we fill the input
  let suggestionsList = null;

  if (sectorInputValue && sectorSuggestionsShown) {
    if (sectorListFiltered.length) {
      suggestionsList = (
        <div className="sectorList-suggestions">
          {sectorListFiltered.map((sector, index) => {
            let className;
            if (index === sectorActiveSuggestion) {
              className = "sectorList-suggestion sectorList-suggestion-active";
            } else {
              className = "sectorList-suggestion";
            }
            return (
              <div
                className={className}
                onClick={() => {
                  onClickSector(sector);
                }}
                key={sector.name}
              >
                {sector.name}
              </div>
            );
          })}
        </div>
      );
    } else {
      suggestionsList = (
        <div class="sectorList-no-suggestions">
          <em>Pas de secteur correspondant</em>
        </div>
      );
    }
  }

  return (
    <div className="sectorList-filterBlock">
      <div className="sectorList-filterTitle">Filtrer par secteur</div>
      <div className="sectorList">
        {sectorSelected.length > 0 &&
          sectorSelected.map((element, index) => {
            return (
              <div key={element.name} className="sectorList-sectorShown">
                {element.name}
                <div
                  className="sectorList-deleteSinglesector"
                  onClick={() => onSingleSectorDeleteClick(index)}
                >
                  x{" "}
                </div>
              </div>
            );
          })}

        <div className="sectorList-input-block">
          <input
            className="sectorInput"
            placeholder="Ecrivez votre sector ici"
            value={sectorInputValue}
            onChange={event => onChangeSectorInput(event.target.value)}
            onKeyDown={onKeyDownSectorInput}
          />
          {suggestionsList}
        </div>
      </div>
      <div>
        <div onClick={onDeleteAllSectorClick}>
          <img
            className="sectorList-deleteAllsector"
            src={deletecross}
            alt="delete all sector"
          />
        </div>
      </div>
    </div>
  );
}
