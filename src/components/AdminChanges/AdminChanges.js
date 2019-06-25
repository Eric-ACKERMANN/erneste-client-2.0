import React from "react";
import axios from "axios";
import "./index.css";

export default class AdminChanges extends React.Component {
  state = {
    tag: [],
    sector: [],
    title: [],
    loadingtag: true,
    loadingsector: true,
    loadingtitle: true,
    status: 1,
    itemToDisplayName: "",
    itemToDisplayId: "",
    itemToDisplayType: "",
    elementstodelete: [],
    sectorToDelete: [],
    titleToDelete: [],
    name: "",
    newTag: "",
    newTagType: "",
    newTagName: "",
    tagTypeToDisplay: false,
    newSector: null,
    newTitle: null,
    statusInput: null,
    setType: false
  };

  onButtonClick = e => {
    this.setState({
      status: Number(e.target.id),
      itemToDisplayName: "",
      itemToDisplayId: "",
      itemToDisplayType: ""
    });
  };

  setType = () => {
    this.setState({ setType: !this.state.setType });
  };

  typeChange = e => {
    this.setState({ itemToDisplayType: e.target.id, setType: false });
  };

  removeSelectedTag = id => {
    const deleteArray = this.state.elementstodelete;
    deleteArray.splice(deleteArray.indexOf(id), 1);
    this.setState({ elementstodelete: deleteArray });
  };

  removeSelectedSector = id => {
    const deleteArray = this.state.sectorToDelete;
    deleteArray.splice(deleteArray.indexOf(id), 1);
    this.setState({ sectorToDelete: deleteArray });
  };

  removeSelectedTitle = id => {
    const deleteArray = this.state.titleToDelete;
    deleteArray.splice(deleteArray.indexOf(id), 1);
    this.setState({ titleToDelete: deleteArray });
  };
  /* DELETE */

  /* Fonction to select tags to delete  */
  onSelectedTag = id => {
    const newTab = [...this.state.elementstodelete];
    newTab.push(id);
    this.setState({ elementstodelete: newTab });
  };

  onSelectedSector = id => {
    const newTab = [...this.state.sectorToDelete];
    newTab.push(id);
    this.setState({ sectorToDelete: newTab });
  };

  onSelectedTitle = id => {
    const newTab = [...this.state.titleToDelete];
    newTab.push(id);
    this.setState({ titleToDelete: newTab });
  };

