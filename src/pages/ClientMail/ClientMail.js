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
    contactShown: null,
    objectShown: true,
    textAreaAnswer: "",
    textAreaHeight: 20,
    textAreaMemory: 60
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

  getClientData = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client/" +
        this.props.match.params.id,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ clientData: response.data, isLoading: false });
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

  displayContacts = conversations => {
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
            {conversation.status === "accepted" && <span>Accepté</span>}
            {conversation.status === "process" && <span>En Cours</span>}
            {conversation.status === "declined" && <span>Refusé</span>}
          </li>
        </ul>
      );
    });
  };

  handleChangeAnswer = e => {
    this.setState({ textAreaAnswer: e });
  };

  handleClickObject = () => {
    this.setState({ objectShown: !this.state.objectShown });
  };

  handleClickAnswer = e => {
    this.setState({
      textAreaHeight: this.state.textAreaHeightMemory
    });
  };

  handleBlurAnswer = e => {
    if (this.state.textAreaAnswer !== "") {
      this.setState(prevState => {
        return {
          textAreaHeightMemory: prevState.textAreaHeight,
          textAreaHeight: 60
        };
      });
    } else {
      this.setState(prevState => {
        return {
          textAreaHeightMemory: prevState.textAreaHeight,
          textAreaHeight: 20
        };
      });
    }
  };

  handleKeyUpTextarea = e => {
    if (e.clientHeight < e.scrollHeight) {
      this.setState({ textAreaHeight: e.scrollHeight });
    }
  };

  handleClickMessage = message => {
    let conversations = [...this.state.conversations];
    let posC = conversations.indexOf(this.state.conversationShown);
    let posM = conversations[posC].messages.indexOf(message);
    conversations[posC].messages[posM].displayedFull = !conversations[posC]
      .messages[posM].displayedFull;
    this.setState({ conversations: conversations });
  };

  handleSubmitAnswer = async () => {
    // We find the mail of the sender
    const mailSender = this.state.clientData.users[
      this.state.clientData.users
        .map(e => {
          return e._id;
        })
        .indexOf(this.props.userData.id)
    ].email;

    const response = await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/message",
      {
        from: mailSender,
        to: this.state.contactShown.informations.email,
        message: this.state.textAreaAnswer
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    if (response.data === "Message sent") {
      this.setState({
        textAreaAnswer: "",
        textAreaHeight: 20,
        textAreaHeightMemory: 60,
        messageSent: true
      });
    }
    this.getConversations();
  };

  displayConversation = (conversationShown, contactShown) => {
    return (
      <div className="client-mail-conversationShown-container">
        <div className="client-mail-conversationShown-name">
          {`${contactShown.informations.firstName} ${
            contactShown.informations.lastName
          }`}
        </div>
        <div className="client-mail-conversationShown-title-block">
          <div className="client-mail-conversationShown-object">
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
                ? "client-mail-conversationShown-firstMessage"
                : "client-mail-conversationShown-firstMessage-shrinked"
            }
          >
            {conversationShown.messages[0].body}
          </p>
          <div className="client-mail-conversationShown-link">
            <span>Fiche de poste proposée</span>{" "}
            <span>(Not available - coming soon)</span>
          </div>
        </div>

        {/* Message display*/}
        {conversationShown.status === "accepted" && (
          <div>
            {conversationShown.messages.map(message => {
              if (conversationShown.messages.indexOf(message) !== 0) {
                return (
                  <div
                    key={message._id}
                    className="client-mail-conversationShown-messageBlock"
                    onClick={() => {
                      this.handleClickMessage(message);
                    }}
                  >
                    <div className="client-mail-conversationShown-picture">
                      {message.action === "received" ? (
                        <img
                          alt="portrait of talent"
                          src={this.state.contactShown.informations.photo}
                        />
                      ) : (
                        <img
                          alt="logo of company"
                          src={this.state.clientData.logo}
                        />
                      )}
                    </div>
                    <div
                      className={
                        message.displayedFull
                          ? "client-mail-conversationShown-message"
                          : "client-mail-conversationShown-message messageshrink"
                      }
                    >
                      {message.body}
                    </div>
                    <i
                      className={
                        message.displayedFull
                          ? "far fa-minus-square"
                          : "far fa-plus-square"
                      }
                    />
                  </div>
                );
              } else return false;
            })}

            <div className="client-mail-conversationShown-messageBlock">
              <div className="client-mail-conversationShown-picture-company">
                <img
                  className="client-mail-logo-company"
                  alt="logo of company"
                  src={this.state.clientData.logo}
                />
              </div>
              <div className="client-mail-conversationShown-message">
                <textarea
                  id="textArea"
                  value={this.state.textAreaAnswer}
                  onChange={event =>
                    this.handleChangeAnswer(event.target.value)
                  }
                  placeholder="Ecrivez votre réponse ici..."
                  onClick={this.handleClickAnswer}
                  onBlur={this.handleBlurAnswer}
                  onKeyUp={() => {
                    this.handleKeyUpTextarea(
                      document.getElementById("textArea")
                    );
                  }}
                  style={{ height: this.state.textAreaHeight }}
                />
              </div>
            </div>
            <div className="client-mail-conversationShown-buttons">
              {this.state.textAreaAnswer !== "" ? (
                <div
                  className="client-mail-conversationShown-send"
                  onClick={() => this.handleSubmitAnswer()}
                >
                  Envoyer
                </div>
              ) : (
                <div className="client-mail-conversationShown-send-disabled">
                  Envoyer
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  handleClickObject = () => {
    this.setState({ objectShown: !this.state.objectShown });
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
                    this.displayContacts(this.state.conversations)}
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
    this.getClientData();
  }
}
