import React from "react";
import axios from "axios";
import "./index.css";
export default class AdminTalent extends React.Component {
  state = {
    messages: null
  };

  delete = e => {
    const messagesArray = this.state.messages;
    const messageToDelete = [this.state.messages[e.target.id]._id];
    messagesArray.splice(e.target.id, 1);
    this.setState({ messages: messagesArray });
    axios.post(
      "https://erneste-server-improved.herokuapp.com/admin-messages/delete",
      {
        messages: messageToDelete
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
  };

  render() {
    if (this.state.messages === null) {
      return (
        <div className="admin-talent-container">
          <div className="admin-talent-liste">Loading</div>
        </div>
      );
    }

    const messageArray = this.state.messages.map((item, index) => {
      return (
        <div key={item._id} className="admin-talent-message">
          <div>
            <span>Profile : </span>
            <span>{item.firstName} </span>
            <span>{item.lastName}</span>
          </div>

          <div>
            <span>Email : </span>
            {item.email}
          </div>
          <div>
            <span>Mot de passe : </span>
            {item.password}
          </div>
          <div
            id={index}
            className="admin-talent-delete-button"
            onClick={this.delete}
          >
            X
          </div>
        </div>
      );
    });
    messageArray.reverse();
    return (
      <div className="admin-talent-container">
        {this.state.messages.length > 0 ? (
          <div className="admin-talent-liste">{messageArray}</div>
        ) : (
          <div className="admin-talent-liste">Aucun message</div>
        )}
      </div>
    );
  }

  async componentDidMount() {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/admin-messages",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ messages: response.data });
  }
}
