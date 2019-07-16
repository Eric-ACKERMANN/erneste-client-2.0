import React from "react";
import "./index.css";

export default function ClientWelcome_SelectedTalent({
  talentShown,
  positionShown,
  positionShownDown,
  positionShownUp,
  hoverOn,
  hoverOff,
  togglePopUp,
  hoverContact
}) {
  let talent = talentShown[positionShown].profil;
  return (
    <div>
      <div className="client-welcome-rightBlock-header">
        <div className="client-welcome-rightBlock-header-left">
          <div className="client-welcome-rightBlock-header-left-picture-block">
            {talent.informations.photo !== null ? (
              <img
                className="client-welcome-rightBlock-header-left-picture-picture"
                src={talent.informations.photo}
                alt="portrait of talent"
              />
            ) : (
              <div className="empty-photo">
                <div className="text-empty-picture" />
              </div>
            )}
          </div>
          <div className="client-welcome-rightBlock-header-left-comments">
            <span className="client-welcome-rightBlock-header-left-comments-name">
              {`${talent.informations.firstName} ${
                talent.informations.lastName
              }`}
              {talent.informations.linkedIn ? (
                <a
                  href={talent.informations.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin client-welcome-rightBlock-header-left-comments-linkedin" />
                </a>
              ) : (
                <i className="fab fa-linkedin client-welcome-rightBlock-header-left-comments-linkedin" />
              )}
            </span>
            <span className="client-welcome-rightBlock-header-left-comments-features">
              {talent.informations.actualCompany}
            </span>
            <span className="client-welcome-rightBlock-header-left-comments-features">
              € {talent.informations.salary}
            </span>
          </div>
        </div>
        <div className="client-welcome-rightBlock-header-right">
          <div className="client-welcome-rightBlock-header-right-arrows">
            <div
              className="client-welcome-rightBlock-header-right-arrows-left"
              onClick={positionShownDown}
            >
              <i className="fas fa-arrow-left" />
            </div>
            <div
              className="client-welcome-rightBlock-header-right-arrows-right"
              onClick={positionShownUp}
            >
              <i className="fas fa-arrow-right" />
            </div>
          </div>
          <div className="client-welcome-rightBlock-header-right-contact-block">
            <div
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={togglePopUp}
              className="client-welcome-rightBlock-header-right-contact-button"
            >
              Contacter
            </div>
            <div className={hoverContact ? "test-display" : "test-notDisplay"}>
              <div className="arrow-upTest" />
              <div className="textTest">
                Contacter les talents via Erneste augmente vos chances de
                réponse positives, car nous sommes un tiers de confiance auquel
                se fie le talent.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="client-welcome-rightBlock-idealCompany">
        <h3 className="client-welcome-rightBlock-title">L'entreprise idéale</h3>
        <div className="client-welcome-rightBlock-text">
          {talent.description.idealCompany}
        </div>
      </div>
      <div className="client-welcome-rightBlock-idealRole">
        <h3 className="client-welcome-rightBlock-title">Mon rôle idéal</h3>
        <div className="client-welcome-rightBlock-text">
          {talent.description.idealRole}
        </div>
      </div>
      <div className="client-welcome-rightBlock-workingEnvironment">
        <h3 className="client-welcome-rightBlock-title">
          Mes conditions idéales
        </h3>
        <div className="client-welcome-rightBlock-text">
          {talent.description.workingEnvironment}
        </div>
      </div>
      <div className="client-welcome-rightBlock-development">
        <h3 className="client-welcome-rightBlock-title">
          Mes ambitions d'évolution
        </h3>
        <div className="client-welcome-rightBlock-text">
          {talent.description.development}
        </div>
      </div>
      <div className="client-welcome-rightBlock-skills">
        <h3 className="client-welcome-rightBlock-title">Skills</h3>
        <div className="client-welcome-rightBlock-tagBlock">
          {talent.skills.map(tag => {
            return (
              <div
                key={tag.name}
                style={{
                  backgroundColor: tag.type === "hard" ? "#333266" : "#EF6364"
                }}
                className="client-welcome-tag"
              >
                <div className="client-welcome-tag-name">{tag.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
