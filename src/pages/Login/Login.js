import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./index.css";

export default class Login extends React.Component {
  state = {
    email: "",
    emailInputFalse: false,
    emailFocus: false,
    password: "",
    passwordInputFalse: false,
    passwordFocus: false,
    key: "",
    keyInputFalse: false,
    keyFocus: false,
    wrong: false,
    showPassword: false,
    login: "Talent"
  };

  setEmail = e => {
    e.target.value === ""
      ? this.setState({ email: e.target.value, emailInputFalse: true })
      : this.setState({ email: e.target.value, emailInputFalse: false });
  };

  setPassword = e => {
    e.target.value === ""
      ? this.setState({ password: e.target.value, passwordInputFalse: true })
      : this.setState({
          password: e.target.value,
          passwordInputFalse: false
        });
  };

  setKey = e => {
    e.target.value === ""
      ? this.setState({ key: e.target.value, keyInputFalse: true })
      : this.setState({ key: e.target.value, keyInputFalse: false });
  };

  setLogin = toto => {
    this.setState({ login: toto });
  };

  showPassword = () => {
    this.setState({ showPassword: true });
  };

  hidePassword = () => {
    this.setState({ showPassword: false });
  };

  onBlurEmail = () => {
    if (!this.state.email) {
      this.setState({ emailInputFalse: true, emailFocus: false });
    } else {
      this.setState({ emailFocus: false });
    }
  };
  onBlurPassword = () => {
    if (!this.state.password) {
      this.setState({ passwordInputFalse: true, passwordFocus: false });
    } else {
      this.setState({ passwordFocus: false });
    }
  };
  onBlurKey = () => {
    if (!this.state.key) {
      this.setState({ keyInputFalse: true, keyFocus: false });
    } else {
      this.setState({ keyFocus: false });
    }
  };
  onFocusEmail = () => {
    this.setState({ emailFocus: true });
  };
  onFocusKey = () => {
    this.setState({ keyFocus: true });
  };
  onFocusPassword = () => {
    this.setState({ passwordFocus: true });
  };

  focusEmailMethod = function getFocus() {
    document.getElementById("emailInput").focus();
  };
  focusPasswordMethod = function getFocus() {
    document.getElementById("passwordInput").focus();
  };
  focusKeyMethod = function getFocus() {
    document.getElementById("keyInput").focus();
  };

  login = async () => {
    try {
      const response = await axios.post(
        "https://erneste-server-improved.herokuapp.com/login",
        {
          email: this.state.email,
          password: this.state.password
        }
      );
      Cookies.set("erneste", {
        token: response.data.token,
        permission: response.data.permission,
        id: response.data.id,
        profile: response.data.profile
      });
      this.props.onLogIn({
        token: response.data.token,
        permission: response.data.permission,
        id: response.data.id,
        profile: response.data.profile
      });
      this.setState({ wrong: false });
    } catch (error) {
      this.setState({ wrong: true, password: "" });
    }
  };

  clientLogin = async () => {
    try {
      const response = await axios.post(
        "https://erneste-server-improved.herokuapp.com/login/client",
        {
          email: this.state.email,
          password: this.state.password,
          key: this.state.key
        }
      );
      Cookies.set("erneste", {
        token: response.data.token,
        permission: response.data.permission,
        id: response.data.id,
        clientId: response.data.clientId,
        email: response.data.email
      });
      this.props.onLogIn({
        token: response.data.token,
        permission: response.data.permission,
        id: response.data.id,
        clientId: response.data.clientId
      });
      this.setState({ wrong: false });
    } catch (error) {
      this.setState({ wrong: true, password: "" });
    }
  };

