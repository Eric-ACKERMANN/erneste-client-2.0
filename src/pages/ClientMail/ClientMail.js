import React from "react";
import axios from "axios";
import "./index.css";
import ClientMailTitles from "../../components/ClientMail_Titles";
import ClientMailConversations from "../../components/ClientMail_Conversations";
import ClientMailMessages from "../../components/ClientMail_Messages/ClientMail_Messages";

export default class ClientMail extends React.Component {
  state = {
    isLoading: true,
    titleList: ["Talent", "Objet", "Statut"],
    talentList: null,
    conversations: [],
    clientData: null,
    conversationShown: null,
    contactShown: null,
    contactShownPosition: null,
    objectShown: true,
    textAreaAnswer: "",
    textAreaHeight: 20,
    textAreaMemory: 60
  };

  getList = async () => {
    this.setState({ isLoading: true });
    try {
      const getTalent = () => {
        return axios.get(
          `https://erneste-server-improved.herokuapp.com/talent/conversation/${
            this.props.userData.id
          }`,
          {
            headers: { authorization: `Bearer ${this.props.token}` }
          }
        );
      };

      const getMessage = () => {
        return axios.get(
          "https://erneste-server-improved.herokuapp.com/user/message/get",
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
      };

      const getClient = () => {
        return axios.get(
          "https://erneste-server-improved.herokuapp.com/client/" +
            this.props.match.params.id,
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
      };

      axios.all([getTalent(), getMessage(), getClient()]).then(
        axios.spread((talents, messages, client) => {
          this.setState({
            talentList: talents.data,
            conversations: messages.data,
            clientData: client.data,
            isLoading: false
          });
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  handleClickConversation = conversation => {
    this.setState({ conversationShown: conversation });
    // We look for the talent in the talentList
    if (this.state.talentList) {
      let position = this.state.talentList
        .map(element => {
          return element.informations.email;
        })
        .indexOf(conversation.contactId);

      this.setState({
        contactShown: this.state.talentList[position],
        contactShownPosition: position
      });
    }
  };

  handleChangeMessageAnswer = e => {
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

  handleClickDeleteMessage = async messageDelete => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/message/delete",
      {
        conversation: this.state.conversationShown._id,
        message: messageDelete._id
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      conversations: response2.data,
      conversationShown: response2.data[this.state.contactShownPosition]
    });
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
        textAreaHeightMemory: 60
      });
    }
    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      conversations: response2.data,
      conversationShown: response2.data[this.state.contactShownPosition]
    });
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
                <ClientMailTitles titleList={this.state.titleList} />
                <ClientMailConversations
                  conversations={this.state.conversations}
                  handleClickConversation={this.handleClickConversation}
                />
              </div>
            </div>
          </div>
          <ClientMailMessages
            contactShown={this.state.contactShown}
            conversationShown={this.state.conversationShown}
            objectShown={this.state.objectShown}
            clientData={this.state.clientData}
            textAreaAnswer={this.state.textAreaAnswer}
            textAreaHeight={this.state.textAreaHeight}
            handleClickObject={this.handleClickObject}
            handleClickMessage={this.handleClickMessage}
            handleClickDeleteMessage={this.handleClickDeleteMessage}
            handleClickAnswer={this.handleClickAnswer}
            handleBlurAnswer={this.handleBlurAnswer}
            handleChangeMessageAnswer={this.handleChangeMessageAnswer}
            handleKeyUpTextarea={this.handleKeyUpTextarea}
            handleSubmitAnswer={this.handleSubmitAnswer}
          />
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("client/mail");
    this.getList();
  }
}
