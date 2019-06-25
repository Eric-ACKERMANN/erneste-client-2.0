import React from "react";
import "./index.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class ResetPassword extends React.Component {
  state = {
    password: "",
    confirmPassword: "",
    error: false,
    done: false
  };

  setPassword = e => {
    this.setState({ password: e.target.value });
  };

  setConfirmPassword = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  changePassword = async () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: true });
    } else {
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/new-password",
        {
          token: this.props.match.params.token,
          password: this.state.password
        }
      );
      this.setState({ done: true });
    }
  };

  render() {
    return (
      <div className="reset-password-container">
        {this.state.done && <Redirect to="/" />}
        <div className="reset-password-input-container">
          <img
            src={require("../../features/img/logo.svg")}
            alt="erneste-logo"
          />
          <div>Nouveau mot de passe</div>
          <input
            value={this.state.password}
            onChange={this.setPassword}
            className={this.state.error ? "reset-password-error" : false}
          />
          <div>Confirmer mot de passe</div>
          <input
            value={this.state.confirmPassword}
            onChange={this.setConfirmPassword}
            className={this.state.error ? "reset-password-error" : false}
          />
          {this.state.error && (
            <div className="reset-password-error-message">
              <p>Erreur :</p> les mots de passe ne sont pas identiques.
            </div>
          )}
          <div
            onClick={this.changePassword}
            className="reset-password-validate"
          >
            Changer le mot de passe
          </div>
        </div>
      </div>
    );
  }

  /*  async componentDidMount() {
    const response = await axios.get(
      "http://localhost:3001/user/new-password/" + this.props.match.params.token
    );
    this.setState({ user: response.data });
  } */
}
