import React from "react";
import Select from "../../reactComponent/Select";
import { selectStyle } from "../../reactComponent/Select/Select_Style";
import Button from "../Button";
import ClickListener from "./ClickListener";

export default function PopUp({
  popUpId,
  titleName,
  logoCancel,
  inputs,
  button,
  togglePopUp
}) {
  return (
    <div className="popUp" id={popUpId}>
      <ClickListener
        onClick={togglePopUp}
        listenInside={false}
        className={"popUp_clikListener"}
      >
        <div className="popUp-content">
          <div className="popUp-header">
            <span>{titleName}</span>
            {logoCancel}
          </div>
          <div className="popUp-body">
            {inputs.map((input, index) => {
              return (
                <div key={index} className="popUp-body-selectBlock">
                  <span>{input.title}</span>
                  <Select
                    searchable={input.searchable}
                    value={input.inputValue}
                    options={input.options ? [...input.options] : []}
                    placeholder={input.placeholder}
                    setValue={input.setValueInput}
                    id={input.id}
                    style={{ ...selectStyle }}
                  />
                </div>
              );
            })}

            <div className="popUp-buttons">
              {button.map(element => {
                return (
                  <Button
                    className={`${element.type} popUp-button`}
                    onClick={() => element.onClick()}
                    children={element.text}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ClickListener>
    </div>
  );
}