  render() {
    return (
      <div className="login-container">
        <div className="login-img">
          <div className="login-left-side">
            <div className="login-circle" />
            <img
              className="login-logo"
              src={require("../../features/img/logo.svg")}
              alt="ernest-logo"
            />
            <div className="login-special-title">
              Soyez le <span>héros</span> de votre carrière
              <div>Erneste donne vie à vos ambitions de carrière.</div>
            </div>
          </div>
        </div>

        <div className="login-input-container">
          <div className="login-input-title">
            <div
              className={
                this.state.login === "Talent"
                  ? "login-input-connexion-clicked"
                  : "login-input-connexion-notClicked"
              }
              onClick={() => {
                this.setLogin("Talent");
              }}
            >
              Talent
            </div>
            <div
              className={
                this.state.login === "Company"
                  ? "login-input-connexion-clicked"
                  : "login-input-connexion-notClicked"
              }
              onClick={() => {
                this.setLogin("Company");
              }}
            >
              Entreprise
            </div>
          </div>
          <div className="login-input-body">
            <h3 className="login-h3">Connectez vous</h3>
            <div className="login-input-block">
              <div
                className={
                  this.state.emailInputFalse
                    ? "login-input-block-input-blockFalse"
                    : "login-input-block-input"
                }
              >
                <span
                  className={
                    this.state.emailFocus ||
                    (!this.state.emailFocus && this.state.email)
                      ? "login-input-block-title-focused"
                      : "login-input-block-title"
                  }
                  onClick={() => this.focusEmailMethod()}
                >
                  Votre email
                </span>
                <input
                  id="emailInput"
                  name="email"
                  className={
                    this.state.emailInputFalse
                      ? "login-input inputFalse"
                      : "login-input"
                  }
                  value={this.state.email}
                  onChange={this.setEmail}
                  // placeholder="Votre email"
                  onBlur={() => this.onBlurEmail()}
                  onFocus={() => this.onFocusEmail()}
                />
              </div>
              {this.state.emailInputFalse && (
                <span className="login-input-block-required">Requis</span>
              )}
            </div>
            <div
              className={
                this.state.login === "Company"
                  ? "login-input-block companyMode"
                  : " login-input-block talentMode"
              }
            >
              <div
                className={
                  this.state.keyInputFalse
                    ? "login-input-block-input-blockFalse"
                    : "login-input-block-input"
                }
              >
                <span
                  className={
                    this.state.keyFocus ||
                    (!this.state.keyFocus && this.state.key)
                      ? "login-input-block-title-focused"
                      : "login-input-block-title"
                  }
                  onClick={() => this.focusKeyMethod()}
                >
                  Clé d'activation
                </span>
                <input
                  id="keyInput"
                  name="key"
                  className={
                    this.state.keyInputFalse
                      ? "login-input inputFalse"
                      : "login-input"
                  }
                  value={this.state.key}
                  onChange={this.setKey}
                  // placeholder="Clé d'activation"
                  onBlur={() => this.onBlurKey()}
                  onFocus={() => this.onFocusKey()}
                />
              </div>
              {this.state.keyInputFalse && (
                <span className="login-input-block-required">Requis</span>
              )}
            </div>
            <div className="login-input-block">
              <div
                className={
                  this.state.passwordInputFalse
                    ? "login-input-block-input-blockFalse"
                    : "login-input-block-input"
                }
              >
                <span
                  className={
                    this.state.passwordFocus ||
                    (!this.state.passwordFocus && this.state.password)
                      ? "login-input-block-title-focused"
                      : "login-input-block-title"
                  }
                  onClick={() => this.focusPasswordMethod()}
                >
                  Mot de passe
                </span>
                <div
                  className={
                    this.state.passwordInputFalse ? "test inputFalse" : "test"
                  }
                >
                  <input
                    id="passwordInput"
                    name="password"
                    type={this.state.showPassword ? "text" : "password"}
                    className="login-input inputPassword"
                    value={this.state.password}
                    onChange={this.setPassword}
                    // placeholder="Mot de passe"
                    onBlur={() => this.onBlurPassword()}
                    onFocus={() => this.onFocusPassword()}
                  />
                  <span
                    className="login-password-eye"
                    onMouseDown={this.showPassword}
                    onMouseUp={this.hidePassword}
                    onMouseLeave={this.hidePassword}
                  >
                    <img
                      src={require("../../features/icons/oeil.svg")}
                      alt="eye-icon"
                    />
                  </span>
                </div>
              </div>
              {this.state.passwordInputFalse && (
                <span className="login-input-block-required">Requis</span>
              )}
            </div>
            <div
              className={
                this.state.wrong ? "wrong-password" : "not-wrong-password"
              }
            >
              Identification échouée, veuillez réessayer
            </div>
            <div
              onClick={
                this.state.login === "Company" ? this.clientLogin : this.login
              }
              className="login-button"
            >
              C'est parti !
            </div>
            <Link to="/forgotten-password">
              <div className="login-redirect">
                Mot de passe oublié? <div>Cliquez ici</div>
              </div>
            </Link>
            <div className="link-block">
              <a
                className="lien"
                href="https://erneste.hr/general-terms-of-use/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conditions générales d'utilisation et politique de
                confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
