import React from "react";
import axios from "axios";

import box from "../../features/icons/check_24px.svg";
import checkedbox from "../../features/icons/check_24px copy.svg";

import "./index.css";
import ClientListTitles from "../../components/ClientList_Titles";
import ClientListTools from "../../components/ClientList_Tools";
import ClientListList from "../../components/ClientList_List/ClientList_List";

export default class ClientList extends React.Component {
  state = {
    clientList: null,
    searchFilter: "",
    popUpAdd: false,
    isLoading: true,
    /* ----- State for the chevrons filter ----- */
    titles: [
      "Note",
      "Entreprise",
      "Secteur",
      "Taille",
      "Comptes",
      "Recrutement"
    ],
    filterBoxShown: false,
    filterOrder: 0,
    filters: [],
    /* ----- State for sort lists ----- */
    sortOrder: null,
    sortList: [],
    deleteFilter: false
  };

  /* Search filter */
  handleChange = event => {
    this.setState({ searchFilter: event.target.value });
  };

  /* POP UP */
  togglePopup = () => {
    this.setState({
      popUpAdd: !this.state.popUpAdd
    });
  };

  /* ------ CHEVRONS FILTER METHODS ------ */

  handleClickFilter = async toto => {
    if (toto !== this.state.filterBoxShown) {
      await this.setState({ filterBoxShown: toto });
    } else {
      await this.setState({ filterBoxShown: null });
    }
  };

  /* ------ Function for list we want to sort ------ */
  handleClickSort = async title => {
    if (title === "Comptes") {
      title = "users";
    } else if (title === "Recrutement") {
      title = "recruits";
    } else if (title === "Note") {
      title = "rating";
    }
    let sortList = [...this.state.sortList];
    let position = sortList
      .map(e => {
        return e.title;
      })
      .indexOf(title);

    if (position === -1) {
      sortList.push({ title: title, order: "descending" });
    } else {
      if (sortList[position].order === "descending") {
        sortList[position].order = "ascending";
      } else if (sortList[position].order === "ascending") {
        sortList.splice(position, 1);
      }
    }
    await this.setState({ sortList: sortList });
  };

  /* ----- Box that appears/unappears when chevron clicked ----- */
  filterBox = (title, arrayOfList) => {
    if (title === "Entreprise") {
      title = "name";
    } else if (title === "Secteur") {
      title = "field";
    } else if (title === "Taille") {
      title = "size";
    }
    return (
      <div className="clientList-chevronBox">
        {this.filterItems(title, arrayOfList).map((item, index) => {
          if (item) {
            let clicked = false;
            let titlePosition = this.state.filters
              .map(e => {
                return e.title;
              })
              .indexOf(title);
            if (titlePosition !== -1) {
              let elementPosition = this.state.filters[
                titlePosition
              ].filter.indexOf(item);
              if (elementPosition !== -1) {
                clicked = true;
              }
            }
            return (
              <div key={index} className="clientList-chevronBox-element">
                <div
                  onClick={() => {
                    this.handleClickItem(title, item);
                  }}
                >
                  {clicked ? (
                    <img className="deleteCheck " src={box} alt="box cochée" />
                  ) : (
                    <img
                      className="deleteUncheck "
                      src={checkedbox}
                      alt="box non cochée"
                    />
                  )}
                </div>
                {item}
              </div>
            );
          } else return false;
        })}
      </div>
    );
  };

  /* ----- Array displayed in box ----- */
  filterItems = (title, arrayOfList) => {
    // items is an array of all the item for this title that are displayed
    let items = [];

    // We look for the position of the filter type
    let position = this.state.filters
      .map(e => {
        return e.title;
      })
      .indexOf(title);

    // listOfReference is the list on which the filter applies
    let listOfReference = [];
    if (position === -1) {
      listOfReference = arrayOfList[arrayOfList.length - 1];
    } else {
      listOfReference = arrayOfList[position];
    }
    let titleItems = listOfReference.map(e => {
      return e[title];
    });

    for (let i = 0; i < titleItems.length; i++) {
      if (typeof titleItems[i] !== "object") {
        if (items.indexOf(titleItems[i]) === -1) {
          items.push(titleItems[i]);
        }
      } else {
        if (items.indexOf(titleItems[i].name) === -1) {
          items.push(titleItems[i].name);
        }
      }
    }
    return items;
  };

  handleClickItem = async (title, item) => {
    let items = [...this.state.filters];

    let itemsTitle = items.map(e => {
      return e.title;
    });
    let titlePosition = itemsTitle.indexOf(title);

    if (titlePosition === -1) {
      items.push({
        title: title,
        filter: [item]
      });
      itemsTitle.push(title);
    } else {
      let itemPosition = items[titlePosition].filter.indexOf(item);
      if (itemPosition === -1) {
        items[titlePosition].filter.push(item);
      } else {
        items[titlePosition].filter.splice(itemPosition, 1);
        if (items[titlePosition].filter.length < 1) {
          items.splice(titlePosition, 1);
        }
      }
    }
    if (items.length > 0) {
      this.setState({ deleteFilter: true });
    } else {
      this.setState({ deleteFilter: false });
    }

    this.setState({ filters: items });
    return;
  };

