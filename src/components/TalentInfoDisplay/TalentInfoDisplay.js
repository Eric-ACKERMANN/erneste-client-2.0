import React from "react";
import "./index.css";

export default class TalentInfoDisplay extends React.Component {
  infoCheck = info => {
    if (!info) {
      return <div style={{ color: "#a8b0d0" }}>Non renseigné</div>;
    }
    return info;
  };

  render() {
    /* if (this.state.informations === null) {
      return <div />;
    } */
    const informations = this.props.informations;
    const lastUpdate = this.props.lastUpdate;
    const conversations = this.props.conversations;
    let formatUpdate = null;
    if (lastUpdate !== null) {
      formatUpdate = lastUpdate
        .split(",")
        .shift()
        .split(" ")
        .join("/");
    }

    let dotColor = "";

    if (informations.status === "Recherche active") {
      dotColor = "#9EBA83";
    }
    if (informations.status === "Ouvert(e) aux opportunités") {
      dotColor = "#F2E9A7";
    }
    if (informations.status === "Ne pas être contacté(e)") {
      dotColor = "#FF9D9D";
    }
    if (informations.status === "Embauché(e) par Erneste") {
      dotColor = "#6A6A8F";
    }
    return (
      <div className="talent-display-container">
        {informations.photo !== null ? (
          <span className="talent-info-picture-container">
            <img
              className="talent-info-picture"
              src={informations.photo}
              alt="portrait of talent"
            />
          </span>
        ) : (
          <div className="talent-info-empty-photo">
            <div className="talent-info-text-empty-picture">Pas de photo</div>
          </div>
        )}
        <div
          className="talent-info-update-profile"
          onClick={this.props.setUpdate}
        >
          <i className="fas fa-cog" />
        </div>
        <div className="talent-info-detail-display">
          <div className="talent-info-first-name">
            {this.infoCheck(informations.firstName)}
          </div>
          <div className="talent-info-first-name">
            {this.infoCheck(informations.lastName)}
          </div>
          <div className="talent-info-availability-dot">
            <div
              style={{
                backgroundColor: dotColor,
                borderWidth: informations.status ? "none" : "1px",
                borderStyle: informations.status ? "none" : "solid"
              }}
            />
            {informations.status}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.linkedIn)}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.email)}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.phoneNumber)}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.salary)}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.actualCompany)}
          </div>
          <div className="talent-info-display-div">
            {informations.wantedSector.map((item, index) => {
              return <div key={index}>{item.name}</div>;
            })}
          </div>
          <div className="talent-info-display-div">
            {informations.wantedSize ? (
              informations.wantedSize + " entreprise"
            ) : (
              <div style={{ color: "#a8b0d0" }}>Non renseigné</div>
            )}
          </div>
          <div className="talent-info-display-div">
            {this.infoCheck(informations.actualTitle)}
          </div>
          <div className="talent-info-display-div">
            {informations.wantedTitle.map((item, index) => {
              return <div key={index}>{item.name}</div>;
            })}
          </div>
          <div className="talent-info-display-div">
            {conversations &&
              conversations.map(conversation => {
                let status = "";
                if (conversation.status === "accepted") {
                  status = "Contact accepté";
                }
                if (conversation.status === "declined") {
                  status = "Contact refusé";
                }
                if (conversation.status === "process") {
                  status = "Contact en cours";
                }
                return (
                  <div key={conversation._id}>
                    {conversation.companyName} - {status}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="talent-info-display-update">
          Mis à jour le {formatUpdate}
        </div>
      </div>
    );
  }
}
