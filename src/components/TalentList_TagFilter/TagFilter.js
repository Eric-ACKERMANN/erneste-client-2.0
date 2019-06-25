import React from "react";
import "./index.css";
import deletecross from "../../features/icons/Group.svg";

export default function tag(props) {
  const {
    tagInputValue,
    tagSelected,
    tagSuggestionsShown,
    onChangeTagInput,
    onClickTag,
    tagActiveSuggestion,
    onKeyDownTagInput,
    tagListFiltered,
    onDeleteAllTagClick,
    onSingleTagDeleteClick
  } = props;

  // Suggestions List is the list that appears when we fill the input
  let suggestionsList = null;

  if (tagInputValue && tagSuggestionsShown) {
    if (tagListFiltered.length) {
      suggestionsList = (
        <div className="tagList-suggestions">
          {tagListFiltered.map((tag, index) => {
            let className;
            if (index === tagActiveSuggestion) {
              className = "tagList-suggestion-active";
            }
            return (
              <div
                className={className}
                onClick={() => {
                  onClickTag(tag);
                }}
                key={tag.name}
              >
                {tag.name}
              </div>
            );
          })}
        </div>
      );
    } else {
      suggestionsList = (
        <div class="tagList-no-suggestions">
          <em>Pas de tag correspondant</em>
        </div>
      );
    }
  }

  return (
    <div className="tagList-filterBlock">
      <div className="tagList-filterTitle">Filtres</div>
      <div className="tagList">
        {tagSelected.length > 0 &&
          tagSelected.map((element, index) => {
            return (
              <div
                key={element.name}
                className={
                  element.type === "hard"
                    ? "tagList-tagShown hardSkill"
                    : "tagList-tagShown softSkill"
                }
              >
                {element.name}
                <div
                  className="tagList-deleteSingleTag"
                  onClick={() => onSingleTagDeleteClick(index)}
                >
                  x{" "}
                </div>
              </div>
            );
          })}

        <div className="tagList-input-block">
          <input
            className="tagInput"
            placeholder="Ecrivez votre tag ici"
            value={tagInputValue}
            onChange={event => onChangeTagInput(event.target.value)}
            onKeyDown={onKeyDownTagInput}
          />
          {suggestionsList}
        </div>
      </div>
      <div>
        <div onClick={onDeleteAllTagClick}>
          <img
            className="tagList-deleteAllTag"
            src={deletecross}
            alt="delete all tag"
          />
        </div>
      </div>
    </div>
  );
}
