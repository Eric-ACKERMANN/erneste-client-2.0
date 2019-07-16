import React from "react";
import box from "../../features/icons/check_24px.svg";

export default function ClientWelcome_TalentList({
  talentList,
  handleClickTalent,
  talentShown
}) {
  return (
    <div className="client-welcome-leftBlock-talentBlock-list-talent">
      {talentList.map((element, index) => {
        let statusClass = "";
        // Get the status
        if (element.informations.status === "0") {
          statusClass = "client-welcome-statut0";
        }
        if (element.informations.status === "Recherche active") {
          statusClass = "client-welcome-statut1";
        }
        if (element.informations.status === "Ouvert(e) aux opportunités") {
          statusClass = "client-welcome-statut2";
        }
        if (element.informations.status === "Ne pas être contacté(e)") {
          statusClass = "client-welcome-statut3";
        }
        if (element.informations.status === "Embauché(e) par Erneste") {
          statusClass = "client-welcome-statut4";
        }

        let clicked = null;
        if (talentShown) {
          if (
            talentShown
              .map(e => {
                return e.profil;
              })
              .indexOf(element) === -1
          ) {
            clicked = false;
          } else {
            clicked = true;
          }
        }

        return (
          <ul
            key={index}
            onClick={() => {
              handleClickTalent(element, talentList);
            }}
          >
            <li className="client-welcome-leftBlock-talentBlock-list-talent-checkBox">
              <img
                className={
                  clicked
                    ? "client-welcome-leftblock-box-checked"
                    : "client-welcome-leftblock-box-unChecked"
                }
                src={box}
                alt={clicked ? "box cochée" : "box non cochée"}
              />
            </li>
            <li
              className="client-welcome-leftBlock-talentBlock-list-talent-name"
              key={element}
            >
              <div className={statusClass} />
              <div className="client-welcome-leftBlock-talentBlock-list-talent-name-text">{`${
                element.informations.firstName
              } ${element.informations.lastName}`}</div>
            </li>
            <li className="client-welcome-leftBlock-talentBlock-list-talent-actualTitle">
              {element.informations.actualTitle}
            </li>
            <li className="client-welcome-leftBlock-talentBlock-list-talent-actualCompany">
              {element.informations.actualCompany}
            </li>
            <li className="client-welcome-leftBlock-talentBlock-list-talent-interestedBy">
              {element.informations.wantedTitle.map(e => {
                return <div key={e.name}>{e.name}</div>;
              })}
            </li>
          </ul>
        );
      })}
    </div>
  );
}