  setName = e => {
    this.setState({ itemToDisplayName: e.target.value });
  };
  /* Function to delete */
  deleteTag = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/tag/delete",
      { tags: this.state.elementstodelete },
      {
        headers: { authorization: `Bearer ${this.props.token}` }
      }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      tag: response.data,
      loadingtag: false
    });
  };

  deleteSector = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/sector/delete",
      { sectors: this.state.sectorToDelete },
      {
        headers: { authorization: `Bearer ${this.props.token}` }
      }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      sector: response.data,
      loadingtag: false
    });
  };

  deleteTitle = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/title/delete",
      { titles: this.state.titleToDelete },
      {
        headers: { authorization: `Bearer ${this.props.token}` }
      }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/title",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      title: response.data,
      loadingtag: false
    });
  };

  addTags = async () => {
    if (!this.state.itemToDisplayId) {
      return;
    }
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/tag/create",
      {
        name: this.state.itemToDisplayName,
        type: this.state.itemToDisplayType
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      tag: response.data,
      loadingtag: false,
      itemToDisplayName: "",
      itemToDisplayType: ""
    });
  };

  addSector = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/sector/create",
      {
        name: this.state.itemToDisplayName
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      sector: response.data,
      loadingtag: false,
      itemToDisplayName: "",
      itemToDisplayType: ""
    });
  };

  addTitle = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/title/create",
      {
        name: this.state.itemToDisplayName
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/title",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      title: response.data,
      loadingtag: false,
      itemToDisplayName: "",
      itemToDisplayType: ""
    });
  };

  modifyTags = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/tag/update",
      {
        tag: {
          id: this.state.itemToDisplayId,
          name: this.state.itemToDisplayName,
          type: this.state.itemToDisplayType
        }
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      tag: response.data,
      loadingtag: false
    });
  };

  modifySector = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/sector/update",
      {
        sector: {
          id: this.state.itemToDisplayId,
          name: this.state.itemToDisplayName
        }
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      sector: response.data,
      loadingtag: false
    });
  };

  modifyTitle = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/title/update",
      {
        title: {
          id: this.state.itemToDisplayId,
          name: this.state.itemToDisplayName
        }
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/title",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      title: response.data,
      loadingtag: false
    });
  };

  /* MODIFY */

  /* fonction to select item to modify */
  onSelectedItem = e => {
    this.setState({
      itemToDisplayName: e.name,
      itemToDisplayId: e._id,
      itemToDisplayType: e.type,
      statusInput: null
    });
  };

  render() {
    return (
      <div className="admin-changes-container">
        <div className="admin-changes-left-container">
          <div
            id="1"
            className="admin-changes-button"
            onClick={e => this.onButtonClick(e)}
          >
            Tags
          </div>
          <div
            id="2"
            className="admin-changes-button"
            onClick={e => this.onButtonClick(e)}
          >
            Secteurs
          </div>
          <div
            id="3"
            className="admin-changes-button"
            onClick={e => this.onButtonClick(e)}
          >
            Fonctions
          </div>
        </div>

        <div className="admin-changes-right-container">
          <div className="admin-changes-items-list">
            {this.state.status === 1
              ? this.state.tag.map(item => {
                  return (
                    <div
                      className="admin-changes-items-to-change"
                      key={item._id}
                    >
                      {this.state.elementstodelete.indexOf(item._id) === -1 ? (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.onSelectedTag(item._id);
                          }}
                        >
                          <i className="far fa-square" />
                        </div>
                      ) : (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.removeSelectedTag(item._id);
                          }}
                        >
                          <i className="fas fa-check-square" />
                        </div>
                      )}
                      <div
                        className="admin-changes-item-name"
                        onClick={() => this.onSelectedItem(item)}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })
              : false}
            {this.state.status === 2
              ? this.state.sector.map(item => {
                  return (
                    <div
                      className="admin-changes-items-to-change"
                      key={item._id}
                    >
                      {this.state.sectorToDelete.indexOf(item._id) === -1 ? (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.onSelectedSector(item._id);
                          }}
                        >
                          <i className="far fa-square" />
                        </div>
                      ) : (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.removeSelectedSector(item._id);
                          }}
                        >
                          <i className="fas fa-check-square" />
                        </div>
                      )}
                      <div
                        className="admin-changes-item-name"
                        onClick={() => this.onSelectedItem(item)}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })
              : false}
            {this.state.status === 3
              ? this.state.title.map(item => {
                  return (
                    <div
                      className="admin-changes-items-to-change"
                      key={item._id}
                    >
                      {this.state.titleToDelete.indexOf(item._id) === -1 ? (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.onSelectedTitle(item._id);
                          }}
                        >
                          <i className="far fa-square" />
                        </div>
                      ) : (
                        <div
                          className="admin-changes-check-box"
                          onClick={() => {
                            this.removeSelectedTitle(item._id);
                          }}
                        >
                          <i className="fas fa-check-square" />
                        </div>
                      )}
                      <div
                        className="admin-changes-item-name"
                        onClick={() => this.onSelectedItem(item)}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })
              : false}
          </div>
          <div className="admin-changes-modification-container">
            <div className="admin-changes-modification-area">
              <div className="admin-changes-input-title">Intitulé</div>
              <input
                value={this.state.itemToDisplayName}
                className="admin-changes-input"
                onChange={this.setName}
                placeholder="Text..."
              />
              {this.state.status === 1 ? (
                <div>
                  <div>Type</div>
                  <div
                    className="admin-changes-type-change"
                    onClick={this.setType}
                  >
                    {this.state.itemToDisplayType}
                  </div>
                  {this.state.setType ? (
                    <div className="admin-changes-type-list">
                      <div
                        id="hard"
                        className="admin-changes-item-name"
                        style={{ margin: "0" }}
                        onClick={this.typeChange}
                      >
                        hard
                      </div>
                      <div
                        id="soft"
                        className="admin-changes-item-name"
                        style={{ margin: "0" }}
                        onClick={this.typeChange}
                      >
                        soft
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                </div>
              ) : (
                false
              )}
            </div>
            <div className="admin-changes-button-container">
              <div
                className="admin-changes-modification-button"
                onClick={
                  this.state.status === 1
                    ? this.addTags
                    : this.state.status === 2
                    ? this.addSector
                    : this.state.status === 3
                    ? this.addTitle
                    : false
                }
              >
                Ajouter
              </div>
              <div
                className="admin-changes-modification-button"
                onClick={
                  this.state.status === 1
                    ? this.modifyTags
                    : this.state.status === 2
                    ? this.modifySector
                    : this.state.status === 3
                    ? this.modifyTitle
                    : false
                }
              >
                Modifier
              </div>
              <div
                className="admin-changes-modification-button"
                onClick={
                  this.state.status === 1
                    ? this.deleteTag
                    : this.state.status === 2
                    ? this.deleteSector
                    : this.state.status === 3
                    ? this.deleteTitle
                    : false
                }
              >
                Effacer
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    const response3 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/title",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    this.setState({
      tag: response.data,
      sector: response2.data,
      title: response3.data,
      loadingtag: false,
      loadingsector: false,
      loadingtitle: false
    });
  }
}
