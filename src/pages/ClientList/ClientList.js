import React from "react";
import axios from "axios";

import Table from "../../reactComponent/Table";
import PopUp from "../../reactComponent/PopUp";

import { renderStars } from "../../functions/functions.js";

export default class ClientList extends React.Component {
  state = {
    id: "clientList",
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
    sectorList: null,
    popUp: false,
    isLoading: true,
    /******POP UP ******/
    companyName: "",
    sector: null,
    size: null,
    email: "",
    secteurId: "",

    error: false,
    valid: false,
    optionsSize: ["Petite", "Grande"]
  };

  /************ POP UP **********/
  togglePopUp = () => {
    if (this.state.popUp) {
      this.setState({ popUp: false });
      document.body.classList.remove("fixedScreen");
    } else {
      this.setState({ popUp: true });
      document.body.classList.add("fixedScreen");
    }
  };

  setCompanyName = e => this.setState({ companyName: e });

  setSector = e => this.setState({ sector: e });

  setSize = e => this.setState({ size: e });

  setEmail = e => this.setState({ email: e });

  handleSubmit = async event => {
    if (this.state.addNewSectorDiv && this.state.addNewSector !== "") {
      const response = await axios.post(
        "https://erneste-server-improved.herokuapp.com/sector/create",
        { name: this.state.addNewSector },
        {
          headers: {
            authorization: `Bearer ${this.props.token}`
          }
        }
      );

      await this.setState({
        secteurId:
          response.data[
            response.data
              .map(e => {
                return e.name;
              })
              .indexOf(this.state.addNewSector)
          ]._id
      });
    }
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/client/create",

      {
        name: this.state.entreprise,
        field: this.state.secteur._id,
        size: this.state.taille,
        email: this.state.email
      },
      {
        headers: {
          authorization: `Bearer ${this.props.token}`
        }
      }
    );
    this.props.closePopup();
    return this.setState({ valid: true });
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
    return (
      <div className="container">
        <div className="title">
          <p> Clients</p>
          <p> Affichés : {clientList.length}</p>
        </div>
        <Table
          idItem={`${this.state.id}_table`}
          tools={{
            search: true,
            searchPlaceholder: "Rechercher client, secteur, taille",
            button: [
              {
                condition: "fixed",
                type: "btn-primary",
                text: "Ajouter un client",
                logo: <i className="fas fa-plus" />,
                logoPosition: -1,
                onClick: this.togglePopUp
              },
              {
                condition: "filter",
                type: "btn-secondary",
                text: "Supprimer les filtres",
                logo: false,
                onClick: "clearFilter"
              }
            ]
          }}
          headlineArray={this.state.titles}
          headlineClass="line headline"
          lineArray={clientList}
          lineClass="line"
          sortList={this.sortList}
        />
        {this.state.popUp && (
          <div>
            <PopUp
              togglePopUp={this.togglePopUp}
              popUpId="popUpId"
              titleName="Ajouter un nouveau client"
              logoCancel={
                <i className="fas fa-times" onClick={this.togglePopUp} />
              }
              inputs={[
                {
                  title: "Entreprise",
                  searchable: true,
                  placeholder: "Nom de l'entreprise",
                  inputValue: this.state.companyName,
                  setValueInput: this.setCompanyName,
                  id: "popUp_companyName"
                },
                {
                  title: "Secteur",
                  searchable: false,
                  options: this.state.sectorList,
                  placeholder:
                    "Sélectionnez le secteur d'activité de l'entreprise",
                  inputValue: this.state.sector,
                  setValueInput: this.setSector,
                  id: "popUp_sector"
                },
                {
                  title: "Taille de l'Entreprise",
                  options: this.state.optionsSize,
                  searchable: false,
                  placeholder: "Sélectionnez la taille de l'entreprise",
                  inputValue: this.state.size,
                  setValueInput: this.setSize,
                  id: "popUp_size"
                },
                {
                  title: "Email",
                  searchable: true,
                  placeholder: "Email..",
                  inputValue: this.state.email,
                  setValueInput: this.setEmail,
                  id: "popUp_email"
                }
              ]}
              button={[
                {
                  type: "btn-cancel",
                  text: "Annuler",
                  logo: <i className="fas fa-plus" />,
                  onClick: this.togglePopUp
                },
                {
                  type: "btn-primary",
                  text: "Envoyer",
                  logo: false,
                  onClick: this.handleSubmit
                }
              ]}
            />
          </div>
        )}
      </div>
    );
  }
  async componentDidMount() {
    this.targetElement = document.querySelector("#popUpId");
    this.props.setPageActive("admin/client");
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector/",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    let sectorList = response2.data.map(e => {
      return e.name;
    });
    this.setState({
      clientList: response.data,
      sectorList: sectorList,
      isLoading: false
    });
  }
}
