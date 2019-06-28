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
    popup: false
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
    console.log("ce qu'on envoie", {
      id: this.state.data._id,
      client: { logo: files }
    });
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
