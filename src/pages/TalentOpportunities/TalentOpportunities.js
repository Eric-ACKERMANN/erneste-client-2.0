import React from "react";
import axios from "axios";
import "./index.css";

import TalentOpportunitiesPopUp from "../../components/TalentOpportunities_PopUp";

export default class TalentOpportunities extends React.Component {
  state = {
    isLoading: true,
    talentProfile: null,
    titleList: ["Entreprises", "Objet", "Date de réception"],
    conversations: null,
    contactShownMail: null,
    conversationShown: null,
    objectShown: true,
    popUpShown: null,
    popUpType: null,
    messageValuePopUp: ""
  };

  getConversations = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    // Changement du format de la date
    response.data.forEach(element => {
      element.messages[0].date = element.messages[0].date
        .split(",")[0]
        .split(" ")
        .join("/");
      return element;
    });

    // On enlève les conversations avec l'admin (suite aux messages refusés)
    response.data.filter(e => {
      return e.contactId !== "ackermanneric@gmail.com";
    });

    this.setState({ conversations: response.data, isLoading: false });
  };

  getTalentProfile = async () => {
    const response = await axios.get(
      `https://erneste-server-improved.herokuapp.com/talent/${
        this.props.talentProfile
      }`,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ talentProfile: response.data });
  };

  displayTitle = titleList => {
    return (
      <ul>
        {titleList.map(element => {
          return <li key={element}>{element}</li>;
        })}
      </ul>
    );
  };

  displayOffer = () => {
    if (this.state.conversations) {
      return this.state.conversations.map(conversation => {
        return (
          <ul
            key={conversation._id}
            onClick={() => {
              this.handleClickOffer(conversation);
            }}
          >
            <li>{conversation.company}</li>
            <li>{conversation.title}</li>
            <li>{conversation.messages[0].date}</li>
          </ul>
        );
      });
    }
  };

  handleClickOffer = conversation => {
    this.setState({
      conversationShown: conversation,
      contactShownMail: conversation.contactId
    });
  };

  displayConversation = conversationShown => {
    return (
      <div className="talent-opportunities-conversationShown-container">
        <div className="talent-opportunities-conversationShown-name">
          {conversationShown.company}
        </div>
        <div className="talent-opportunities-conversationShown-title-block">
          <div className="talent-opportunities-conversationShown-object">
            <span>{conversationShown.title}</span>
            <i
              onClick={() => {
                this.handleClickObject();
              }}
              className={
                this.state.objectShown
                  ? "far fa-minus-square"
                  : "far fa-plus-square"
              }
            />
          </div>
          <p
            className={
              this.state.objectShown
                ? "talent-opportunities-conversationShown-firstMessage"
                : "talent-opportunities-conversationShown-firstMessage-shrinked"
            }
          >
            {conversationShown.messages[0].body}
          </p>
          <div className="talent-opportunities-conversationShown-link">
            <div>
              <span>Fiche de poste proposée</span>{" "}
              <span>(Not available - coming soon)</span>
            </div>

            {conversationShown.statut === "process" && (
              <div>
                <div onClick={() => this.setPopUpType(false)}>
                  <i className="fas fa-times" />
                </div>
                <div onClick={() => this.setPopUpType(true)}>Répondre</div>
              </div>
            )}
          </div>
        </div>
        <div className="talent-opportunities-conversationShown-messagesBlock">
          {conversationShown.messages.map(message => {
            if (conversationShown.messages.indexOf(message) !== 0) {
              return (
                <div
                  key={message._id}
                  className="talent-opportunities-conversationShown-messageBlock"
                >
                  <div className="talent-opportunities-conversationShown-picture">
                    {message.action === "received" ? (
                      "clientPhoto"
                    ) : (
                      <img
                        alt="portrait of talent"
                        src={this.state.talentProfile.informations.photo}
                      />
                    )}
                  </div>
                  <div className="talent-opportunities-conversationShown-message">
                    {message.body}
                  </div>
                </div>
              );
            } else return false;
          })}
          <div className="talent-opportunities-conversationShown-messageBlock">
            <div className="talent-opportunities-conversationShown-picture">
              <img
                alt="portrait of talent"
                src={this.state.talentProfile.informations.photo}
              />
            </div>
            <div className="talent-opportunities-conversationShown-message">
              <div contentEditable>Type here...</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleClickObject = () => {
    this.setState({ objectShown: !this.state.objectShown });
  };

  setPopUpType = e => {
    this.setState({ popUpType: e, popUpShown: true });
  };

  cancelPopUp = e => {
    this.setState({ popUpShown: false });
  };

  handleChangePopUp = e => {
    this.setState({ messageValuePopUp: e });
  };

  handleSubmitPopUp = async e => {
    if (this.state.popUpType) {
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/message",
        {
          from: this.props.talentProfile.informations.email,
          to: this.state.contactShownMail,
          message: this.state.messageValuePopUp,
          status: "accepted"
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ popUpShown: false });
      this.getConversations();
    } else {
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/message",
        {
          from: this.props.talentProfile.informations.email,
          to: "ackermanneric@gmail.com",
          message: this.state.messageValuePopUp,
          title: this.state.conversationShown.title,
          companyName: this.state.conversationShown.company
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );

      this.setState({ popUpShown: false });
    }
  };

  render() {
    return (
      <div className="talent-opportunities-content">
        <div className="talent-opportunities-body-container">
          {this.state.popUpShown && (
            <TalentOpportunitiesPopUp
              type={this.state.popUpType}
              cancelPopUp={this.cancelPopUp}
              setMessage={this.handleChangePopUp}
              sendMessage={this.handleSubmitPopUp}
              messageValue={this.state.messageValuePopUp}
            />
          )}
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
                <div className="talent-opportunities-leftBlock-contactBlock-list-contact">
                  {this.displayOffer()}
                </div>
              </div>
            </div>
          </div>
          <div className="talent-opportunities-rightBlock">
            {this.state.conversationShown &&
              this.displayConversation(this.state.conversationShown)}
          </div>
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("talent/opportunities");
    this.getConversations();
    this.getTalentProfile();
  }
}
