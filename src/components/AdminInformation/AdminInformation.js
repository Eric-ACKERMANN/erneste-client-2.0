import React from "react";
import axios from "axios";
import "./index.css";

export default class AdminInformations extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    changePassword: false,
    passwordChangeReturn: ""
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

  setPassword = e => {
    this.setState({ password: e.target.value });
  };

  setConfirmPassword = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  setChangePassword = () => {
    this.setState({ changePassword: !this.state.changePassword });
  };

  updatePassword = async () => {
    if (this.state.password === this.state.confirmPassword) {
      const response = await axios.get(
        "https://erneste-server-improved.herokuapp.com/user/new-password",
        {
          email: this.state.email,
          newPassword: this.state.password
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ passwordChangeReturn: response.data });
    }
  };

  buttonClick = async () => {
    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    };
    await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/update",
      {
        id: "5cf7cb227021d30017ef2223",
        user: user
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
  };

  render() {
    return (
      <div className="admin-information-container">
        {this.state.data === null ? (
          <div className="admin-talent-liste">Aucun message</div>
        ) : (
          <div className="admin-information-left-side">
            <div className="admin-informations-top-div">Prénom</div>
            <input
              className="admin-informations-div"
              value={this.state.firstName}
              onChange={this.setFirstName}
            />

            <div className="admin-informations-top-div">Nom</div>
            <input
              className="admin-informations-div"
              value={this.state.lastName}
              onChange={this.setLastName}
            />

            <div className="admin-informations-top-div">Email</div>
            <input
              className="admin-informations-div"
              value={this.state.email}
              onChange={this.setEmail}
            />

            <div
              className="admin-informations-button"
              onClick={this.setChangePassword}
            >
              Modifier le mot de passe
            </div>
            {this.state.changePassword ? (
              <div className="admin-information-password-change admin-information-padding-top">
                <div className="admin-informations-top-div">
                  Modifier le mot de passe
                </div>
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="admin-informations-div input-password-change"
                  value={this.state.password}
                  onChange={this.setPassord}
                />
                <div className="admin-informations-top-div">
                  Confirmer le mot de passe
                </div>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  className="admin-informations-div"
                  value={this.state.confirmPassword}
                  onChange={this.setConfirmPassord}
                />
                <div
                  className="admin-informations-button"
                  onClick={this.updatePassword}
                >
                  Change le mot de passe
                </div>
              </div>
            ) : (
              false
            )}
            <div
              className="admin-informations-button"
              onClick={this.buttonClick}
            >
              Update
            </div>
          </div>
        )}
      </div>
    );
  }

  async componentDidMount() {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/5cf7cb227021d30017ef2223",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email
    });
  }
}
