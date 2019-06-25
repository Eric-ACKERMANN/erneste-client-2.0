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
      email: ""
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

  render() {
    return (
      <div className="client-for-admin-container">
        <ClientInformation
          clientName={this.state.data.name}
          clientField={this.state.data.field.name}
          clientSize={this.state.data.size}
        />
        <ClientUsers
          users={this.state.data.users}
          setPopUp={this.setPopUp}
          activationKey={this.state.data.activationKey}
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
