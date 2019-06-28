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
    messageValuePopUp: "",
    textAreaAnswer: "",
    textAreaHeight: 20,
    textAreaHeightMemory: 60,
    messageSent: false
  };

  getConversations = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    // We sort the array of conversations by lastUpdate
    // The date we get is type "29 05 2019, 15 05 98"
    // We want to show 29/05/2019, but the sort has to be on hour minutes secondes too
    // 1. change of the 29 05 2019, 15 05 98 into [[29,05,2019],[15,05,98]]
    let conversations = response.data;
    for (let i = 0; i < conversations.length; i++) {
      if (typeof conversations[i].messages[0].date === "string") {
        conversations[i].messages[0].date = conversations[
          i
        ].messages[0].date.split(",");
        conversations[i].messages[0].date[0] = conversations[
          i
        ].messages[0].date[0]
          .trim()
          .split(" ");
        conversations[i].messages[0].date[1] = conversations[
          i
        ].messages[0].date[1]
          .trim()
          .split(" ");
      }
    }

    for (let i = 2; i > -1; i--) {
      conversations.sort((a, b) => {
        return b.messages[0].date[1][i] - a.messages[0].date[1][i]; // sort seconds > minutes > hour
      });
    }
    for (let i = 0; i < 3; i++) {
      conversations.sort((a, b) => {
        return b.messages[0].date[0][i] - a.messages[0].date[0][i]; // sort day > month > year
      });
    }
    // Change messages[0].date key from [[29,05,2019],[15,05,98]] to 29/05/2019
    conversations.forEach(e => {
      return (e.messages[0].date = e.messages[0].date[0].join("/"));
    });

    // On enlève les conversations avec l'admin (suite aux messages refusés)
    conversations.filter(e => {
      return e.contactId !== "ackermanneric@gmail.com";
    });

    //  On rajoute une key height valant "shrink" ou "deploy" à chaque message
    conversations.forEach(e => {
      e.messages.forEach(m => {
        m.displayedFull = false;
      });
    });

    this.setState({
      conversations: conversations,
      conversationShown: conversations[0],
      isLoading: false
    });
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
      console.log("ce qu'on envoie", {
        from: this.state.talentProfile.informations.email,
        to: this.state.contactShownMail,
        message: this.state.messageValuePopUp,
        status: "accepted"
      });
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/message",
        {
          from: this.state.talentProfile.informations.email,
          to: this.state.contactShownMail,
          message: this.state.messageValuePopUp,
          status: "accepted"
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ popUpShown: false });
      this.getConversations();
    } else {
      // The status of the conversation need to be updated for the receiver and the sender into negativ
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/user/message",
        {
          from: this.state.talentProfile.informations.email,
          to: this.state.contactShownMail,
          message: this.state.messageValuePopUp,
          status: "declined"
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ popUpShown: false });
      this.getConversations();
    }
  };

  handleChangeAnswer = e => {
    this.setState({ textAreaAnswer: e });
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

  handleSubmitAnswer = async () => {
    const response = await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/message",
      {
        from: this.state.talentProfile.informations.email,
        to: this.state.contactShownMail,
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

  handleClickMessage = message => {
    let conversations = [...this.state.conversations];
    let posC = conversations.indexOf(this.state.conversationShown);
    let posM = conversations[posC].messages.indexOf(message);
    conversations[posC].messages[posM].displayedFull = !conversations[posC]
      .messages[posM].displayedFull;
    this.setState({ conversations: conversations });
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

            {conversationShown.status === "process" && (
              <div>
                <div onClick={() => this.setPopUpType(false)}>
                  <i className="fas fa-times" />
                </div>
                <div onClick={() => this.setPopUpType(true)}>Répondre</div>
              </div>
            )}
          </div>
        </div>

        {conversationShown.status === "declined" && (
          <div className="talent-opportunities-conversationShown-declined">
            Vous avez refusé cette offre, vous ne pouvez plus y répondre
          </div>
        )}
        {conversationShown.status === "accepted" && (
          <div>
            {conversationShown.messages.map(message => {
              if (conversationShown.messages.indexOf(message) !== 0) {
                return (
                  <div
                    key={message._id}
                    className="talent-opportunities-conversationShown-messageBlock"
                    onClick={() => {
                      this.handleClickMessage(message);
                    }}
                  >
                    <div className="talent-opportunities-conversationShown-picture">
                      {message.action === "received" ? (
                        <img
                          className="talent-opportunities-logo-company"
                          alt="logo of company"
                          src={conversationShown.companyLogo}
                        />
                      ) : (
                        <img
                          className="talent-opportunities-picture-talent"
                          alt="portrait of talent"
                          src={
                            this.state.talentProfile
                              ? this.state.talentProfile.informations.photo
                              : "Photo talent"
                          }
                        />
                      )}
                    </div>
                    <div
                      className={
                        message.displayedFull
                          ? "talent-opportunities-conversationShown-message"
                          : "talent-opportunities-conversationShown-message messageshrink"
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

            <div className="talent-opportunities-conversationShown-messageBlock">
              <div className="talent-opportunities-conversationShown-picture">
                <img
                  className="talent-opportunities-picture-talent"
                  alt="portrait of talent"
                  src={
                    this.state.talentProfile
                      ? this.state.talentProfile.informations.photo
                      : "Photo talent"
                  }
                />
              </div>
              <div className="talent-opportunities-conversationShown-message">
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
            <div className="talent-opportunities-conversationShown-buttons">
              {this.state.textAreaAnswer !== "" ? (
                <div
                  className="talent-opportunities-conversationShown-send"
                  onClick={() => this.handleSubmitAnswer()}
                >
                  Envoyer
                </div>
              ) : (
                <div className="talent-opportunities-conversationShown-send-disabled">
                  Envoyer
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
