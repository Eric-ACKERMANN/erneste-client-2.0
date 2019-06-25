import React from "react";
import "./index.css";

export default class ClientInformation extends React.Component {
  state = {
    talentSearch: ""
  };

  setSearch = e => {
    this.setState({ talentSearch: e.target.value });
  };

  render() {
    return (
      <div className="client-information-container">
        <div className="client-information-detail-container">
          <div className="client-information-empty-picture" />
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
              placeholder="Recherce talent, état"
            />
          </div>

          <div className="client-information-talent-list-container">
            <div className="client-information-talent-list-title">
              <div className="client-information-talent">Talent</div>
              <div className="client-information-state">Etat</div>
              <div className="client-information-rating">Note</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
