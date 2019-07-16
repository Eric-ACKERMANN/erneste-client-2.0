import React from "react";
import box from "../../features/icons/check_24px.svg";

export default function ClientWelcome_Titles({ titleList }) {
  return (
    <div className="client-welcome-leftBlock-talentBlock-list-title">
      <ul>
        <li className="client-welcome-leftBlock-talentBlock-list-talent-checkBox">
          <img
            className="client-welcome-leftblock-box"
            src={box}
            alt="box cochée"
          />
        </li>
        {titleList.map((element, index) => {
          let columnClass = "";
          if (titleList.indexOf(element) === 0) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-name";
          }
          if (titleList.indexOf(element) === 1) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-actualTitle";
          }
          if (titleList.indexOf(element) === 2) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-talent-actualCompany";
          }
          if (titleList.indexOf(element) === 3) {
            columnClass =
              "client-welcome-leftBlock-talentBlock-list-title-interestedBy";
          }
          return (
            <li key={index} className={columnClass}>
              {element}
              <i className="fas fa-sort-down" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
