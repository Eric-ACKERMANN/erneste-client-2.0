import React from "react";
import "./index.css";
import ReactFileReader from "react-file-reader";

export default class ClientInformation extends React.Component {
  state = {
    talentSearch: ""
  };

  setSearch = e => {
    this.setState({ talentSearch: e.target.value });
  };

  handleFiles = files => {
    this.props.setPhoto(files.base64);
  };

  render() {
    console.log(this.props.clientUsers);
    return (
      <div className="client-information-container">
        <div className="client-information-detail-container">
          <ReactFileReader
            fileTypes={[".png", ".jpg"]}
            base64={true}
            multipleFiles={false}
            handleFiles={this.handleFiles}
          >
            {this.props.clientLogo !== null ? (
              <span className="client-information-picture-container">
                <img
                  className="client-information-picture"
                  src={this.props.clientLogo}
                  alt="logo of"
                />
              </span>
            ) : (
              <div className="client-information-empty-picture">
                <div className="client-information-text-empty-picture">
                  Cliquez pour ajouter une photo
                </div>
              </div>
            )}
          </ReactFileReader>
          <div className="client-information-detail">
            <div className="client-information-name">
              {this.props.clientName}
            </div>
            <div style={{ display: "flex" }}>
              <div className="client-information-field">
                {this.props.clientField}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="client-information-size">
                {this.props.clientSize}
              </div>
            </div>
          </div>
        </div>
        <div className="client-information-talent-container">
          <div className="client-information-talent-search">
            <div className="client-information-magnifier">
              <i className="fas fa-search" />
            </div>

            <input
              value={this.state.talentSearch}
              onChange={this.setSearch}
              placeholder="Recherche talent, état"
            />
          </div>

          <div className="client-information-talent-list-container">
            <ul className="client-information-talent-list-title">
              <li>Utilisateur</li>
              <li>Talent contacté</li>
              <li>Etat</li>
              <li>Note</li>
            </ul>
            {this.props.clientUsers.map(user => {
              return user.conversations.map(conversation => {
                return (
                  <ul
                    className="client-information-talent-list-title"
                    key={conversation._id}
                  >
                    <li>
                      {user.firstName} {user.lastName}
                    </li>
                    <li>
                      {conversation.contactFirstName}{" "}
                      {conversation.contactLastName}
                    </li>
                    <li>
                      {conversation.status === "accepted" && (
                        <span>Contact accepté</span>
                      )}
                      {conversation.status === "declined" && (
                        <span>Contact refusé</span>
                      )}
                      {conversation.status === "process" && (
                        <span>Contact en cours</span>
                      )}
                    </li>
                    <li>(Non disponible)</li>
                  </ul>
                );
              });
            })}
          </div>
        </div>
      </div>
    );
  }
}
