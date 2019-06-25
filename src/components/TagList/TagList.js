import React from "react";
import axios from "axios";
import "./index.css";

export default class TagList extends React.Component {
  state = {
    data: null,
    search: ""
  };

  // setState pour l'input
  onChange = e => {
    this.setState({ search: e.target.value });
  };

  validateString = str => {
    if (!str || str.match(/^ *$/) !== null) {
      return false;
    }
    return true;
  };

  // fonctions permettant de rajouter un nouveau tag à la base de données.
  // le post reçoit en réponse la liste de tout les tags et met à jour le state.
  addSoftTag = async () => {
    if (this.validateString(this.state.search) === false) {
      return;
    } else {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.search === this.state.data[i].name) {
          return;
        }
      }
      const response = await axios.post(
        "https://erneste-server-improved.herokuapp.com/tag/create",
        { name: this.state.search, type: "soft" },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ data: response.data });
    }
  };

  addHardTag = async () => {
    if (this.validateString(this.state.search) === false) {
      return;
    } else {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.search === this.state.data[i].name) {
          return;
        }
      }
      const response = await axios.post(
        "https://erneste-server-improved.herokuapp.com/tag/create",
        { name: this.state.search, type: "hard" },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ data: response.data });
    }
  };

  render() {
    if (this.state.data === null) {
      return <div />;
    }

    // définition de la RegExp par rapport au state
    const tagSearch = new RegExp(this.state.search);

    // filter pour récupérer les résultats du regexp dans un tableau
    const tagList = this.state.data.filter(tag => {
      return tagSearch.test(tag.name) === true;
    });

    // le tableau est ensuite transformer pour afficher uniquement le nom dans la liste.
    // une fonction en props retourne l'objet tag dans le composant parent afin de traiter l'information et
    // afficher les tags dans le textarea
    const filteredTagList = tagList.map(item => {
      return (
        <div
          id={item._id}
          key={item._id}
          onClick={() => this.props.setTag(item)}
          className={
            item.type === "hard"
              ? "tag-list-tag-option-hard"
              : "tag-list-tag-option-soft"
          }
        >
          {item.name}
        </div>
      );
    });

    return (
      <div className="tag-list-pop-up">
        <input
          name="tag search"
          value={this.state.search}
          onChange={this.onChange}
          placeholder="Recherche/Créer skills"
        />

        <div className="tag-list-pop-up-list">{filteredTagList}</div>
        <div
          onClick={this.addSoftTag}
          className="tag-list-buttons tag-list-soft-skills"
        >
          Créer un soft skill
        </div>
        <div
          onClick={this.addHardTag}
          className="tag-list-buttons tag-list-hard-skills"
        >
          Créer un hard skill
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ data: response.data });
  }
}
