import React from "react";
import axios from "axios";
import "./index.css";
import { Redirect } from "react-router-dom";

import Title from "../../components/TalentList_Title";
import TagFilter from "../../components/TalentList_TagFilter";
import TitleLine from "../../components/TalentList_TitleLine";
import TalentList from "../../components/TalentList_TalentList";
import Tools from "../../components/TalentList_Tools";

/* Page to see the Talent List (HomePage of Admin)*/

export default class TalentListPage extends React.Component {
  state = {
    /* State updated from the GET in ComponentDiMount*/
    talentList: [],
    titleList: [],
    isLoading: true,

    /* State for delete a line of talent */
    ShowDeleteButton: false,
    deleteArray: [],

    searchInput: "",
    titleArray: [
      { value: "Nom", clicked: false, firstClicked: false },
      { value: "Fonction", clicked: false, firstClicked: false },
      { value: "Entreprise", clicked: false, firstClicked: false },
      { value: "Souhait", clicked: false, firstClicked: false },
      { value: "Validé", clicked: false, firstClicked: false },
      { value: "Statut", clicked: false, firstClicked: false },
      { value: "Dernière modif.", clicked: false, firstClicked: false }
    ],

    /* Chevron Filter State */
    chevronClikedPosition: null,
    chevronFilter: [],
    filterOrder: 0,

    /* Tag Filter State */
    tagList: [],
    tagInputValue: "",
    tagSelected: [],
    tagSuggestionsShown: false,
    tagListFiltered: [],
    tagActiveSuggestion: 0
  };

  // Function to GET data from /talent
  getData = async toto => {
    this.setState({ isLoading: true });
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/talent/",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    // We sort the array of talent by lastUpdate
    // The date we get is type "29 05 2019, 15 05 98"
    // We want to show 29/05/2019, but the sort has to be on hour minutes secondes too
    // 1. change of the 29 05 2019, 15 05 98 into [[29,05,2019],[15,05,98]]
    let talentList = response.data;
    for (let i = 0; i < talentList.length; i++) {
      if (typeof talentList[i].lastUpdate === "string") {
        talentList[i].lastUpdate = talentList[i].lastUpdate.split(",");
        talentList[i].lastUpdate[0] = talentList[i].lastUpdate[0]
          .trim()
          .split(" ");
        talentList[i].lastUpdate[1] = talentList[i].lastUpdate[1]
          .trim()
          .split(" ");
      }
    }

    for (let i = 2; i > -1; i--) {
      talentList.sort((a, b) => {
        return b.lastUpdate[1][i] - a.lastUpdate[1][i]; // sort seconds > minutes > hour
      });
    }
    for (let i = 0; i < 3; i++) {
      talentList.sort((a, b) => {
        return b.lastUpdate[0][i] - a.lastUpdate[0][i]; // sort day > month > year
      });
    }
    // Change lastUpdate key from [[29,05,2019],[15,05,98]] to 29/05/2019
    talentList.forEach(e => {
      return (e.lastUpdate = e.lastUpdate[0].join("."));
    });

    // Get data from tagList
    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/tag",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );

    this.setState({
      isLoading: false,
      talentList: talentList,
      tagList: response2.data
    });
  };

  /* DELETE OF A TALENT */

  // Function to enable to delete a talent, also enable to display the "delete the selected profils" by changing the state delete
  deleteCheckBox = async id => {
    const deleteArray = [...this.state.deleteArray];

    if (deleteArray.indexOf(id) === -1) {
      deleteArray.push(id);
    } else {
      deleteArray.splice(deleteArray.indexOf(id), 1);
    }
    if (deleteArray.length > 0) {
      this.setState({ deleteArray: deleteArray, ShowDeleteButton: true });
    } else {
      this.setState({ deleteArray: deleteArray, ShowDeleteButton: false });
    }
  };

  // Function that enable to delete element which are checked
  handleClickDeleteButton = async toto => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/talent/delete",
      {
        talents: this.state.deleteArray
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.getData();
  };

  /* SEARCH INPUT FUNCTION */

  searchType = event => {
    this.setState({ searchInput: event });
  };
  // Function to empty the input on click X
  onClickClearSearch = () => {
    this.setState({ searchInput: "" });
  };

  /* CHEVRON FILTER FUNCTION*/

  // Function to detect click on a chevron
  chevronClick = toto => {
    const titleArray = [...this.state.titleArray];
    let position = titleArray
      .map(e => {
        return e.value;
      })
      .indexOf(toto);

    titleArray[position].clicked = !titleArray[position].clicked;

    position === this.state.chevronClikedPosition
      ? this.setState({
          titleArray: titleArray,
          chevronClikedPosition: null
        })
      : this.setState({
          titleArray: titleArray,
          chevronClikedPosition: position
        });
  };

