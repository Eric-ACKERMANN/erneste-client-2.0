import React from "react";
import axios from "axios";
import "./index.css";
import Title from "../../components/TalentList_Title";
import TagFilter from "../../components/TalentList_TagFilter";
// import TitleLine from "../../components/TalentList_TitleLine";
// import TalentList from "../../components/TalentList_TalentList";
// import Tools from "../../components/TalentList_Tools";
import SectorFilter from "../../components/TalentList_SectorFilter";
import Table from "../../reactComponent/Table";
import selectedBox from "../../features/icons/check_24px.svg";

export default class TalentListPage extends React.Component {
  state = {
    /* State updated from the GET in ComponentDiMount*/
    titleList: [],
    isLoading: true,
    id: "talentList",
    talentList: null,
    titles: [
      { front: "", back: "delete", filter: null, search: false },
      {
        front: "Nom",
        back: "name",
        link: `/admin/talent/`,
        filter: null,
        search: true
      },
      {
        front: "Fonction",
        back: "actualTitle",
        filter: "filter",
        search: true
      },
      {
        front: "Entreprise",
        back: "actualCompany",
        filter: "filter",
        search: true
      },
      {
        front: "Souhait",
        back: "wantedTitle",
        filter: "filter",
        search: true
      },
      { front: "Validé", back: "validated", filter: "filter", search: false },
      {
        front: "Statut",
        back: "status",
        filter: "filter",
        search: false
      },
      {
        front: "Mise à jour",
        back: "lastUpdate",
        filter: "sort",
        search: false
      }
    ],

    deleteInLineArray: [],
    ShowDeleteButton: null,

    /* Tag Filter State */
    tagList: [],
    tagInputValue: "",
    tagSelected: [],
    tagSuggestionsShown: false,
    tagListFiltered: [],
    tagActiveSuggestion: 0,

    /* Sector Filter State */
    sectorList: [],
    sectorInputValue: "",
    sectorSelected: [],
    sectorSuggestionsShown: false,
    sectorListFiltered: [],
    sectorActiveSuggestion: 0
  };

  handleClickDeleteInLine = id => {
    let deleteInLineArray = this.state.deleteInLineArray;

    if (deleteInLineArray.indexOf(id) === -1) {
      deleteInLineArray.push(id);
    } else {
      deleteInLineArray.splice(deleteInLineArray.indexOf(id), 1);
    }
    if (deleteInLineArray.length > 0) {
      this.setState({
        deleteInLineArray: deleteInLineArray,
        ShowDeleteButton: true
      });
    } else {
      this.setState({
        deleteInLineArray: deleteInLineArray,
        ShowDeleteButton: false
      });
    }
  };

