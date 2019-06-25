import React from "react";
import axios from "axios";
import box from "../../features/icons/check_24px.svg";
import "./index.css";

export default class ClientMail extends React.Component {
  state = {
    isLoading: true,
    titleList: ["Talent", "Objet", "Statut"],
    talentList: null,
    conversations: null,
    conversationShown: null,
    contactShown: null
  };

  getConversations = async () => {
    this.setState({ isLoading: true });
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    await this.setState({ conversations: response.data });
    this.setState({ isLoading: false });
  };

  getTalentList = async () => {
    this.setState({ isLoading: true });
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/talent",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    await this.setState({ talentList: response.data });
    this.setState({ isLoading: false });
  };

  displayTitle = titleList => {
    return (
      <ul>
        <li className="client-mail-leftBlock-contactBlock-list-checkBox">
          <img
            className="client-mail-contactblock-box"
            src={box}
            alt="box cochée"
          />
        </li>
        {titleList.map((element, index) => {
          let columnClass = "";
          if (titleList.indexOf(element) === 0) {
            columnClass = "client-mail-leftBlock-contactBlock-list-talent";
          }
          if (titleList.indexOf(element) === 1) {
            columnClass = "client-mail-leftBlock-contactBlock-list-objet";
          }
          if (titleList.indexOf(element) === 2) {
            columnClass = "client-mail-leftBlock-contactBlock-list-statut";
          }

          return (
            <li key={index} className={columnClass}>
              {element}
            </li>
          );
        })}
      </ul>
    );
  };

  displayMessage = conversations => {
    return conversations.map(conversation => {
      return (
        <ul
          onClick={() => {
            this.handleContactClick(conversation);
          }}
        >
          <li className="client-mail-leftBlock-contactBlock-list-checkBox">
            <img
              className="client-mail-contactblock-box"
              src={box}
              alt="box cochée"
            />
          </li>
          <li className="client-mail-leftBlock-contactBlock-list-talent">{`${
            conversation.contactFirstName
          } ${conversation.contactLastName}`}</li>
          <li className="client-mail-leftBlock-contactBlock-list-objet">
            {conversation.title}
          </li>
          <li className="client-mail-leftBlock-contactBlock-list-statut">
            Accepté
          </li>
        </ul>
      );
    });
  };

  handleContactClick = conversation => {
    this.setState({ conversationShown: conversation });
    // We look for the talent in the talentList
    let position = this.state.talentList
      .map(element => {
        return element.informations.email;
      })
      .indexOf(conversation.contactId);

    this.setState({ contactShown: this.state.talentList[position] });
  };

  displayConversation = (conversationShown, contactShown) => {
    return (
      <div className="client-mail-conversationShown-container">
        <div className="client-mail-conversationShown-name">
          {`${contactShown.informations.firstName} ${
            contactShown.informations.lastName
          }`}
        </div>
        <div className="client-mail-conversationShown-object">
          {conversationShown.title}
        </div>
        <div className="client-mail-conversationShown-firstMessage">
          {conversationShown.messages[0].body}
        </div>
        <div className="client-mail-conversationShown-link">
          Fiche de poste proposée
        </div>
        <div className="client-mail-conversationShown-messagesBlock">
          {conversationShown.messages.map(message => {
            return (
              <div className="client-mail-conversationShown-messageBlock">
                <div className="client-mail-conversationShown-picture">
                  {conversationShown.action === "received"
                    ? "talentPhoto"
                    : "clientPhoto"}
                </div>
                <div className="client-mail-conversationShown-message">
                  {message.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    /* Test of Loading... */

    if (this.state.isLoading === true) {
      return "En cours de chargement....";
    }

    return (
      <div className="client-mail-content">
        <div className="client-mail-body-container">
          <div className="client-mail-leftBlock">
            <div className="client-mail-leftBlock-title">Messagerie</div>
            <div className="client-mail-leftBlock-contactBlock">
              <div className="client-mail-leftBlock-contactBlock-title">
                Talents contactés
              </div>
              <div className="client-mail-leftBlock-contactBlock-searchLine">
                <div className="client-mail-leftBlock-contactBlock-searchLine-searchBlock">
                  <i className="fas fa-search" />
                  <input placeholder="Rechercher un profil" />
                </div>
              </div>
              <div className="client-mail-leftBlock-contactBlock-list">
                <div className="client-mail-leftBlock-contactBlock-list-title">
                  {this.displayTitle(this.state.titleList)}
                </div>
                <div className="client-mail-leftBlock-contactBlock-list-contact">
                  {this.state.conversations &&
                    this.displayMessage(this.state.conversations)}
                </div>
              </div>
            </div>
          </div>
          <div className="client-mail-rightBlock">
            {this.state.contactShown &&
              this.state.conversationShown &&
              this.displayConversation(
                this.state.conversationShown,
                this.state.contactShown
              )}
          </div>
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("client/mail");
    this.getConversations();
    this.getTalentList();
  }
}
