import React from "react";
import "./index.css";

export default class ClientUsers extends React.Component {
  render() {
    let users = [];
    if (this.props.users.length > 0) {
      users = this.props.users.map(user => {
        return (
          <div key={user._id}>
            <span>
              <div>
                {user.firstName} {user.lastName}
              </div>
              <div>{user.email}</div>
            </span>
            <span>
              <i
                className="fas fa-trash-alt"
                onClick={() => this.props.handleClickDeleteUsers(user._id)}
              />
            </span>
          </div>
        );
      });
    }
    return (
      <div className="client-users-container">
        <div>
          <div className="client-users-header">
            Utilisateurs autorisés pour cette entreprise
          </div>
          <div className="client-users-list">{users}</div>
        </div>

        <div className="client-users-footer">
          <div
            className="client-users-add-button"
            onClick={this.props.setPopUp}
          >
            Ajouter un utilisateur
          </div>
          <div className="client-users-activation-key-container">
            <div>clé d'activation</div>
            <input
              placeholder="clé"
              value={this.props.activationKey}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
