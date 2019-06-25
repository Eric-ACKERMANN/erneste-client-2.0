import React from "react";
import TagList from "../TagList";
import { Link } from "react-router-dom";
import "./index.css";

export default class TalentDescriptions extends React.Component {
  state = {
    tagList: false
  };

  showTagList = () => {
    this.setState({ tagList: !this.state.tagList });
  };

  tagArrayPush = (tagArray, tag) => {
    tagArray.push(tag);
    this.props.setSkills(tagArray);
  };

  setTag = tag => {
    if (this.props.skills === null) {
      const tagArray = [];
      this.tagArrayPush(tagArray, tag);
    } else {
      const tagArray = this.props.skills;
      this.tagArrayPush(tagArray, tag);
    }
  };

  render() {
    const description = this.props.description;
    return (
      <div className="talent-description-container">
        <div>Fiche talent</div>

        <div className="talent-description-top-container">
          <h3 className="talent-description-h3">L'entreprise idéale</h3>
          <textarea
            id="idealCompany"
            readOnly={!this.props.isUpdating}
            name="ideal firm"
            value={description.idealCompany}
            onChange={e => this.props.setDescription(e)}
          />

          <h3 className="talent-description-h3">Mon rôle idéal</h3>
          <textarea
            id="idealRole"
            readOnly={!this.props.isUpdating}
            name="ideal role"
            value={description.idealRole}
            onChange={e => this.props.setDescription(e)}
          />
        </div>
        <div className="talent-description-bot-container">
          <div className="talent-description-bot-left-container">
            <h3 className="talent-description-h3">Mes conditions idéales</h3>
            <textarea
              id="workingEnvironment"
              readOnly={!this.props.isUpdating}
              name="ideal environment"
              value={description.workingEnvironment}
              onChange={e => this.props.setDescription(e)}
            />

            <h3 className="talent-description-h3">Mes ambitions d'évolution</h3>
            <textarea
              id="development"
              readOnly={!this.props.isUpdating}
              name="ambitions"
              value={description.development}
              onChange={e => this.props.setDescription(e)}
            />
          </div>
          <div className="talent-description-skills">
            <h3 className="talent-description-h3">Skills</h3>

            {this.props.skills ? (
              <div>
                {this.props.skills.map((tag, index) => {
                  return (
                    <div
                      key={tag._id}
                      className="talent-description-tag"
                      style={{
                        backgroundColor:
                          tag.type === "hard" ? "#333266" : "#EF6364"
                      }}
                    >
                      <div className="talent-description-tag-name">
                        {tag.name}
                      </div>
                      {this.props.isUpdating && (
                        <div
                          id={index}
                          className="talent-description-remove-tag"
                          onClick={e => this.props.deleteSkills(e.target.id)}
                        >
                          <img
                            src={
                              tag.type === "hard"
                                ? require("../../features/icons/blue-cross.svg")
                                : require("../../features/icons/pink-cross.svg")
                            }
                            alt="close-icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              false
            )}

            {this.props.isUpdating && (
              <div className="talent-description-add-skills">
                <div
                  onClick={this.showTagList}
                  className="talent-description-add-skills-button"
                >
                  {this.state.tagList === false
                    ? "Ajouter des skills"
                    : "Fermer la liste"}
                </div>
                {this.state.tagList === true ? (
                  <TagList setTag={this.setTag} token={this.props.token} />
                ) : null}
              </div>
            )}
          </div>
        </div>

        {this.props.isUpdating && (
          <div className="talent-description-buttons">
            <Link to={"/admin/talent-list"}>
              <div className="talent-description-cancel">Annuler</div>
            </Link>
            {this.props.action === "update" ? (
              <div
                className="talent-description-cancel"
                onClick={this.props.setUpdate}
              >
                Annuler les changements
              </div>
            ) : (
              false
            )}
            {this.props.action === "update" ? (
              <div
                className="talent-description-validate"
                onClick={this.props.update}
              >
                Mettre à jour
              </div>
            ) : (
              <div
                className="talent-description-validate"
                onClick={this.props.post}
              >
                Ajouter le profil
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
