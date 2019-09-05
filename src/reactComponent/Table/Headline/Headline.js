import React from "react";
import ClickListener from "./ClickListener.js";

export default function Headline({
  array,
  className,
  handleClickSort,
  handleClickFilter,
  handleClickFilterOrBox,
  box,
  filterBox,
  lists,
  filterSelectedList,
  sortSelectedList,
  deleteFilterButton,
  idItem,
  style
}) {
  let sortAndFiltertList = [...filterSelectedList, ...sortSelectedList];
  let arrayCopie = [...array];
  for (let i = 0; i < array.length; i++) {
    arrayCopie[i] = { ...array[i] };
  }
  arrayCopie.forEach(function(title) {
    let sortIconClass = setSortIconClass(title.back, sortSelectedList);

    if (title.filter === "sort") {
      title.filter = <i className={sortIconClass} />;
      title.func = handleClickSort;
    } else if (title.filter === "filter") {
      title.filter = <i className={"fas fa-caret-down"} />;
      title.box = box(
        title.back,
        lists,
        filterSelectedList,
        deleteFilterButton
      );
      title.func = handleClickFilter;
    }
    return title;
  });

  return (
    <ul className={className}>
      {arrayCopie.map(function(title, index) {
        let divClass = setDivClass(title.back, sortAndFiltertList);

        return (
          <li
            key={index}
            style={index === 0 ? style.line_li_first : style.line_li}
          >
            <div
              className={divClass}
              onClick={() => title.func(title.back)}
              id={`${idItem}_selector`}
            >
              {title.front}
              {title.filter}
            </div>
            {filterBox === title.back && (
              <ClickListener
                onClick={handleClickFilterOrBox}
                listenInside={false}
                idItem={idItem}
                className="filter-clickListener"
              >
                {title.box}
              </ClickListener>
            )}
          </li>
        );
      })}
    </ul>
  );
}

Headline.defaultProps = {
  array: [],
  className: "",
  style: {}
};

const setSortIconClass = function(title, sortSelectedList) {
  let className = "fas fa-caret-down";
  let sortSelectedListTitle = sortSelectedList.map(e => {
    return e.title;
  });
  let position = sortSelectedListTitle.indexOf(title);

  if (position !== -1) {
    if (sortSelectedList[position].order === "descending") {
      className = className + " sorted-up";
    } else if (sortSelectedList[position].order === "ascending") {
      className = className + " sorted-down";
    } else {
      className = className + " notSorted";
    }
  }

  return className;
};

const setDivClass = function(title, filterSortList) {
  let className = "";

  let filterSortListTitle = filterSortList.map(e => {
    return e.title;
  });
  let position = filterSortListTitle.indexOf(title);

  if (position !== -1) {
    className = "sorted";
  }
  return className;
};
