import React from "react";
import Line from "./Line";
import Headline from "./Headline";
import Tools from "../Tool";

import selectedBox from "../../features/icons/check_24px.svg";
import { searchFilter } from "../../functions/functions.js";

export default class Table extends React.Component {
  state = {
    sortSelectedList: [],
    filterBox: false,
    filters: [],
    lists: [],
    deleteFilterButton: false,
    searchInput: "",
    deleteInLineArray: [],
    ShowDeleteButton: this.props.deleteInLine.exist ? false : null
  };

  /********** Delete in line Button  *********/

  handleClickDeleteInLine = id => {
    let deleteInLineArray = this.state.deleteInLineArray;

    if (deleteInLineArray.indexOf(id) === -1) {
      deleteInLineArray.push(id);
    } else {
      deleteInLineArray.splice(deleteInLineArray.indexOf(id), 1);
    }
    if (deleteInLineArray.length > 0) {
      this.setState({
        deleteInLineArray: deleteInLineArray,
        ShowDeleteButton: true
      });
    } else {
      this.setState({
        deleteInLineArray: deleteInLineArray,
        ShowDeleteButton: false
      });
    }
  };

  /******** SEARCH FILTER *********/
  setSearchInput = event => {
    this.setState({ searchInput: event });
  };

  handleClickClearSearch = () => {
    this.setState({ searchInput: "" });
  };

  /**** Delete Filter Button condition *****/
  deleteFilterButton = filters => {
    if (filters.length > 0) {
      this.setState({ deleteFilterButton: true });
    } else {
      this.setState({ deleteFilterButton: false });
    }
  };

  handleClickDeleteFilter = () => {
    this.setState({ filters: [] });
  };

  /****** Memorize list ******/
  memorizeList = (list, filters) => {
    const arrayOfMemorizedList = [list];

    if (filters) {
      for (let i = 0; i < filters.length; i++) {
        list = list.filter(element => {
          let bool = false;
          for (let j = 0; j < filters[i].item.length; j++) {
            if (element[filters[i].title] === filters[i].item[j]) {
              bool = true;
            }
          }
          return bool;
        });
        arrayOfMemorizedList.push(list);
      }
    }
    return arrayOfMemorizedList;
  };

  handleClickItem = async (title, item, filters, deleteFilterButton) => {
    let itemsTitle = filters.map(e => {
      return e.title;
    });
    let titlePosition = itemsTitle.indexOf(title);

    if (titlePosition === -1) {
      filters.push({
        title: title,
        item: [item]
      });
      itemsTitle.push(title);
    } else {
      let itemPosition = filters[titlePosition].item.indexOf(item);
      if (itemPosition === -1) {
        filters[titlePosition].item.push(item);
      } else {
        filters[titlePosition].item.splice(itemPosition, 1);
        if (filters[titlePosition].item.length < 1) {
          filters.splice(titlePosition, 1);
        }
      }
    }
    if (filters.length > 0) {
      this.setState({ deleteFilter: true });
    } else {
      this.setState({ deleteFilter: false });
    }

    this.setState({ filters: filters });
    this.deleteFilterButton(filters);
    return;
  };

  handleClickSort = async title => {
    let sortSelectedList = [...this.state.sortSelectedList];
    let position = sortSelectedList
      .map(e => {
        return e.title;
      })
      .indexOf(title);

    if (position === -1) {
      sortSelectedList.push({ title: title, order: "descending" });
    } else {
      if (sortSelectedList[position].order === "descending") {
        sortSelectedList[position].order = "ascending";
      } else if (sortSelectedList[position].order === "ascending") {
        sortSelectedList.splice(position, 1);
      }
    }
    await this.setState({ sortSelectedList: sortSelectedList });
  };

  handleClickFilter = async toto => {
    if (toto !== this.state.filterBox) {
      await this.setState({ filterBox: toto });
    } else {
      await this.setState({ filterBox: null });
    }
  };

  handleClickFilterOrBox = () => {
    this.setState({ filterBox: !this.state.filterBox });
  };

  filterItems = (title, lists, filters) => {
    // items is an array of all the item for this title that are displayed
    let itemsDisplayed = [];

    let filtersTitle = filters.map(e => {
      return e.title;
    });
    // We look for the position of the filter type
    let position = filtersTitle.indexOf(title);

    // listOfReference is the list on which the filter applies
    let listOfReference = [];
    if (position === -1) {
      listOfReference = lists[lists.length - 1];
    } else {
      listOfReference = lists[position];
    }

    let items = listOfReference.map(e => {
      return e[title];
    });

    for (let i = 0; i < items.length; i++) {
      if (typeof items[i] !== "object") {
        if (itemsDisplayed.indexOf(items[i]) === -1) {
          itemsDisplayed.push(items[i]);
        }
      } else {
        if (itemsDisplayed.indexOf(items[i].name) === -1) {
          itemsDisplayed.push(items[i].name);
        }
      }
    }
    return itemsDisplayed;
  };

