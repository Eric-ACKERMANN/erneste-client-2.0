import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import box from "../../features/icons/check_24px.svg";
import checkedbox from "../../features/icons/check_24px copy.svg";

export default function TalentLine(props) {
  const { talent, deleteCheckBox, deleteArray } = props;

  let deleteCheckBoxStyle =
    deleteArray.indexOf(talent._id) !== -1 ? (
      <img className="deleteCheck " src={box} alt="box cochée" />
    ) : (
      <img className="deleteUncheck " src={checkedbox} alt="box non cochée" />
    );

  let classNameStatus = "";
  switch (talent.informations.status) {
    case "0":
      classNameStatus = "statut0";
      break;
    case "Recherche active":
      classNameStatus = "statut1";
      break;
    case "Ouvert(e) aux opportunités":
      classNameStatus = "statut2";
      break;
    case "Ne pas être contacté(e)":
      classNameStatus = "statut3";
      break;
    case "Embauché(e) par Erneste":
      classNameStatus = "statut4";
      break;
    default:
      classNameStatus = "statut0";
  }

  return (
    <div className="talentList-right-block-line">
      <div
        className="talentList-right-block-deleteBox"
        onClick={() => {
          deleteCheckBox(talent._id);
        }}
      >
        {deleteCheckBoxStyle}
      </div>
      {/* NAME */}
      <Link
        to={`/admin/talent/${talent._id}`}
        className="talentList-right-block-name"
      >
        {`${talent.informations.firstName} ${talent.informations.lastName}`}
      </Link>

      {/* ACTUAL TITLE */}
      <div className="talentList-right-block-actualTitle">
        {talent.informations.actualTitle}
      </div>
      {/* ACTUAL COMPANY */}
      <div className="talentList-right-block-actualCompany">
        {talent.informations.actualCompany}
      </div>

      {/* WANTED TITLE */}
      <div className="talentList-right-block-wantedTitle talentLine-wantedTitle">
        {talent.informations.wantedTitle.map((element, index) => {
          return <div key={index}>{element.name}</div>;
        })}
      </div>

      {/* VALIDATED */}
      <div className="talentList-right-block-validated">
        {talent.validated && <i className="fas fa-check" />}
        {!talent.validated && <i className="fas fa-times" />}
      </div>

      {/* STATUS */}
      <div className="talentList-right-block-status">
        <div className={classNameStatus} />
      </div>

      {/* LAST UPDATE*/}
      <div className="talentList-right-block-lastUpdate">
        {talent.lastUpdate}
      </div>
    </div>
  );
}
