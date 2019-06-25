import React from "react";
import axios from "axios";
import "./index.css";

export default class TalentOpportunities extends React.Component {
  state = {
    isLoading: true,
    titleList: ["Entreprises", "Objet", "Date de réception"]
  };

  displayTitle = titleList => {
    return (
      <ul>
        {titleList.map((element, index) => {
          let columnClass = "";
          if (titleList.indexOf(element) === 0) {
            columnClass =
              "talent-opportunities-leftBlock-contactBlock-list-talent";
          }
          if (titleList.indexOf(element) === 1) {
            columnClass =
              "talent-opportunities-leftBlock-contactBlock-list-objet";
          }
          if (titleList.indexOf(element) === 2) {
            columnClass =
              "talent-opportunities-leftBlock-contactBlock-list-statut";
          }

          return (
            <li key={index} className={columnClass}>
              {element}
              <i className="fas fa-sort-down" />
            </li>
          );
        })}
      </ul>
    );
  };

  getConversations = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    await this.setState({ clientData: response.data });
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div className="talent-opportunities-content">
        <div className="talent-opportunities-body-container">
          <div className="talent-opportunities-leftBlock">
            <div className="talent-opportunities-leftBlock-title">
              Opportunités
            </div>
            <div className="talent-opportunities-leftBlock-contactBlock">
              <div className="talent-opportunities-leftBlock-contactBlock-title">
                Entreprises en contact
              </div>
              <div className="talent-opportunities-leftBlock-contactBlock-list">
                <div className="talent-opportunities-leftBlock-contactBlock-list-title">
                  {this.displayTitle(this.state.titleList)}
                </div>
                {/* <div className="talent-opportunities-leftBlock-talentBlock-list-talent">
                  {this.displayTalent(selectedTalent)}
                </div> */}
              </div>
            </div>
          </div>
          <div className="talent-opportunities-rightBlock" />
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("talent/opportunities");
    this.getConversations();
  }
}
