import React from "react";

export default function ClientList_Titles({
  arrayOfList,
  titles,
  sortList,
  filters,
  filterBoxShown,
  handleClickFilter,
  handleClickSort,
  filterBox
}) {
  return (
    <ul className="clientArrayEntries">
      {titles.map((title, index) => {
        let sortClass = "";
        let filterClass = "";
        if (title === "Note") {
          let position = sortList
            .map(e => {
              return e.title;
            })
            .indexOf("rating");
          if (position !== -1) {
            if (sortList[position].order === "ascending") {
              sortClass = "clientList-titleSortedDown";
              filterClass = "clientList-titleFiltered";
            } else {
              sortClass = "clientList-titleSortedUp";
              filterClass = "clientList-titleFiltered";
            }
          }
          return (
            <li
              key={index}
              onClick={() => {
                handleClickSort(title);
              }}
            >
              <div className={filterClass}>
                {title}
                <i className={"fas fa-caret-down " + sortClass} />
              </div>
            </li>
          );
        } else if (
          title === "Entreprise" ||
          title === "Secteur" ||
          title === "Taille"
        ) {
          let temp = "name";
          if (title === "Secteur") {
            temp = "field";
          }
          if (title === "Taille") {
            temp = "size";
          }

          let position = filters
            .map(e => {
              return e.title;
            })
            .indexOf(temp);

          if (position !== -1) {
            sortClass = "clientList-titleSorted";
            filterClass = "clientList-titleFiltered";
          }

          return (
            <li key={index}>
              <div
                onClick={() => {
                  handleClickFilter(title);
                }}
                className={filterClass}
              >
                {title}
                <i className={"fas fa-caret-down " + filterClass} />
              </div>
              {filterBoxShown === title && filterBox(title, arrayOfList)}
            </li>
          );
        } else if (title === "Comptes" || title === "Recrutement") {
          let temp = "recruits";
          if (title === "Comptes") {
            temp = "users";
          }
          let position = sortList
            .map(e => {
              return e.title;
            })
            .indexOf(temp);
          if (position !== -1) {
            if (sortList[position].order === "ascending") {
              sortClass = "clientList-titleSortedUp";
              filterClass = "clientList-titleFiltered";
            } else {
              sortClass = "clientList-titleSortedDown";
              filterClass = "clientList-titleFiltered";
            }
          }

          return (
            <li key={index}>
              <div
                onClick={() => {
                  handleClickSort(title);
                }}
                className={filterClass}
              >
                {title}
                <i className={"fas fa-caret-down " + sortClass} />
              </div>
            </li>
          );
        } else return false;
      })}
    </ul>
  );
}
