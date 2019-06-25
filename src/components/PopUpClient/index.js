import React from "react";
import axios from "axios";
import "./index.css";

class PopUpClient extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: ""
  };

  setFirstName = e => {
    this.setState({ firstName: e.target.value });
  };
  setLastName = e => {
    this.setState({ lastName: e.target.value });
  };
  setEmail = e => {
    this.setState({ email: e.target.value });
  };

  resetAll = () => {
    this.setState({ firstName: "", lastName: "", email: "" });
  };

  createUser = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/client/new-user",
      {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        clientEmail: this.props.clientEmail
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.props.handleUsers({
      _id: Math.random(),
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      clientEmail: this.props.clientEmail
    });
    this.props.setPopUp();
  };

  render() {
    return (
      <div className="popup-client-container">
        <div className="popup-client-title">
          <div className="popup-client-top-title">Nouvel utilisateur</div>
          <div className="popup-client-close" onClick={this.props.setPopUp}>
            <i className="fas fa-times" />
          </div>
        </div>
        <div className="popup-client-input-container">
          <div className="popup-client-name-container">
            <div>
              <div className="popup-client-name">Prénom</div>
              <input
                value={this.state.firstName}
                onChange={this.setFirstName}
                placeholder="John"
              />
            </div>
            <div>
              <div className="popup-client-name">Nom</div>
              <input
                value={this.state.lastName}
                onChange={this.setLastName}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="popup-client-email-container">
            <div className="popup-client-name">email</div>
            <input
              value={this.state.email}
              onChange={this.setEmail}
              placeholder="nom@mail.com"
            />
          </div>
        </div>
        <div className="popup-client-buttons">
          <div className="popup-client-cancel" onClick={this.resetAll}>
            Annuler
          </div>
          <div className="popup-client-validate" onClick={this.createUser}>
            Ajouter
          </div>
        </div>
      </div>
    );
  }
}

export default PopUpClient;
