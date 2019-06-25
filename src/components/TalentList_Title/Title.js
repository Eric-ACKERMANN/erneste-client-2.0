import React from "react";
import "./index.css";

export default function Title(props) {
  return (
    <div>
      <div className="specialTitle title-size">Talents</div>
      <div className="CTA subtitle-size">{`Affichés : ${
        props.talentList.length
      }`}</div>
    </div>
  );
}
