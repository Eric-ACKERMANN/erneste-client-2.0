import React from "react";
import "./index.css";

export default function TalentOpportunities_Titles({ titleList }) {
  return (
    <div className="talent-opportunities-leftBlock-contactBlock-list-title">
      <ul>
        {titleList.map(element => {
          return <li key={element}>{element}</li>;
        })}
      </ul>
    </div>
  );
}