  // Function to insert the filter chosen
  filterCheckBox = async (title, filter) => {
    console.log(title, filter);
    const chevronFilter = [...this.state.chevronFilter];
    let filterOrder = this.state.filterOrder;
    let position = chevronFilter
      .map(e => {
        return e.title;
      })
      .indexOf(title);
    if (position === -1) {
      this.setState({ filterOrder: this.state.filterOrder + 1 });
      chevronFilter.push({
        title: title,
        filter: [filter],
        filterOrder: filterOrder + 1
      });
    } else {
      if (chevronFilter[position].filter.indexOf(filter) === -1) {
        chevronFilter[position].filter.push(filter);
      } else {
        chevronFilter[position].filter.splice(
          chevronFilter[position].filter.indexOf(filter),
          1
        );
      }
      // If we remove all elements of the filter, we splice the element from the array et we reduce the order of 1
      if (chevronFilter[position].filter.length < 1) {
        let FilterRemovedOrder = chevronFilter[position].filterOrder;
        chevronFilter.splice(position, 1);
        // On réduit le numéro du filterOrder
        await this.setState({ filterOrder: this.state.filterOrder - 1 });
        // On réduit le filterOrder de tous les autres filtres qui ont un order plus grand
        for (let i = 0; i < chevronFilter.length; i++) {
          if (chevronFilter[i].filterOrder > FilterRemovedOrder) {
            chevronFilter[i].filterOrder = chevronFilter[i].filterOrder - 1;
          }
        }
      }
    }
    // sort chevronFilter by filterOrder
    chevronFilter.sort((a, b) => {
      return a.filterOrder - b.filterOrder;
    });
    await this.setState({ chevronFilter: chevronFilter });
  };

  // Function to clear all filters from chevron
  onDeleteChevronFilterClick = () => {
    let chevronFilter = [...this.state.chevronFilter];
    chevronFilter.splice(0, chevronFilter.length);
    this.setState({ chevronFilter: chevronFilter });
  };

  /* TAG FUNTION */

  // Function that deals with the tag input

  onChangeTagInput = toto => {
    let tagListFiltered = this.state.tagList.filter(element => {
      return element.name.toLowerCase().indexOf(toto.toLowerCase()) > -1;
    });
    toto
      ? this.setState({
          tagInputValue: toto,
          tagListFiltered: tagListFiltered,
          tagSuggestionsShown: true
        })
      : this.setState({
          tagInputValue: toto,
          tagListFiltered: tagListFiltered,
          tagSuggestionsShown: false
        });
  };

  // Function to put tag as a filter
  onClickTag = tag => {
    let tagSelected = [...this.state.tagSelected];
    tagSelected.push(tag);

    this.setState({
      tagSelected: tagSelected,
      tagInputValue: "",
      tagActiveSuggestion: 0,
      tagSuggestionsShown: false
    });
  };

  // Function that detect keyboard Key on tagInput
  onKeyDownTagInput = e => {
    // ENTER, it adds the tag
    if (e.keyCode === 13) {
      let tagSuggestions = [...this.state.tagSelected];
      tagSuggestions.push(
        this.state.tagListFiltered[this.state.tagActiveSuggestion]
      );
      this.setState({
        tagSelected: tagSuggestions,
        tagInputValue: "",
        tagActiveSuggestion: 0,
        tagSuggestionsShown: false
      });
    }

    // UP ARROW
    else if (e.keyCode === 38) {
      if (this.state.tagActiveSuggestion === 0) {
        return;
      } else {
        this.setState({
          tagActiveSuggestion: this.state.tagActiveSuggestion - 1
        });
      }
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (
        this.state.tagActiveSuggestion - 1 ===
        this.state.tagListFiltered.length
      ) {
        return;
      }
      this.setState({
        tagActiveSuggestion: this.state.tagActiveSuggestion + 1
      });
    }
    // ESCAPE
    else if (e.keyCode === 27) {
      this.setState({ tagSuggestionsShown: false });
    }
  };

  // Function to delete all tag from the filter
  onDeleteAllTagClick = () => {
    let tagSuggestions = [...this.state.tagSelected];
    tagSuggestions.splice(0, tagSuggestions.length);
    this.setState({ tagSelected: tagSuggestions });
  };
  // Function to delete one tag
  onSingleTagDeleteClick = index => {
    let tagSuggestions = [...this.state.tagSelected];
    tagSuggestions.splice(index, 1);
    this.setState({ tagSelected: tagSuggestions });
  };

