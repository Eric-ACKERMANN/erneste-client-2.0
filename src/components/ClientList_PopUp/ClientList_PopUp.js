import React from "react";
import axios from "axios";

import "./index.css";

export default class ClientListPopUp extends React.Component {
  state = {
    entreprise: "",
    secteur: null,
    secteurId: "",
    taille: null,
    email: "",
    sectorList: [],
    sectorSelect: false,
    sizeSelect: false,
    addNewSector: "",
    addNewSectorDiv: false,

    error: false,
    valid: false,
    isLoading: false
  };
  // fonction pour changer les states des inputs
  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const statesToUpdate = {};
    statesToUpdate[name] = value;
    this.setState(statesToUpdate);
  };

  // fonction apparation gestion select secteur
  sectorSelect = () => {
    this.setState({ sectorSelect: !this.state.sectorSelect });
  };
  // fonction apparation gestion select Taille
  sizeSelect = () => {
    this.setState({ sizeSelect: !this.state.sizeSelect });
  };

  // fonction pour gérer secteur
  setSector = event => {
    let secteur;
    for (let i = 0; i < this.state.sectorList.length; i++) {
      if (event.target.id === this.state.sectorList[i]._id) {
        secteur = this.state.sectorList[i];
        break;
      }
    }
    this.setState({
      secteur,
      sectorSelect: false
    });
  };

  /* Function to handle company size */

  handleSize = e => {
    const id = e.target.id;
    this.setState({ taille: id, sizeSelect: false });
  };

  // fonction pour valider le formulaire en envoyant les params en requette post
  // et un message (d'erreur ou validé) à la soumission du formulaire
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

  ShowNewSector = x => {
    this.setState({
      addNewSectorDiv: !this.state.addNewSectorDiv
    });
  };

  render() {
    if (this.state.isLoading === true) {
      return false;
    }

    const sectorArray = this.state.sectorList.map((item, index) => {
      return (
        <div
          id={item._id}
          key={item._id}
          onClick={this.setSector}
          className="clientlist-popup-sector-item"
        >
          {item.name}
        </div>
      );
    });

    return (
      <div className="clientlist-popup-container">
        <div className="clientlist-popup-header">
          <div className="clientlist-popup-title">
            Ajouter un nouveau client
          </div>
          <div
            className="clientlist-popup-close"
            onClick={this.props.closePopup}
          >
            <i className="fas fa-times" />
          </div>
        </div>
        <div className="clientlist-popup-input-container">
          <div>Entreprise</div>
          <input
            value={this.state.entreprise}
            onChange={this.handleChange}
            placeholder="Entreprise"
            type="text"
            name="entreprise"
            id="name"
            required
          />
          <div>
            <div>Secteur</div>
            <div
              className="clientlist-popup-sector"
              onClick={this.sectorSelect}
            >
              {this.state.secteur
                ? this.state.secteur.name
                : "Sélectionnez un secteur"}
            </div>
            {this.state.sectorSelect && (
              <div className="clientlist-popup-sector-list">{sectorArray}</div>
            )}
          </div>
          <div>Taille de l'entreprise</div>
          <div className="clientlist-popup-sector" onClick={this.sizeSelect}>
            {this.state.taille ? this.state.taille : "Sélectionnez une taille"}
          </div>
          {this.state.sizeSelect && (
            <div className="clientlist-popup-size-list">
              <div
                className="clientlist-popup-size-item"
                id="Petite"
                onClick={this.handleSize}
              >
                Petite
              </div>
              <div
                className="clientlist-popup-size-item"
                id="Grande"
                onClick={this.handleSize}
              >
                Grande
              </div>
            </div>
          )}
          <div>Email</div>
          <input
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Email"
            type="text"
            name="email"
            id="name"
            required
          />
        </div>
        <div className="clientlist-popup-buttons">
          <div
            onClick={this.props.closePopup}
            className="clientlist-popup-cancel"
          >
            Annuler
          </div>
          <div
            onClick={this.handleSubmit}
            className="clientlist-popup-validate"
          >
            Ajouter
          </div>
        </div>

        {/* affichage de l'état de la validation du formulaire */}
        <div>
          {this.state.error === true ? <p>error</p> : this.state.error}
          {this.state.valid === true ? <p>validate</p> : this.state.valid}
        </div>
      </div>
    );
  }
  async componentDidMount() {
    console.log(`Bearer ${this.props.token}`);
    this.setState({ isLoading: true });
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector/",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      isLoading: false,
      sectorList: response.data
    });
  }
}
