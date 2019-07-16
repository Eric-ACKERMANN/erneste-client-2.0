import React from "react";
import axios from "axios";
import "./index.css";

import PopUpClientWelcome from "../../components/ClientWelcome_PopUp";
import SelectedTalent from "../../components/ClientWelcome_SelectedTalent";
import Titles from "../../components/ClientWelcome_Titles";
import TalentList from "../../components/ClientWelcome_TalentList";

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

  getData = async () => {
    const getClient = () => {
      return axios.get(
        "https://erneste-server-improved.herokuapp.com/client/" +
          this.props.match.params.id,
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
    };

    const getTalent = () => {
      return axios.get(
        `https://erneste-server-improved.herokuapp.com/talent/sector/${
          this.props.userData.clientId
        }`,
        {
          headers: { authorization: `Bearer ${this.props.token}` }
        }
      );
    };

    axios.all([getTalent(), getClient()]).then(
      axios.spread((talents, client) => {
        this.setState({
          clientData: client.data,
          talentList: talents.data,
          isLoading: false
        });
      })
    );
  };

  // Function that select a talent
  handleClickTalent = (element, selectedTalentList) => {
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

    await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/message",
      {
        from: mailSender,
        to: talentMail,
        message: this.state.popUpMessageInputValue,
        title: this.state.popUpObjectInputValue,
        companyName: this.state.clientData.name,
        company: this.state.clientData._id
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
                <Titles titleList={this.state.titleList} />
                <TalentList
                  talentList={this.state.talentList}
                  handleClickTalent={this.handleClickTalent}
                  talentShown={this.state.talentShown}
                />
              </div>
            </div>
          </div>
          <div className="client-welcome-rightBlock">
            {this.state.talentShown.length > 0 && (
              <SelectedTalent
                talentShown={this.state.talentShown}
                positionShown={this.state.positionShown}
                positionShownDown={this.positionShownDown}
                positionShownUp={this.positionShownUp}
                hoverOn={this.hoverOn}
                hoverOff={this.hoverOff}
                togglePopUp={this.togglePopUp}
                hoverContact={this.state.hoverContact}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this.props.setPageActive("client");
    this.getData();
  }
}
