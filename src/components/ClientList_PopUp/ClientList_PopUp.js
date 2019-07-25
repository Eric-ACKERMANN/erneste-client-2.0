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

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const statesToUpdate = {};
    statesToUpdate[name] = value;
    this.setState(statesToUpdate);
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
  setSize = e => {
    const id = e.target.id;
    this.setState({ taille: id, sizeSelect: false });
  };

  // fonction apparation gestion select secteur
  sectorSelect = () => {
    this.setState({ sectorSelect: !this.state.sectorSelect });
  };

  // fonction apparation gestion select Taille
  sizeSelect = () => {
    this.setState({ sizeSelect: !this.state.sizeSelect });
  };

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

  handleMouseEnterItem = item => {
    let sectorList = [...this.state.sectorList];
    sectorList.forEach(e => (e.selected = false));
    let position = this.state.sectorList
      .map(e => {
        return e._id;
      })
      .indexOf(item._id);

    sectorList[position].selected = true;
    this.setState({ sectorList: sectorList });
  };

  handleMouseLeaveItem = item => {
    let sectorList = [...this.state.sectorList];
    sectorList.forEach(e => (e.selected = false));
    this.setState({ sectorList: sectorList });
  };

  handleKeyDownItem = e => {
    if (this.state.sectorSelect) {
      let sectorList = [...this.state.sectorList];
      let position = sectorList
        .map(e => {
          return e.selected;
        })
        .indexOf(true);

      // Arrow Down
      if (e.keyCode === 40) {
        if (position === -1) {
          sectorList[0].selected = true;
        } else {
          sectorList[position].selected = false;
          if (position === sectorList.length - 1) {
            sectorList[0].selected = true;
          } else {
            sectorList[position + 1].selected = true;
          }
        }
        position = sectorList
          .map(e => {
            return e.selected;
          })
          .indexOf(true);
        let itemId = sectorList[position]._id;
        let element = document.getElementById(itemId);
        element.scrollIntoView(false);
        this.setState({ sectorList: sectorList });
        return;
      }
      // Arrow Up
      if (e.keyCode === 38) {
        if (position !== -1) {
          sectorList[position].selected = false;
          if (position === 0) {
            sectorList[sectorList.length - 1].selected = true;
          } else {
            sectorList[position - 1].selected = true;
          }
        }
        position = sectorList
          .map(e => {
            return e.selected;
          })
          .indexOf(true);
        let itemId = sectorList[position]._id;
        let element = document.getElementById(itemId);
        element.scrollIntoView(true);
        this.setState({ sectorList: sectorList });
        return;
      }

      // Enter
      if (e.keyCode === 13) {
        let secteur = sectorList[position];
        sectorList[position].selected = false;
        this.setState({ secteur });
        this.sectorSelect();
        this.setState({ sectorList: sectorList });
        return;
      }

      // Escape
      if (e.keyCode === 27) {
        sectorList.forEach(e => (e.selected = false));
        this.sectorSelect();
      }
      // Backspace
      if (e.keyCode === 8) {
        sectorList.forEach(e => (e.selected = false));
        this.setState({ secteur: "" });
      }
    }
  };

  handleBlurItem = () => {
    let sectorList = [...this.state.sectorList];
    sectorList.forEach(e => (e.selected = false));
    this.sectorSelect();
    this.setState({ sectorList: sectorList });
  };

  render() {
    if (this.state.isLoading === true) {
      return false;
    }

    return (
      <div className="clientlist-popup-background">
        <div className="clientlist-popup-container">
          <div className="clientlist-popup-header">
            <div className="clientlist-popup-header-title">
              Ajouter un nouveau client
            </div>
            <div
              className="clientlist-popup-header-close"
              onClick={this.props.closePopup}
            >
              <i className="fas fa-times" />
            </div>
          </div>

          <div className="clientlist-popup-body">
            <span>Entreprise</span>
            <input
              value={this.state.entreprise}
              onChange={this.handleChange}
              placeholder="Nom de l'entreprise..."
              type="text"
              name="entreprise"
              id="name"
              required
              autoFocus
            />

            <span>Secteur</span>
            <input
              value={this.state.secteur ? this.state.secteur.name : ""}
              placeholder="Cliquer pour sélectionner un secteur..."
              className="clientlist-popup-block-select"
              onClick={this.sectorSelect}
              onKeyDown={this.handleKeyDownItem}
              readOnly
            />

            {this.state.sectorSelect && (
              <div className="clientlist-popup-block-select-list">
                {this.state.sectorList.map((item, index) => {
                  return (
                    <div
                      style={{
                        backgroundColor: item.selected
                          ? "rgb(220,220,220)"
                          : "#FEFEFE"
                      }}
                      id={item._id}
                      key={item._id}
                      onClick={this.setSector}
                      className="clientlist-popup-select-list-item"
                      onMouseEnter={() => this.handleMouseEnterItem(item)}
                      onMouseLeave={() => this.handleMouseLeaveItem(item)}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            )}

            <span>Taille de l'entreprise</span>
            <div
              className="clientlist-popup-block-select"
              onClick={this.sizeSelect}
            >
              {this.state.taille ? (
                this.state.taille
              ) : (
                <span>Cliquer pour sélectionner une taille</span>
              )}
            </div>
            {this.state.sizeSelect && (
              <div className="clientlist-popup-block-select-list listsize">
                <div
                  className="clientlist-popup-select-list-item"
                  id="Petite"
                  onClick={this.setSize}
                >
                  Petite
                </div>
                <div
                  className="clientlist-popup-select-list-item"
                  id="Grande"
                  onClick={this.setSize}
                >
                  Grande
                </div>
              </div>
            )}

            <span>Email</span>
            <input
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Email de contact de l'entreprise..."
              type="text"
              name="email"
              id="name"
              required
            />

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
          </div>
          {/* affichage de l'état de la validation du formulaire */}
          <div>
            {this.state.error === true ? <p>error</p> : this.state.error}
            {this.state.valid === true ? <p>validate</p> : this.state.valid}
          </div>
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
    response.data.forEach(e => {
      e.selected = false;
    });
    this.setState({
      isLoading: false,
      sectorList: response.data
    });
  }
}
