import React from "react";
import axios from "axios";
import "./index.css";
import box from "../../features/icons/check_24px.svg";
import PopUpClientWelcome from "../../components/ClientWelcome_PopUp";

export default class ClientWelcome extends React.Component {
  state = {
    isLoading: true,
    titleList: ["Nom", "Fonction", "Entreprise", "Intéressé(e) par"],
    clientData: null,
    talentList: [],
    talentShown: [],
    positionShown: 0,
    hoverContact: false,
    contactPopUp: false,
    popUpObjectInputValue: "",
    popUpMessageInputValue: ""
  };

  getSelectedTalentList = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/talent/",
      {
        headers: { authorization: `Bearer ${this.props.token}` }
      }
    );
    // Filter response.data to become an array of selectedTalent for this client
    let selectedTalent = [];
    let clientSize = "";
    let clientSector = "";

    if (this.state.clientData && response.data) {
      clientSize = this.state.clientData.size;
      clientSector = this.state.clientData.field.name;

      selectedTalent = response.data.filter(function(e) {
        let wantedSize = e.informations.wantedSize;
        let wantedSector = e.informations.wantedSector;
        return (
          (wantedSize &&
            wantedSector &&
            (wantedSize === "Indifférent" || wantedSize === clientSize)) ||
          wantedSector
            .map(e => {
              return e.name;
            })
            .indexOf(clientSector) !== -1
        );
      });
    }
    this.setState({ talentList: selectedTalent, isLoading: false });
  };

  getClientData = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client/" +
        this.props.match.params.id,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ clientData: response.data, isLoading: false });
  };

  // Function that displays the list of selected Talent

  displayTitle = titleList => {
    return (
      <ul>
        <li className="client-welcome-leftBlock-talentBlock-list-talent-checkBox">
          <img
            className="client-welcome-leftblock-box"
            src={box}
            alt="box cochée"
          />
        </li>
        {titleList.map((element, index) => {
          let columnClass = "";
          if (titleList.indexOf(element) === 0) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-name";
          }
          if (titleList.indexOf(element) === 1) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-actualTitle";
          }
          if (titleList.indexOf(element) === 2) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-actualCompany";
          }
          if (titleList.indexOf(element) === 3) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-title-interestedBy";
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

  displayTalent = selectedTalentList => {
    return selectedTalentList.map((element, index) => {
      let statusClass = "";
      // Get the status
      if (element.informations.status === "0") {
        statusClass = "client-welcome-statut0";
      }
      if (element.informations.status === "Recherche active") {
        statusClass = "client-welcome-statut1";
      }
      if (element.informations.status === "Ouvert(e) aux opportunités") {
        statusClass = "client-welcome-statut2";
      }
      if (element.informations.status === "Ne pas être contacté(e)") {
        statusClass = "client-welcome-statut3";
      }
      if (element.informations.status === "Embauché(e) par Erneste") {
        statusClass = "client-welcome-statut4";
      }

      let clicked = null;
      if (this.state.talentShown) {
        if (
          this.state.talentShown
            .map(e => {
              return e.profil;
            })
            .indexOf(element) === -1
        ) {
          clicked = false;
        } else {
          clicked = true;
        }
      }

      return (
        <ul
          key={index}
          onClick={() => {
            this.handleTalentClick(element, selectedTalentList);
          }}
        >
          <li className="client-welcome-leftBlock-talentBlock-list-talent-checkBox">
            <img
              className={
                clicked
                  ? "client-welcome-leftblock-box-checked"
                  : "client-welcome-leftblock-box-unChecked"
              }
              src={box}
              alt={clicked ? "box cochée" : "box non cochée"}
            />
          </li>
          <li
            className="client-welcome-leftBlock-talentBlock-list-talent-name"
            key={element}
          >
            <div className={statusClass} />
            <div className="client-welcome-leftBlock-talentBlock-list-talent-name-text">{`${
              element.informations.firstName
            } ${element.informations.lastName}`}</div>
          </li>
          <li className="client-welcome-leftBlock-talentBlock-list-talent-actualTitle">
            {element.informations.actualTitle}
          </li>
          <li className="client-welcome-leftBlock-talentBlock-list-talent-actualCompany">
            {element.informations.actualCompany}
          </li>
          <li className="client-welcome-leftBlock-talentBlock-list-talent-interestedBy">
            {element.informations.wantedTitle.map(e => {
              return <div key={e.name}>{e.name}</div>;
            })}
          </li>
        </ul>
      );
    });
  };

  // Function that select a talent
  handleTalentClick = (element, selectedTalentList) => {
    const talentShownCopie = [...this.state.talentShown];
    let bool = false;
    let position = talentShownCopie
      .map(e => {
        return e.profil;
      })
      .indexOf(element);

    if (position === -1) {
      talentShownCopie.push({
        profil: element,
        position: selectedTalentList.indexOf(element)
      });
      position = talentShownCopie
        .map(e => {
          return e.profil;
        })
        .indexOf(element);
    } else {
      bool = true;

      if (this.state.positionShown === this.state.talentShown.length - 1) {
        if (this.state.positionShown !== 0) {
          this.setState({ positionShown: this.state.positionShown - 1 });
        } else {
          this.setState({ positionShown: 0 });
        }
      }
      talentShownCopie.splice(position, 1);
    }
    // Sort the array to match the initial order
    let talentShownSorted = talentShownCopie.sort((a, b) => {
      return a.position - b.position;
    });
    position = talentShownSorted
      .map(e => {
        return e.profil;
      })
      .indexOf(element);
    if (bool === false) {
      this.setState({ positionShown: position });
    }
    this.setState({ talentShown: talentShownSorted });
  };

  hoverOn = () => {
    this.setState({ hoverContact: true });
  };

  hoverOff = () => {
    this.setState({ hoverContact: false });
  };

  positionShownDown = () => {
    if (this.state.positionShown > 0) {
      this.setState({ positionShown: this.state.positionShown - 1 });
    }
  };
  positionShownUp = () => {
    if (this.state.positionShown < this.state.talentShown.length - 1) {
      this.setState({ positionShown: this.state.positionShown + 1 });
    }
  };

  togglePopUp = () => {
    this.setState({ contactPopUp: true });
  };

  cancelPopUp = () => {
    this.setState({ contactPopUp: false });
  };

  // PopUp - Message Title
  setPopUpObjectValue = toto => {
    this.setState({ popUpObjectInputValue: toto });
  };

  // PopUp - Message
  setPopUpMessageInputValue = toto => {
    this.setState({ popUpMessageInputValue: toto });
  };

  handlePopUpSendMessageClick = async talentMail => {
    // We find the mail of the sender
    const mailSender = this.state.clientData.users[
      this.state.clientData.users
        .map(e => {
          return e._id;
        })
        .indexOf(this.props.userData.id)
    ].email;
    console.log("ce qu'on envoie", {
      from: mailSender,
      to: talentMail,
      message: this.state.popUpMessageInputValue,
      title: this.state.popUpObjectInputValue,
      companyName: this.state.clientData.name,
      companyLogo: this.state.clientData.logo
    });
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/message",
      {
        from: mailSender,
        to: talentMail,
        message: this.state.popUpMessageInputValue,
        title: this.state.popUpObjectInputValue,
        companyName: this.state.clientData.name,
        companyLogo: this.state.clientData.logo
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ contactPopUp: false });
  };

  render() {
    /* Test of Loading... */

    if (this.state.isLoading === true) {
      return "En cours de chargement....";
    }
    // Filter TalentList to become an array of selectedTalent for this client
    let selectedTalent = [];
    let clientSize = "";
    let clientSector = "";
    if (this.state.clientData) {
      clientSize = this.state.clientData.size;
      clientSector = this.state.clientData.field._id;
    }

    if (this.state.clientData && this.state.talentList) {
      for (let i = 0; i < this.state.talentList.length; i++) {
        if (
          this.state.talentList[i].informations.wantedSize &&
          (this.state.talentList[i].informations.wantedSize === "Indifférent" ||
            this.state.talentList[i].informations.wantedSize === clientSize)
        ) {
          if (this.state.talentList[i].informations.wantedSector) {
            for (
              let j = 0;
              j < this.state.talentList[i].informations.wantedSector.length;
              j++
            ) {
              if (
                this.state.talentList[i].informations.wantedSector[j] ===
                clientSector
              ) {
                selectedTalent.push(this.state.talentList[i]);
              }
            }
          }
        }
      }
    }

    return (
      <div className="client-welcome-content">
        <div className="client-welcome-body-container">
          {this.state.contactPopUp && (
            <PopUpClientWelcome
              cancelPopUp={this.cancelPopUp}
              objectValue={this.state.popUpObjectInput}
              messageValue={this.state.messageInputValue}
              setObject={this.setPopUpObjectValue}
              setMessage={this.setPopUpMessageInputValue}
              sendMessage={this.handlePopUpSendMessageClick}
              talent={this.state.talentShown[this.state.positionShown]}
            />
          )}
          <div className="client-welcome-leftBlock">
            <div className="client-welcome-leftBlock-title">Accueil</div>
            <div className="client-welcome-leftBlock-talentBlock">
              <div className="client-welcome-leftBlock-talentBlock-title">
                Talents sélectionnés pour vous
              </div>
              <div className="client-welcome-leftBlock-talentBlock-searchLine">
                <div className="client-welcome-leftBlock-talentBlock-searchLine-searchBlock">
                  <i className="fas fa-search" />
                  <input placeholder="Rechercher un profil" />
                </div>
              </div>
              <div className="client-welcome-leftBlock-talentBlock-list">
                <div className="client-welcome-leftBlock-talentBlock-list-title">
                  {this.displayTitle(this.state.titleList)}
                </div>
                <div className="client-welcome-leftBlock-talentBlock-list-talent">
                  {this.displayTalent(this.state.talentList)}
                </div>
              </div>
            </div>
          </div>
          <div className="client-welcome-rightBlock">
            {this.state.talentShown.length > 0 && (
              <div>
                <div className="client-welcome-rightBlock-header">
                  <div className="client-welcome-rightBlock-header-left">
                    <div className="client-welcome-rightBlock-header-left-picture-block">
                      {this.state.talentShown[this.state.positionShown].profil
                        .informations.photo !== null ? (
                        <img
                          className="client-welcome-rightBlock-header-left-picture-picture"
                          src={
                            this.state.talentShown[this.state.positionShown]
                              .profil.informations.photo
                          }
                          alt="portrait of talent"
                        />
                      ) : (
                        <div className="empty-photo">
                          <div className="text-empty-picture" />
                        </div>
                      )}
                    </div>
                    <div className="client-welcome-rightBlock-header-left-comments">
                      <span className="client-welcome-rightBlock-header-left-comments-name">
                        {`${
                          this.state.talentShown[this.state.positionShown]
                            .profil.informations.firstName
                        } ${
                          this.state.talentShown[this.state.positionShown]
                            .profil.informations.lastName
                        }`}
                        {this.state.talentShown[this.state.positionShown].profil
                          .informations.linkedIn ? (
                          <a
                            href={
                              this.state.talentShown[this.state.positionShown]
                                .profil.informations.linkedIn
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-linkedin client-welcome-rightBlock-header-left-comments-linkedin" />
                          </a>
                        ) : (
                          <i className="fab fa-linkedin client-welcome-rightBlock-header-left-comments-linkedin" />
                        )}
                      </span>
                      <span className="client-welcome-rightBlock-header-left-comments-features">
                        {
                          this.state.talentShown[this.state.positionShown]
                            .profil.informations.actualCompany
                        }
                      </span>
                      <span className="client-welcome-rightBlock-header-left-comments-features">
                        €{" "}
                        {
                          this.state.talentShown[this.state.positionShown]
                            .profil.informations.salary
                        }
                      </span>
                    </div>
                  </div>
                  <div className="client-welcome-rightBlock-header-right">
                    <div className="client-welcome-rightBlock-header-right-arrows">
                      <div
                        className="client-welcome-rightBlock-header-right-arrows-left"
                        onClick={this.positionShownDown}
                      >
                        <i className="fas fa-arrow-left" />
                      </div>
                      <div
                        className="client-welcome-rightBlock-header-right-arrows-right"
                        onClick={this.positionShownUp}
                      >
                        <i className="fas fa-arrow-right" />
                      </div>
                    </div>
                    <div className="client-welcome-rightBlock-header-right-contact-block">
                      <div
                        onMouseEnter={this.hoverOn}
                        onMouseLeave={this.hoverOff}
                        onClick={this.togglePopUp}
                        className="client-welcome-rightBlock-header-right-contact-button"
                      >
                        Contacter
                      </div>
                      <div
                        className={
                          this.state.hoverContact
                            ? "test-display"
                            : "test-notDisplay"
                        }
                      >
                        <div className="arrow-upTest" />
                        <div className="textTest">
                          Contacter les talents via Erneste augmente vos chances
                          de réponse positives, car nous sommes un tiers de
                          confiance auquel se fie le talent.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="client-welcome-rightBlock-idealCompany">
                  <h3 className="client-welcome-rightBlock-title">
                    L'entreprise idéale
                  </h3>
                  <div className="client-welcome-rightBlock-text">
                    {
                      this.state.talentShown[this.state.positionShown].profil
                        .description.idealCompany
                    }
                  </div>
                </div>
                <div className="client-welcome-rightBlock-idealRole">
                  <h3 className="client-welcome-rightBlock-title">
                    Mon rôle idéal
                  </h3>
                  <div className="client-welcome-rightBlock-text">
                    {
                      this.state.talentShown[this.state.positionShown].profil
                        .description.idealRole
                    }
                  </div>
                </div>
                <div className="client-welcome-rightBlock-workingEnvironment">
                  <h3 className="client-welcome-rightBlock-title">
                    Mes conditions idéales
                  </h3>
                  <div className="client-welcome-rightBlock-text">
                    {
                      this.state.talentShown[this.state.positionShown].profil
                        .description.workingEnvironment
                    }
                  </div>
                </div>
                <div className="client-welcome-rightBlock-development">
                  <h3 className="client-welcome-rightBlock-title">
                    Mes ambitions d'évolution
                  </h3>
                  <div className="client-welcome-rightBlock-text">
                    {
                      this.state.talentShown[this.state.positionShown].profil
                        .description.development
                    }
                  </div>
                </div>
                <div className="client-welcome-rightBlock-skills">
                  <h3 className="client-welcome-rightBlock-title">Skills</h3>
                  <div className="client-welcome-rightBlock-tagBlock">
                    {this.state.talentShown[
                      this.state.positionShown
                    ].profil.skills.map(tag => {
                      return (
                        <div
                          key={tag.name}
                          style={{
                            backgroundColor:
                              tag.type === "hard" ? "#333266" : "#EF6364"
                          }}
                          className="client-welcome-tag"
                        >
                          <div className="client-welcome-tag-name">
                            {tag.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this.props.setPageActive("client");
    this.getClientData();
    this.getSelectedTalentList();
  }
}
