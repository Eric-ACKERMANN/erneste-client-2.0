import React from "react";
import axios from "axios";

import "./index.css";
import ClientListTools from "../../components/ClientList_Tools";
import Table from "../../reactComponent/Table";

import { renderStars, searchFilter } from "../../functions/functions.js";

export default class ClientList extends React.Component {
  state = {
    titles: [
      { front: "Note", back: "rating", filter: null, search: false },
      {
        front: "Entreprise",
        back: "name",
        link: `/admin/client/`,
        filter: "filter",
        search: true
      },
      { front: "Secteur", back: "field", filter: "filter", search: true },
      { front: "Taille", back: "size", filter: "filter", search: true },
      { front: "Comptes", back: "users", filter: "sort", search: false },
      { front: "Recrutement", back: "recruited", filter: "sort", search: false }
    ],
    clientList: null,
    popUp: false,
    isLoading: true
  };

  /******** SEARCH FILTER *********/
  setSearchInput = event => {
    this.setState({ searchInput: event });
  };

  handleClickClearSearch = () => {
    this.setState({ searchInput: "" });
  };

  /************ POP UP **********/
  togglePopup = () => {
    this.setState({
      popUp: !this.state.popUp
    });
  };

  /******** SORT FILTER *********/
  sortList = (clientList, sortSelectedList) => {
    for (let i = 0; i < sortSelectedList.length; i++) {
      let title = sortSelectedList[i].title;
      clientList = clientList.sort((a, b) => {
        if (sortSelectedList[i].order === "ascending") {
          return a[title] - b[title];
        } else {
          return b[title] - a[title];
        }
      });
    }
    return clientList;
  };

  render() {
    if (this.state.isLoading === true) {
      return <p>En cours de chargement ...</p>;
    }

    let clientList = [...this.state.clientList];
    for (let i = 0; i < this.state.clientList.length; i++) {
      clientList[i] = { ...this.state.clientList[i] };
    }

    // On tranforme le tableau de clients suivant les cas particuliers avant de le donner au composant Table
    const headLineArrayBack = this.state.titles.map(function(e) {
      return e.back;
    });

    clientList.forEach(function(client) {
      headLineArrayBack.forEach(function(title) {
        if (title === "rating") {
          client[title] = renderStars(client[title]);
        } else if (title === "field") {
          if (client[title].isArray) {
            client[title] = client[title].map(function(e) {
              return e.name;
            });
          } else if (client[title].name) {
            client[title] = client[title].name;
          }
        } else if (
          (title === "users" && client[title]) ||
          (title === "recruited" && client[title])
        ) {
          client[title] = client[title].length;
        }
      });
    });

    /*********** SEARCH FILTER ON SIZE, NAME and FIELD ************/
    let headlineSearchParameter = this.state.titles
      .filter(function(e) {
        return e.search;
      })
      .map(e => {
        return e.back;
      });

    if (this.state.searchInput) {
      clientList = searchFilter(
        clientList,
        this.state.searchInput,
        headlineSearchParameter
      );
    }

    return (
      <div className="content">
        <div className="title">
          <p> Clients</p>
          <p> Affichés : {clientList.length}</p>
        </div>
        <div className="frame">
          <ClientListTools
            searchInput={this.state.searchInput}
            setSearchInput={this.setSearchInput}
            clearSearchInput={this.handleClickClearSearch}
            deleteFilter={this.state.deleteFilterButton}
            togglePopup={this.togglePopup}
            handleClickDeleteFilter={this.handleClickDeleteFilter}
            popUp={this.state.popUp}
            token={this.props.token}
          />
          <Table
            tools={{
              search: true,
              searchFactor: this.state.titles,
              button: [
                {
                  condition: "fixed",
                  type: "btn-primary",
                  text: "Ajouter un client",
                  logo: <i className="fas fa-plus" />,
                  logoPosition: -1
                },
                {
                  condition: "filter",
                  type: "btn-secondary",
                  text: "Supprimer les filtres",
                  logo: false
                }
              ]
            }}
            headlineArray={this.state.titles}
            headlineClass="clientArrayEntries"
            lineArray={clientList}
            lineClass="clientListItem"
            sortList={this.sortList}
            deleteFilterButton={this.deleteFilterButton}
          />
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
