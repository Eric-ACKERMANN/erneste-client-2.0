import React from "react";
import axios from "axios";
import ClientInformation from "../../components/ClientInformation/index";
import ClientUsers from "../../components/ClientUsers/index";
import PopUpClient from "../../components/PopUpClient/index";
import "./index.css";

/* Page to see client details, talents for client and add users */

export default class ClientforAdmin extends React.Component {
  state = {
    data: {
      name: "",
      field: {},
      size: "",
      users: [],
      activationKey: "",
      email: "",
      logo: ""
    },
    popup: false,
    talentSearch: "",
    hoverContact: false,
    hoverMessage: null
  };

  setPopUp = () => {
    this.setState({ popup: !this.state.popup });
  };

  handleUsers = user => {
    const users = this.state.data.users;
    users.push(user);
    this.setState({ users });
  };

  setPhoto = async files => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/client/update",
      {
        id: this.state.data._id,
        client: { logo: files }
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ redirect: true });
  };

  setSearch = e => {
    this.setState({ talentSearch: e.target.value });
  };

  handleClickDeleteUsers = async id => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/user/delete",
      {
        id: id
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client/" +
        this.props.match.params.id,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ data: response.data });
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

  hoverOn = message => {
    this.setState({ hoverContact: true, hoverMessage: message });
  };

  hoverOff = () => {
    this.setState({ hoverContact: false, hoverMessage: null });
  };

  render() {
    return (
      <div className="client-for-admin-container">
        <ClientInformation
          clientName={this.state.data.name}
          clientField={this.state.data.field.name}
          clientSize={this.state.data.size}
          setPhoto={this.setPhoto}
          clientLogo={this.state.data.logo}
          clientUsers={this.state.data.users}
          hoverOn={this.hoverOn}
          hoverOff={this.hoverOff}
          renderStars={this.renderStars}
          talentSearch={this.state.talentSearch}
          setSearch={this.setSearch}
          hoverContact={this.state.hoverContact}
          hoverMessage={this.state.hoverMessage}
        />
        <ClientUsers
          users={this.state.data.users}
          setPopUp={this.setPopUp}
          activationKey={this.state.data.activationKey}
          handleClickDeleteUsers={this.handleClickDeleteUsers}
        />
        {this.state.popup && <div className="client-for-admin-overlay" />}
        {this.state.popup && (
          <PopUpClient
            setPopUp={this.setPopUp}
            clientEmail={this.state.data.email}
            token={this.props.token}
            handleUsers={this.handleUsers}
          />
        )}
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("admin/client");
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/client/" +
        this.props.match.params.id,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ data: response.data });
  }
}
