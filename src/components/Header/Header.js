import React from "react";
import { Link } from "react-router-dom";
import logo from "../../features/img/logo.svg";

import "./index.css";

export default function Header(props) {
  let classNameAdminClient = "";
  let classNameAdminTalent = "";
  let classNameAdminConfig = "";
  let classNameTalentOpportunities = "";
  let classNameTalentProfil = "";
  let classNameClientWelcome = "";
  let classNameClientMail = "";

  // ------ ADMIN ------ //
  if (props.pageType === "admin/client") {
    classNameAdminClient = "headerAdmin-tools-active";
  } else {
    classNameAdminClient = "headerAdmin-tools-inactive";
  }
  if (props.pageType === "admin/talent") {
    classNameAdminTalent = "headerAdmin-tools-active";
  } else {
    classNameAdminTalent = "headerAdmin-tools-inactive";
  }
  if (props.pageType === "admin/config") {
    classNameAdminConfig = "headerAdmin-tools-active";
  } else {
    classNameAdminConfig = "headerAdmin-tools-inactive";
  }
  // ------ TALENT ------ //
  if (props.pageType === "talent") {
    classNameTalentProfil = "headerAdmin-tools-active";
    classNameTalentOpportunities = "headerAdmin-tools-inactive";
  }
  if (props.pageType === "talent/opportunities") {
    classNameTalentProfil = "headerAdmin-tools-inactive";
    classNameTalentOpportunities = "headerAdmin-tools-active";
  }

  // ------- CLIENT ------ //

  if (props.pageType === "client") {
    classNameClientWelcome = "headerAdmin-tools-active";
    classNameClientMail = "headerAdmin-tools-inactive";
  }
  if (props.pageType === "client/mail") {
    classNameClientWelcome = "headerAdmin-tools-inactive";
    classNameClientMail = "headerAdmin-tools-active";
  }
  return (
    <header>
      <div className="headerAdmin-container">
        <img className="headerAdmin-image" src={logo} alt="Erneste Logo" />

        {/* ------------------------- */}
        {/* ------ ADMIN PAGES ------ */}
        {/* ------------------------- */}

        {(props.pageType === "admin/talent" ||
          props.pageType === "admin/client" ||
          props.pageType === "admin/config") && (
          <div className="headerAdmin-tools">
            {/* Link to Talent-List */}
            <Link className="linkDecoration" to={`/admin/talent-list`}>
              <span className={classNameAdminTalent}>Talents</span>
            </Link>
            {/* Link to Client-List */}
            <Link className="linkDecoration" to={`/admin/client-list`}>
              <span className={classNameAdminClient}>Clients</span>
            </Link>
            {/* Link to Configuration */}
            <Link className="linkDecoration" to={`/admin/config`}>
              <i className={`fas fa-cog ${classNameAdminConfig}`} />
            </Link>
            {/* Log Out Bouton */}
            <div
              onClick={props.handleClickLogOut}
              className="headerAdmin-tools-logOut"
            >
              <i className="fas fa-power-off" />
            </div>
          </div>
        )}

        {/* ------------------------- */}
        {/* ------ TALENT PAGES ----- */}
        {/* ------------------------- */}

        {(props.pageType === "talent" ||
          props.pageType === "talent/opportunities") && (
          <div className="headerAdmin-tools">
            {/* Link to Opportunities */}
            <Link
              className="linkDecoration"
              to={`/talent/opportunities/${props.userID}`}
            >
              <i
                className={`fas fa-envelope ${classNameTalentOpportunities} `}
              />
            </Link>
            {/* Link to the Profile */}
            <Link className="linkDecoration" to={`/talent/${props.userID}`}>
              <i className={`fas fa-user ${classNameTalentProfil}`} />
            </Link>
            {/* Log Out Bouton */}
            <div
              onClick={props.handleClickLogOut}
              className="headerAdmin-tools-logOut"
            >
              <i className="fas fa-power-off" />
            </div>
          </div>
        )}

        {/* ------------------------- */}
        {/* ------ CLIENT PAGES ----- */}
        {/* ------------------------- */}

        {(props.pageType === "client" || props.pageType === "client/mail") && (
          <div className="headerAdmin-tools">
            {/* Link to Welcome page */}
            <Link className="linkDecoration" to={`/client/${props.userID}`}>
              <span className={classNameClientWelcome}>Accueil</span>
            </Link>
            {/* Link to Mail page */}
            <Link
              className="linkDecoration"
              to={`/client/mail/${props.userID}`}
            >
              <i className={`fas fa-envelope ${classNameClientMail} `} />
            </Link>
            {/* Log Out Bouton */}
            <div
              onClick={props.handleClickLogOut}
              className="headerAdmin-tools-logOut"
            >
              <i className="fas fa-power-off" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
