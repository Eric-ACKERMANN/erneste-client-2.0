import React from "react";
import "./index.css";

export default function Search(props) {
  return (
    <div className="tools-search">
      <i className="fas fa-search" />
      <input
        value={props.searchInput}
        placeholder="Rechercher un profil"
        onChange={event => {
          props.searchType(event.target.value);
        }}
      />
      <i onClick={props.onClickClearSearch} className="fas fa-times" />
    </div>
  );
}
