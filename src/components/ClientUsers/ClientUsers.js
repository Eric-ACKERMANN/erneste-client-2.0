import React from "react";
import "./index.css";

export default class ClientUsers extends React.Component {
  render() {
    let users = [];
    if (this.props.users.length > 0) {
      users = this.props.users.map(user => {
        return <div key={user._id}>{user.email}</div>;
      });
    }
    return (
      <div className="client-users-container">
        <div>
          <div className="client-users-header">Utilisateurs autorisés</div>
          <div className="client-users-email">email</div>
          <div>{users}</div>
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
