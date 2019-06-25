import React from "react";
import axios from "axios";

import "./index.css";

export default class ForgottenPassword extends React.Component {
  state = {
    email: "",
    error: false,
    success: false
  };

  setEmail = e => {
    this.setState({ email: e.target.value });
  };

  sendChangePasswordRequest = async () => {
    try {
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/forgotten-password",
        {
          email: this.state.email
        }
      );
      this.setState({ success: true, error: false });
    } catch (error) {
      this.setState({ error: true, success: false });
    }
  };

  render() {
    return (
      <div className="forgotten-password-container">
        <div className="forgotten-password-input-container">
          <img
            src={require("../../features/img/logo.svg")}
            alt="erneste-logo"
          />
          <div>Merci de renseigné votre email</div>
          <input
            value={this.state.email}
            onChange={this.setEmail}
            placeholder="john.doe@erneste.hr"
          />

          {this.state.error && (
            <div className="forgotten-password-error-message">
              <p>Erreur :</p> cet email n'existe pas.
            </div>
          )}

          {this.state.success && <div>Veuillez consultez vos mails.</div>}
          <div
            onClick={this.sendChangePasswordRequest}
            className="forgotten-password-validate"
          >
            Envoyer
          </div>
        </div>
      </div>
    );
  }
}
