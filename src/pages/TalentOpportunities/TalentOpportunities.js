import React from "react";
import axios from "axios";
import "./index.css";

import TalentOpportunitiesPopUp from "../../components/TalentOpportunities_PopUp";
import TalentOpportunitiesConversations from "../../components/TalentOpportunities_Conversations";
import TalentOpportunitiesMessages from "../../components/TalentOpportunities_Messages";
import TalentOpportunitiesTitles from "../../components/TalentOpportunities_Titles";

export default class TalentOpportunities extends React.Component {
  state = {
    isLoading: true,
    talentProfile: null,
    titleList: ["Entreprises", "Objet", "Date de réception"],
    conversations: [],
    contactShownMail: null,
    conversationShown: null,
    conversationShownPosition: 0,
    objectShown: true,
    popUpShown: null,
    popUpType: null,
    popUpError: { rating: false, value: false },
    messageValuePopUp: "",
    textAreaAnswer: "",
    textAreaHeight: 20,
    textAreaHeightMemory: 60,
    offerRate: { rating: 0, type: "temp" }
  };

  offerRating = (index, type) => {
    if (
      (this.state.offerRate.type === "temp" ||
        this.state.offerRate.type === "leave") &&
      type === "temp"
    ) {
      this.setState({ offerRate: { rating: index, type: type } });
      return;
    }
    if (this.state.offerRate.type === "temp" && type === "leave") {
      this.setState({ offerRate: { rating: index, type: type } });
      return;
    }
    if (type === "set") {
      this.setState({ offerRate: { rating: index, type: type } });
      let popUpError = { ...this.state.popUpError };
      if (index !== 0) {
        popUpError.rating = false;
      }
      this.setState({ popUpError: popUpError });
    }
  };

  setDate = conversations => {
    // We sort the array of conversations by lastUpdate
    // The date we get is type "29 05 2019, 15 05 98"
    // We want to show 29/05/2019, but the sort has to be on hour minutes secondes too
    // 1. change of the 29 05 2019, 15 05 98 into [[29,05,2019],[15,05,98]]
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
    return conversations;
  };

  getConversations = async () => {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    // Transform date type 20 05 2019, 05 45 45 into 20/05/2109, plus sort the array per last conversation
    let conversations = this.setDate(response.data);

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

  handleClickConversation = async conversation => {
    // On détermine la position de la conversations
    let position = this.state.conversations.indexOf(conversation);

    const response = await axios.get(
      `https://erneste-server-improved.herokuapp.com/client/${
        conversation.company
      }`,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    conversation.companyLogo = response.data.logo;

    this.setState({
      conversationShown: conversation,
      contactShownMail: conversation.contactMail,
      conversationShownPosition: position
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
    let popUpError = { ...this.state.popUpError };
    if (e !== "") {
      popUpError.value = false;
    }
    this.setState({ popUpError: popUpError });
  };

  handleSubmitPopUp = async e => {
    if (
      this.state.messageValuePopUp !== "" &&
      this.state.offerRate.rating !== 0
    ) {
      if (this.state.popUpType) {
        await axios.post(
          "https://erneste-server-improved.herokuapp.com/user/message",
          {
            from: this.state.talentProfile.informations.email,
            to: this.state.contactShownMail,
            message: this.state.messageValuePopUp,
            status: "accepted",
            rating: this.state.offerRate.rating.toString()
          },
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
        this.setState({ popUpShown: false });

        const response2 = await axios.get(
          "https://erneste-server-improved.herokuapp.com/user/message/get",
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );

        this.setState({
          conversations: this.setDate(response2.data),
          conversationShown:
            response2.data[this.state.conversationShownPosition]
        });

        await axios.post(
          "https://erneste-server-improved.herokuapp.com/client/update/rating",
          {
            id: this.state.conversationShown.company
          },
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
      } else {
        // The status of the conversation need to be updated for the receiver and the sender into negativ
        await axios.post(
          "https://erneste-server-improved.herokuapp.com/user/message",
          {
            from: this.state.talentProfile.informations.email,
            to: this.state.contactShownMail,
            message: this.state.messageValuePopUp,
            status: "declined",
            rating: this.state.offerRate.rating.toString()
          },
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
        this.setState({ popUpShown: false });

        const response2 = await axios.get(
          "https://erneste-server-improved.herokuapp.com/user/message/get",
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );

        await axios.post(
          "https://erneste-server-improved.herokuapp.com/client/update/rating",
          {
            id: this.state.conversationShown.company
          },
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );

        this.setState({
          conversations: this.setDate(response2.data),
          conversationShown:
            response2.data[this.state.conversationShownPosition]
        });

        await axios.post(
          "https://erneste-server-improved.herokuapp.com/client/update",
          {
            id: this.state.conversationShown.company
          },
          { headers: { authorization: `Bearer ${this.props.token}` } }
        );
      }
    } else {
      let popUpError = { ...this.state.popUpError };
      if (this.state.messageValuePopUp === "") {
        popUpError.value = true;
      } else {
        popUpError.value = false;
      }
      if (this.state.offerRate.rating === 0) {
        popUpError.rating = true;
      } else {
        popUpError.rating = false;
      }
      this.setState({
        popUpError: popUpError
      });
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
        textAreaHeightMemory: 60
      });
    }

    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/user/message/get",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    this.setState({
      conversations: this.setDate(response2.data),
      conversationShown: response2.data[this.state.conversationShownPosition]
    });
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
      conversations: this.setDate(response2.data),
      conversationShown: response2.data[this.state.conversationShownPosition]
    });
  };

  renderStars(item) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < item.rating) {
        stars.push(<i key={i} className="fas fa-star" />);
      } else {
        stars.push(<i key={i} className="far fa-star" />);
      }
    }
    return (
      <div style={{ flexDirection: "row", alignItems: "center" }}>{stars}</div>
    );
  }

  render() {
    return (
      <div className="talent-opportunities-content">
        <div className="talent-opportunities-body-container">
          {this.state.popUpShown && (
            <TalentOpportunitiesPopUp
              type={this.state.popUpType}
              cancelPopUp={this.cancelPopUp}
              error={this.state.popUpError}
              setMessage={this.handleChangePopUp}
              sendMessage={this.handleSubmitPopUp}
              messageValue={this.state.messageValuePopUp}
              offerRating={this.offerRating}
              offerRate={this.state.offerRate}
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
                <TalentOpportunitiesTitles titleList={this.state.titleList} />
                <TalentOpportunitiesConversations
                  conversations={this.state.conversations}
                  handleClickConversation={this.handleClickConversation}
                />
              </div>
            </div>
          </div>
          <div className="talent-opportunities-rightBlock">
            {this.state.conversationShown && (
              <TalentOpportunitiesMessages
                conversationShown={this.state.conversationShown}
                objectShown={this.state.objectShown}
                textAreaAnswer={this.state.textAreaAnswer}
                textAreaHeight={this.state.textAreaHeight}
                talentProfile={this.state.talentProfile}
                handleClickMessage={this.handleClickMessage}
                handleClickAnswer={this.handleClickAnswer}
                handleClickObject={this.handleClickObject}
                handleClickDeleteMessage={this.handleClickDeleteMessage}
                handleChangeAnswer={this.handleChangeAnswer}
                handleKeyUpTextarea={this.handleKeyUpTextarea}
                handleSubmitAnswer={this.handleSubmitAnswer}
                handleBlurAnswer={this.handleBlurAnswer}
                setPopUpType={this.setPopUpType}
                renderStars={this.renderStars}
              />
            )}
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