  /********* GET INFORMATION FROM DATABASE **************/
  getData = async () => {
    const getTalents = () => {
      return axios.get(
        "https://erneste-server-improved.herokuapp.com/talent?picture=none",
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
    };

    const getTags = () => {
      return axios.get("https://erneste-server-improved.herokuapp.com/tag", {
        headers: { authorization: `Bearer ${this.props.token}` }
      });
    };

    const getSectors = () => {
      return axios.get("https://erneste-server-improved.herokuapp.com/sector", {
        headers: { authorization: `Bearer ${this.props.token}` }
      });
    };

    axios.all([getTalents(), getTags(), getSectors()]).then(
      axios.spread((talents, tags, sectors) => {
        let talentList = talents.data;
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
        talentList
          .sort((a, b) => {
            // sort seconds
            if (a.lastUpdate[1] && b.lastUpdate[1]) {
              return a.lastUpdate[1][2] - b.lastUpdate[1][2];
            } else return false;
          })
          .sort((a, b) => {
            // sort minutes
            if (a.lastUpdate[1] && b.lastUpdate[1]) {
              return b.lastUpdate[1][1] - a.lastUpdate[1][1];
            } else return false;
          })
          .sort((a, b) => {
            // sort hour
            if (a.lastUpdate[1] && b.lastUpdate[1]) {
              return b.lastUpdate[1][0] - a.lastUpdate[1][0];
            } else return false;
          })
          .sort((a, b) => {
            // sort day
            return b.lastUpdate[0][0] - a.lastUpdate[0][0];
          })
          .sort((a, b) => {
            // sort month
            return b.lastUpdate[0][1] - a.lastUpdate[0][1];
          })
          .sort((a, b) => {
            // sort year
            return b.lastUpdate[0][2] - a.lastUpdate[0][2];
          });

        // Change lastUpdate key from [[29,05,2019],[15,05,98]] to 29/05/2019 , and remove the informations key
        talentList.forEach(e => {
          return (e.lastUpdate = e.lastUpdate[0].join("."));
        });

        talentList.forEach(talent => {
          talent.name = `${talent.informations.firstName} ${talent.informations.lastName}`;
          talent.actualCompany = talent.informations.actualCompany;
          talent.actualTitle = talent.informations.actualTitle;
          talent.status = talent.informations.status;
          talent.wantedSector = [...talent.informations.wantedSector];
          talent.wantedSize = talent.informations.wantedSize;
          talent.wantedTitle = [...talent.informations.wantedTitle];
          delete talent.informations;
        });

        this.setState({
          talentList: talents.data,
          tagList: tags.data,
          sectorList: sectors.data,
          isLoading: false
        });
      })
    );
  };

  /********* END OF GET INFORMATION FROM DATABASE **************/
  handleClickDeleteButton = async toto => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/talent/delete",
      {
        talents: this.state.deleteArray
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.getTalentList();
  };
  /************** TAG FUNCTION **********************/
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
    if (
      this.state.tagListFiltered.length < 1 ||
      this.state.tagInputValue === ""
    ) {
      this.setState({ tagActiveSuggestion: 0 });
      return;
    }
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
        this.state.tagActiveSuggestion ===
        this.state.tagListFiltered.length - 1
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

  /************** SECTOR FUNCTION ***********************/

  // Function that deals with the sector input

  onChangeSectorInput = toto => {
    let sectorListFiltered = this.state.sectorList.filter(element => {
      return element.name.toLowerCase().indexOf(toto.toLowerCase()) > -1;
    });
    toto
      ? this.setState({
          sectorInputValue: toto,
          sectorListFiltered: sectorListFiltered,
          sectorSuggestionsShown: true
        })
      : this.setState({
          sectorInputValue: toto,
          sectorListFiltered: sectorListFiltered,
          sectorSuggestionsShown: false
        });
  };

  // Function to put sector as a filter
  onClickSector = sector => {
    let sectorSelected = [...this.state.sectorSelected];
    sectorSelected.push(sector);

    this.setState({
      sectorSelected: sectorSelected,
      sectorInputValue: "",
      sectorActiveSuggestion: 0,
      sectorSuggestionsShown: false
    });
  };

  // Function that detect keyboard Key on sectorInput
  onKeyDownSectorInput = e => {
    if (
      this.state.sectorListFiltered.length < 1 ||
      this.state.sectorInputValue === ""
    ) {
      this.setState({ sectorActiveSuggestion: 0 });
      return;
    }
    // ENTER, it adds the sector
    if (e.keyCode === 13) {
      let sectorSuggestions = [...this.state.sectorSelected];
      sectorSuggestions.push(
        this.state.sectorListFiltered[this.state.sectorActiveSuggestion]
      );
      this.setState({
        sectorSelected: sectorSuggestions,
        sectorInputValue: "",
        sectorActiveSuggestion: 0,
        sectorSuggestionsShown: false
      });
    }

    // UP ARROW
    else if (e.keyCode === 38) {
      if (this.state.sectorActiveSuggestion === 0) {
        return;
      } else {
        this.setState({
          sectorActiveSuggestion: this.state.sectorActiveSuggestion - 1
        });
      }
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (
        this.state.sectorActiveSuggestion ===
        this.state.sectorListFiltered.length - 1
      ) {
        return;
      }
      this.setState({
        sectorActiveSuggestion: this.state.sectorActiveSuggestion + 1
      });
    }
    // ESCAPE
    else if (e.keyCode === 27) {
      this.setState({ sectorSuggestionsShown: false });
    }
  };

  // Function to delete all sector from the filter
  onDeleteAllSectorClick = () => {
    let sectorSuggestions = [...this.state.sectorSelected];
    sectorSuggestions.splice(0, sectorSuggestions.length);
    this.setState({ sectorSelected: sectorSuggestions });
  };
  // Function to delete one sector
  onSingleSectorDeleteClick = index => {
    let sectorSuggestions = [...this.state.sectorSelected];
    sectorSuggestions.splice(index, 1);
    this.setState({ sectorSelected: sectorSuggestions });
  };

  /**********************************************************************************************************/
  /********************************************** RENDER ****************************************************/
  /**********************************************************************************************************/

  sectorFilter = (talentList, sector) => {
    if (sector.length > 0) {
      talentList = talentList.filter(element => {
        // On crée un tableau de booléen,La longueur du tableau de booléen doit être celle de sector, on remplit ce tableau de true à la base
        let bool = Array(sector.length).fill(true);
        let booltest = true;
        if (element.informations.wantedSector.length > 0) {
          for (let i = 0; i < sector.length; i++) {
            for (let j = 0; j < element.informations.wantedSector.length; j++) {
              if (sector[i]._id === element.informations.wantedSector[j]._id) {
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
    return talentList;
  };

  tagFilter = (talentList, tag) => {
    if (tag.length > 0) {
      talentList = talentList.filter(element => {
        // On crée un tableau de booléen,La longueur du tableau de booléen doit être celle de tag, on remplit ce tableau de true à la base
        let bool = Array(tag.length).fill(true);
        if (element.skills.length > 0) {
          for (let i = 0; i < tag.length; i++) {
            for (let j = 0; j < element.skills.length; j++) {
              if (tag[i]._id === element.skills[j]._id) {
                bool[i] = true;
                break;
              } else {
                bool[i] = false;
              }
            }
          }
          for (let i = 0; i < bool.length; i++) {
            if (bool[i] === false) {
              return false;
            }
          }
          return true;
        } else return false;
      });
    }
    return talentList;
  };

  /******** SORT FILTER *********/
  sortList = (talentList, sortSelectedList) => {
    let talentListCopie = [...talentList];
    for (let i = 0; i < talentListCopie.length; i++) {
      talentListCopie[i].lastUpdate = talentListCopie[i].lastUpdate.split(".");
    }

    for (let i = 0; i < sortSelectedList.length; i++) {
      let title = sortSelectedList[i].title;
      if (title === "lastUpdate") {
        if (sortSelectedList[i].order === "descending") {
          talentListCopie
            .sort((a, b) => {
              return a.lastUpdate[0] - b[0];
            })
            .sort((a, b) => {
              return a.lastUpdate[1] - b.lastUpdate[1];
            })
            .sort((a, b) => {
              return a.lastUpdate[2] - b.lastUpdate[2];
            });
        } else if (sortSelectedList[i].order === "ascending") {
          talentListCopie
            .sort((a, b) => {
              return b.lastUpdate[0] - a.lastUpdate[0];
            })
            .sort((a, b) => {
              return b.lastUpdate[1] - a.lastUpdate[1];
            })
            .sort((a, b) => {
              return b.lastUpdate[2] - a.lastUpdate[2];
            });
        }
      }
    }

    for (let i = 0; i < talentListCopie.length; i++) {
      talentListCopie[i].lastUpdate = talentListCopie[i].lastUpdate.join(".");
    }
    return talentListCopie;
  };

  render() {
    let self = this;
    /* Test of Loading... */
    if (this.state.isLoading === true) {
      return "Loading....";
    }

    let talentList = [...this.state.talentList];
    for (let i = 0; i < this.state.talentList.length; i++) {
      talentList[i] = { ...this.state.talentList[i] };
    }

    // FILTER WITH SECTOR
    let sector = this.state.sectorSelected;
    talentList = this.sectorFilter(talentList, sector);
    // FILTER WITH TAG
    let tag = this.state.tagSelected;
    talentList = this.tagFilter(talentList, tag);

    // On tranforme le tableau de clients suivant les cas particuliers avant de le donner au composant Table
    const headLineArrayBack = this.state.titles.map(function(e) {
      return e.back;
    });

    talentList.forEach(function(talent) {
      headLineArrayBack.forEach(function(title) {
        if (title === "delete") {
          let clicked = false;
          let talentPos = self.state.deleteInLineArray.indexOf(talent._id);
          if (talentPos !== -1) {
            clicked = true;
          }
          if (clicked) {
            talent[title] = (
              <img
                className={"selectItem itemSelected"}
                src={selectedBox}
                alt={"box cochée"}
              />
            );
          } else {
            talent[title] = <div className="selectItem" />;
          }
        } else if (title === "wantedSector" || title === "wantedTitle") {
          if (typeof talent[title] === "object") {
            talent[title] = talent[title].map(function(e) {
              return e.name;
            });
          } else if (talent[title].name) {
            talent[title] = talent[title].name;
          }
        }
      });
    });

    let className = { line_Li: `${this.state.id}-line-li` };
    return (
      <div className="content">
        <div className="container">
          <div className="talentList-container">
            <div className="talentList-left-block">
              <Title talentList={talentList} />
              <SectorFilter
                sectorInputValue={this.state.sectorInputValue}
                sectorListFiltered={this.state.sectorListFiltered}
                sectorSelected={this.state.sectorSelected}
                sectorSuggestionsShown={this.state.sectorSuggestionsShown}
                onChangeSectorInput={this.onChangeSectorInput}
                onClickSector={this.onClickSector}
                sectorActiveSuggestion={this.state.sectorActiveSuggestion}
                onKeyDownSectorInput={this.onKeyDownSectorInput}
                onDeleteAllSectorClick={this.onDeleteAllSectorClick}
                onSingleSectorDeleteClick={this.onSingleSectorDeleteClick}
              />
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
            <Table
              idItem={`${this.state.id}_table`}
              style={{
                line_li: { width: "100px" },
                line_li_first: { width: "40px" },
                box: { width: "200%" },
                line: { padding: "2px 0px" }
              }}
              SpecificClassName={className}
              deleteInLine={{
                exist: true,
                position: 0,
                func: this.handleClickDeleteInLine
              }}
              tools={{
                search: true,
                searchPlaceholder: "Rechercher un talent...",
                button: [
                  {
                    condition: "fixed",
                    type: "btn-primary",
                    text: "Ajouter un talent",
                    logo: <i className="fas fa-plus" />,
                    logoPosition: -1,
                    link: "/admin/talent-create"
                  },
                  {
                    condition: "filter",
                    type: "btn-secondary",
                    text: "Supprimer les filtres",
                    logo: false,
                    onClick: "clearFilter"
                  },
                  {
                    condition: this.state.deleteInLineArray,
                    type: "btn-cancel",
                    text: "Supprimer les talents sélectionnés",
                    logoPosition: -1,
                    logo: <i className="fa fa-trash-alt" />,
                    onClick: this.handleClickDeleteButton
                  }
                ]
              }}
              headlineArray={this.state.titles}
              headlineClass="line headline"
              lineArray={talentList}
              lineClass="line"
              sortList={this.sortList}
            />
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
