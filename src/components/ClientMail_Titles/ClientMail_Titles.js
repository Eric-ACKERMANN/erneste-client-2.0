import React from "react";

import box from "../../features/icons/check_24px.svg";
import "./index.css";

export default function ClientMail_Titles({ titleList }) {
  return (
    <div className="client-mail-leftBlock-contactBlock-list-title">
      <ul>
        <li className="client-mail-leftBlock-contactBlock-list-checkBox">
          <img
            className="client-mail-contactblock-box"
            src={box}
            alt="box cochée"
          />
        </li>
        {titleList.map((element, index) => {
          let columnClass = "";
          if (titleList.indexOf(element) === 0) {
            columnClass = "client-mail-leftBlock-contactBlock-list-talent";
          }
          if (titleList.indexOf(element) === 1) {
            columnClass = "client-mail-leftBlock-contactBlock-list-objet";
          }
          if (titleList.indexOf(element) === 2) {
            columnClass = "client-mail-leftBlock-contactBlock-list-statut";
          }

          return (
            <li key={index} className={columnClass}>
              {element}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