  render() {
    /* Permission test */
    if (this.props.permission !== "Admin") {
      return <Redirect to={"/"} />;
    }

    /* Test of Loading... */

    if (this.state.isLoading === true) {
      return "Loading....";
    }
    let talentList = [];
    let ArrayOfFilteredTalentList = [];
    let chevronFilter = this.state.chevronFilter;

    // Copie of TalentList state
    if (this.state.talentList.length > 0) {
      talentList = [...this.state.talentList];

      // FILTER THE LIST WITH THE SEARCH INPUT

      const filter = this.state.searchInput.toLowerCase();
      talentList = talentList.filter(element => {
        let bool = false;
        if (
          element.informations.firstName &&
          element.informations.firstName.toLowerCase().includes(filter)
        ) {
          bool = true;
        }
        if (
          element.informations.lastName &&
          element.informations.lastName.toLowerCase().includes(filter)
        ) {
          bool = true;
        }
        if (
          element.informations.actualCompany &&
          element.informations.actualCompany.toLowerCase().includes(filter)
        ) {
          bool = true;
        }
        if (
          element.informations.actualTitle &&
          element.informations.actualTitle.toLowerCase().includes(filter)
        ) {
          bool = true;
        }
        if (
          element.informations.wantedTitle &&
          element.informations.wantedTitle.length > 0
        ) {
          for (let i = 0; i < element.informations.wantedTitle.length; i++) {
            if (
              element.informations.wantedTitle[i].name
                .toLowerCase()
                .includes(filter)
            ) {
              bool = true;
            }
          }
        }
        return bool;
      });

      // FILTER WITH TAGS
      let tag = this.state.tagSelected;

      if (tag.length > 0) {
        talentList = talentList.filter(element => {
          // On crée un tableau de booléen,La longueur du tableau de booléen doit être celle de tag, on remplit ce tableau de true à la base
          let bool = Array(tag.length).fill(true);
          let booltest = true;
          if (element.skills.length > 0) {
            for (let i = 0; i < tag.length; i++) {
              for (let j = 0; j < element.skills.length; j++) {
                if (tag[i]._id === element.skills[j]) {
                  bool[i] = true;
                  break;
                } else {
                  bool[i] = false;
                }
              }
            }
            for (let i = 0; i < bool.length; i++) {
              if (bool[i] === false) {
                booltest = false;
              }
            }
            return booltest;
          } else return false;
        });
      }
      //  FILTER BY CLICKING ON CHEVRON
      // On crée un tableau qui stock les différentes listes filtrées
      //A la base il a la première liste filtrée par le research
      ArrayOfFilteredTalentList = [talentList];

      //1. On applique les filtres, et on enregistre la nouvelle liste filtrée à chaque fois
      if (chevronFilter) {
        for (let i = 0; i < chevronFilter.length; i++) {
          let title = chevronFilter[i].title;
          talentList = talentList.filter(element => {
            let bool = false;
            // cas wantedTitle
            if (title === "wantedTitle") {
              for (let j = 0; j < element.informations[title].length; j++) {
                for (let k = 0; k < chevronFilter[i].filter.length; k++) {
                  if (
                    element.informations[title][j] ===
                    chevronFilter[i].filter[k]
                  ) {
                    bool = true;
                  }
                }
              }
              return bool;
            } else if (
              // cas validated et lastUpdate
              title === "validated" ||
              title === "lastUpdate"
            ) {
              for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                if (element[title].toString() === chevronFilter[i].filter[j]) {
                  bool = true;
                }
              }
              return bool;
            } else {
              // cas actualTitle,actualCompany,status
              for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                if (
                  element.informations[title] === chevronFilter[i].filter[j]
                ) {
                  bool = true;
                }
              }
              return bool;
            }
          });
          // On push la listefiltrée dans le tableau des listes filtrées
          ArrayOfFilteredTalentList.push(talentList);
        }
      }
      console.log("hey", talentList);
    }
    console.log(talentList);
    return (
      <div className="content">
        <div className="container">
          <div className="talentList-container">
            <div className="talentList-left-block">
              <Title talentList={talentList} />
              <TagFilter
                tagInputValue={this.state.tagInputValue}
                tagListFiltered={this.state.tagListFiltered}
                tagSelected={this.state.tagSelected}
                tagSuggestionsShown={this.state.tagSuggestionsShown}
                onChangeTagInput={this.onChangeTagInput}
                onClickTag={this.onClickTag}
                tagActiveSuggestion={this.state.tagActiveSuggestion}
                onKeyDownTagInput={this.onKeyDownTagInput}
                onDeleteAllTagClick={this.onDeleteAllTagClick}
                onSingleTagDeleteClick={this.onSingleTagDeleteClick}
              />
            </div>
            <div className="talentList-right-block">
              <Tools
                delete={this.state.ShowDeleteButton}
                searchInput={this.state.searchInput}
                handleClickDeleteButton={this.handleClickDeleteButton}
                searchType={this.searchType}
                onClickClearSearch={this.onClickClearSearch}
                chevronFilter={chevronFilter}
                onDeleteChevronFilterClick={this.onDeleteChevronFilterClick}
              />
              <TitleLine
                talentListNonFiltered={this.state.talentList}
                ArrayOfFilteredTalentList={ArrayOfFilteredTalentList}
                titleArray={this.state.titleArray}
                chevronClick={this.chevronClick}
                chevronClickedPosition={this.state.chevronClikedPosition}
                filterCheckBox={this.filterCheckBox}
                chevronFilter={chevronFilter}
              />
              <TalentList
                talentList={talentList}
                deleteCheckBox={this.deleteCheckBox}
                deleteArray={this.state.deleteArray}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this.getData();
    this.props.setPageActive("admin/talent");
  }
}
