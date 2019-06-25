import React from "react";
import TalentLine from "../TalentList_TalentLine";
import "./index.css";

export default function TalentList(props) {
  const { talentList, deleteCheckBox, deleteArray } = props;

  return (
    <div className="talentList-right-block-list">
      {talentList.map((element, index) => {
        return (
          <TalentLine
            talent={element}
            key={index}
            deleteCheckBox={id => {
              deleteCheckBox(id);
            }}
            deleteArray={deleteArray}
          />
        );
      })}
    </div>
  );
}