  handleClickDeleteFilter = () => {
    let chevronFilter = [...this.state.filters];
    chevronFilter.splice(0, chevronFilter.length);
    this.setState({ filters: chevronFilter });
  };

  renderStars(item, index) {
    const stars = [];
    if (item.rating) {
      const rating = Math.round(2 * Number(item.rating));
      const bool = rating % 2;
      for (let i = 0; i < 10; i = i + 2) {
        // Cas rating = 6
        if (bool === 0 && (i % 2 === 0 || i === 0)) {
          // ON ne prend que les chiffres paires 0,2,4,6
          if (i < rating) {
            stars.push(
              <div className="blockStar">
                <i className="fas fa-star leftStar" />
                <i className="fas fa-star rightStar" />
              </div>
            );
          } else {
            stars.push(
              <div className="blockStar">
                <i className="far fa-star-half leftStar" />
                <i className="far fa-star-half rightStar" />
              </div>
            );
          }
        }
        // On prend les chiffres impaires 1,3,5,7,9
        if (bool === 1 && (i % 2 === 0 || i === 0)) {
          if (i < rating - 1) {
            stars.push(
              <div className="blockStar">
                <i className="fas fa-star leftStar" />
                <i className="fas fa-star rightStar" />
              </div>
            );
          } else if (i === rating - 1) {
            stars.push(
              <div className="blockStar">
                <i className="fas fa-star-half leftStar" />
                <i className="far fa-star-half rightStar" />
              </div>
            );
          } else {
            stars.push(
              <div className="blockStar">
                <i className="far fa-star-half leftStar" />
                <i className="far fa-star-half rightStar" />
              </div>
            );
          }
        }
      }
    }
    return <div className="client-list-renderStars">{stars}</div>;
  }

  render() {
    if (this.state.isLoading === true) {
      return <p>En cours de chargement ...</p>;
    }

    // ----------filtre-----------------

    /* copie des données pour filtre */
    let clientList = [...this.state.clientList];

    /* SEARCH FILTER ON SIZE, NAME and FIELD */
    clientList = clientList.filter(search => {
      return (
        search.size
          .toLowerCase()
          .indexOf(this.state.searchFilter.toLowerCase()) !== -1 ||
        search.name
          .toLowerCase()
          .indexOf(this.state.searchFilter.toLowerCase()) !== -1 ||
        search.field.name
          .toLowerCase()
          .indexOf(this.state.searchFilter.toLowerCase()) !== -1
      );
    });

    // *------ SORT LIST ------* //
    if (this.state.sortList.length > 0) {
      let sortList = this.state.sortList;
      for (let i = 0; i < sortList.length; i++) {
        let title = sortList[i].title;
        clientList = clientList.sort((a, b) => {
          if (title === "users" || title === "recruited") {
            if (sortList[i].order === "ascending") {
              return a[title].length - b[title].length;
            } else {
              return b[title].length - a[title].length;
            }
          } else {
            if (sortList[i].order === "ascending") {
              return a[title] - b[title];
            } else {
              return b[title] - a[title];
            }
          }
        });
      }
    }

    // *------ Filtre le clientList avec les filtres
    // On crée un tableau qui stock les différentes listes filtrées
    // A la base il a la première liste filtrée par le research
    const filteredClientLists = [clientList];

    //1. On applique les filtres, et on enregistre la nouvelle liste filtrée à chaque fois
    let filters = this.state.filters;

    if (filters) {
      for (let i = 0; i < filters.length; i++) {
        clientList = clientList.filter(element => {
          let bool = false;
          //cas field
          if (filters[i].title === "field") {
            for (let j = 0; j < filters[i].filter.length; j++) {
              if (element[filters[i].title].name === filters[i].filter[j]) {
                bool = true;
              }
            }
            return bool;
          } else {
            //cas normal
            for (let j = 0; j < filters[i].filter.length; j++) {
              if (element[filters[i].title] === filters[i].filter[j]) {
                bool = true;
              }
            }
            return bool;
          }
        });
        // On push la listefiltrée dans le tableau des listes filtrées
        filteredClientLists.push(clientList);
      }
    }
    return (
      <div className="content">
        <div className="titlePage">
          <p> Clients</p>
          <p className="number-of-clients"> Affichés : {clientList.length}</p>
        </div>
        <div className="frame">
          <ClientListTools
            searchFilter={this.state.searchFilter}
            deleteFilter={this.state.deleteFilter}
            handleChange={this.handleChange}
            togglePopup={this.togglePopup}
            handleClickDeleteFilter={this.handleClickDeleteFilter}
            popUpAdd={this.state.popUpAdd}
            token={this.props.token}
          />

          <div>
            <ClientListTitles
              arrayOfList={filteredClientLists}
              titles={this.state.titles}
              sortList={this.state.sortList}
              filters={this.state.filters}
              filterBoxShown={this.state.filterBoxShown}
              handleClickFilter={this.handleClickFilter}
              handleClickSort={this.handleClickSort}
              filterBox={this.filterBox}
            />
            <ClientListList
              clientList={clientList}
              renderStars={this.renderStars}
            />
          </div>
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("admin/client");
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    this.setState({
      clientList: response.data,
      isLoading: false
    });
  }
}