  filterBox = (title, lists, filters, deleteFilterButton) => {
    let items = this.filterItems(title, lists, filters);
    let filtersTitle = filters.map(e => {
      return e.title;
    });
    return (
      <div className="filter-box" style={this.props.style.box}>
        {items.map((item, index) => {
          let clicked = false;
          let titlePos = filtersTitle.indexOf(title);
          if (titlePos !== -1) {
            let elementPos = filters[titlePos].item.indexOf(item);
            if (elementPos !== -1) clicked = true;
          }
          return (
            <div
              key={index}
              className="filter-item"
              onClick={() => {
                this.handleClickItem(title, item, filters, deleteFilterButton);
              }}
            >
              {item}
              {clicked ? (
                <img
                  className={"selectItem itemSelected"}
                  src={selectedBox}
                  alt={"box cochée"}
                  id={`${this.props.idItem}_headline_img`}
                />
              ) : (
                <div
                  className="selectItem"
                  id={`${this.props.idItem}_headline_img`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    let {
      headlineArray,
      lineArray,
      headlineClass,
      lineClass,
      sortList,
      deleteFilterButton,
      tools,
      idItem,
      deleteInLine,
      style
    } = this.props;
    /*********** SEARCH FILTER ************/
    let headlineSearchParameter = headlineArray
      .filter(function(e) {
        return e.search;
      })
      .map(e => {
        return e.back;
      });

    if (this.state.searchInput) {
      lineArray = searchFilter(
        lineArray,
        this.state.searchInput,
        headlineSearchParameter
      );
    }
    if (lineArray.length > 0) {
      lineArray = sortList(lineArray, this.state.sortSelectedList);
    }

    const lists = this.memorizeList(lineArray, this.state.filters);

    // HEADLINE
    let headlineArrayFront = headlineArray.map(function(e) {
      return (e = { front: e.front, filter: e.filter, back: e.back });
    });

    // ALL OTHER LINE
    let headlineArrayBack = headlineArray.map(function(e) {
      return (e = { back: e.back, link: e.link });
    });

    // TRANSFORM PROP TOOLS
    let toolsCopie = { ...tools };
    // On injecte les fonctions search dedans
    if (toolsCopie.search) {
      toolsCopie.search = {
        search: true,
        input: this.state.searchInput,
        setInput: this.setSearchInput,
        clearInput: this.clearInput,
        placeholder: tools.searchPlaceholder
      };
    }

    if (tools.button.length > 0) {
      for (let i = 0; i < tools.button.length; i++) {
        toolsCopie.button[i] = tools.button[i];
        if (toolsCopie.button[i].condition === "filter") {
          toolsCopie.button[i].condition = this.state.filters;
        }
        if (toolsCopie.button[i].condition === "deleteInLine") {
          toolsCopie.button[i].condition = this.state.deleteInLineArray;
        }
        if (toolsCopie.button[i].onClick === "clearFilter") {
          toolsCopie.button[i].onClick = this.handleClickDeleteFilter;
        }
      }
    }
    let self = this;
    return (
      <div className="table">
        <Tools
          search={toolsCopie.search}
          button={toolsCopie.button}
          style={style}
        />
        <Headline
          idItem={`${idItem}_headline`}
          array={headlineArrayFront}
          className={headlineClass}
          handleClickSort={this.handleClickSort}
          handleClickFilter={this.handleClickFilter}
          handleClickFilterOrBox={this.handleClickFilterOrBox}
          box={this.filterBox}
          filterBox={this.state.filterBox}
          lists={lists}
          filterSelectedList={this.state.filters}
          sortSelectedList={this.state.sortSelectedList}
          deleteFilterButton={deleteFilterButton}
          style={style}
        />
        {lists[lists.length - 1].map(function(element, index) {
          return (
            <Line
              key={index}
              array={element}
              className={lineClass}
              headlineArray={headlineArrayBack}
              deleteInLine={deleteInLine}
              style={style}
            />
          );
        })}
      </div>
    );
  }
}

Table.defaultProps = {
  headLineArray: [],
  lineArray: [],
  headLineClass: "",
  lineClass: "",
  sortList: function(array, string) {
    return array;
  },
  deleteInLine: {
    exist: false,
    position: null,
    func: () => {
      return null;
    }
  },
  style: {}
};
