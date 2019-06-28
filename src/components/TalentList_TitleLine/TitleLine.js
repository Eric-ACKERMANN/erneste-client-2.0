import React from "react";
import "./index.css";
import box from "../../features/icons/check_24px.svg";
import checkedbox from "../../features/icons/check_24px copy.svg";

export default function TitleLine(props) {
  const {
    titleArray,
    chevronClickedPosition,
    chevronFilter,
    talentListNonFiltered,
    ArrayOfFilteredTalentList
  } = props;

  // test if a chevron is clicked. If it is, the chevronClicked becomes true to enable the filter choice to appear
  let chevronClicked = false;
  for (let i = 0; i < titleArray.length; i++) {
    if (titleArray[i].clicked === true) {
      chevronClicked = true;
      break;
    } else {
      chevronClicked = false;
    }
  }

  // Create an array with only actualTitle displayed
  const actualTitleArray = [];
  let actualTitlePosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("actualTitle");
  let actualTitleListOfReference = [];

  if (actualTitlePosition === -1) {
    actualTitleListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    actualTitleListOfReference = ArrayOfFilteredTalentList[actualTitlePosition];
  }
  if (actualTitleListOfReference) {
    for (let i = 0; i < talentListNonFiltered.length; i++) {
      if (
        actualTitleArray.indexOf(
          talentListNonFiltered[i].informations.actualTitle
        ) === -1
      ) {
        actualTitleArray.push(
          talentListNonFiltered[i].informations.actualTitle
        );
      }
    }
  }
  actualTitleArray.sort();

  // Create an array with only actualCompany displayed
  const actualCompanyArray = [];
  let actualCompanyPosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("actualCompany");

  let actualCompanyListOfReference = [];

  if (actualCompanyPosition === -1) {
    actualCompanyListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    actualCompanyListOfReference =
      ArrayOfFilteredTalentList[actualCompanyPosition];
  }
  if (actualCompanyListOfReference) {
    for (let i = 0; i < actualCompanyListOfReference.length; i++) {
      if (
        actualCompanyArray.indexOf(
          actualCompanyListOfReference[i].informations.actualCompany
        ) === -1
      ) {
        actualCompanyArray.push(
          actualCompanyListOfReference[i].informations.actualCompany
        );
      }
    }
  }
  actualCompanyArray.sort();

  // Create an array with only wantedTitle displayed
  const wantedTitleArray = [];
  let wantedTitlePosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("wantedTitle");
  let wantedTitleListOfReference = [];

  if (wantedTitlePosition === -1) {
    wantedTitleListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    wantedTitleListOfReference = ArrayOfFilteredTalentList[wantedTitlePosition];
  }
  if (wantedTitleListOfReference) {
    for (let i = 0; i < wantedTitleListOfReference.length; i++) {
      for (
        let j = 0;
        j < wantedTitleListOfReference[i].informations.wantedTitle.length;
        j++
      ) {
        if (
          wantedTitleArray.indexOf(
            wantedTitleListOfReference[i].informations.wantedTitle[j]
          ) === -1
        ) {
          wantedTitleArray.push(
            wantedTitleListOfReference[i].informations.wantedTitle[j]
          );
        }
      }
    }
  }
  wantedTitleArray.sort();

  // Create an array with only Validated displayed
  const validatedArray = [];
  let validatedPosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("validated");
  let validatedListOfReference = [];

  if (validatedPosition === -1) {
    validatedListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    validatedListOfReference = ArrayOfFilteredTalentList[validatedPosition];
  }
  if (validatedListOfReference) {
    for (let i = 0; i < validatedListOfReference.length; i++) {
      if (
        validatedArray.indexOf(
          validatedListOfReference[i].validated.toString()
        ) === -1
      ) {
        validatedArray.push(validatedListOfReference[i].validated.toString());
      }
    }
  }
  validatedArray.sort();

  // Create an array with only status displayed
  const statusArray = [];
  let statusPosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("status");
  let statusListOfReference = [];

  if (statusPosition === -1) {
    statusListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    statusListOfReference = ArrayOfFilteredTalentList[statusPosition];
  }
  if (statusListOfReference) {
    for (let i = 0; i < statusListOfReference.length; i++) {
      if (
        statusArray.indexOf(statusListOfReference[i].informations.status) === -1
      ) {
        statusArray.push(statusListOfReference[i].informations.status);
      }
    }
  }
  statusArray.sort();

  // Create an array with only lastUpdate displayed
  const lastUpdateArray = [];
  let lastUpdatePosition = chevronFilter
    .map(element => {
      return element.title;
    })
    .indexOf("lastUpdate");
  let lastUpdateListOfReference = [];
  if (lastUpdatePosition === -1) {
    lastUpdateListOfReference =
      ArrayOfFilteredTalentList[ArrayOfFilteredTalentList.length - 1];
  } else {
    lastUpdateListOfReference = ArrayOfFilteredTalentList[lastUpdatePosition];
  }
  if (lastUpdateListOfReference) {
    for (let i = 0; i < lastUpdateListOfReference.length; i++) {
      if (
        lastUpdateArray.indexOf(lastUpdateListOfReference[i].lastUpdate) === -1
      ) {
        lastUpdateArray.push(lastUpdateListOfReference[i].lastUpdate);
      }
    }
  }

  return (
    <div className="talentList-right-block-title">
      <div className="talentList-right-block-deleteBox" />
      {/* NAME */}
      <div className="talentList-right-block-name">{titleArray[0].value}</div>

      {/*ACTUAL TITLE*/}
      <div className="talentList-right-block-actualTitle">
        <div onClick={() => props.chevronClick(titleArray[1].value)}>
          {titleArray[1].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 1 && (
          // Box
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {actualTitleArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element &&
                    chevronFilter[i].title === "actualTitle"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("actualTitle", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>

                  <div>{element}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* ACTUAL COMPANY */}
      <div className="talentList-right-block-actualCompany">
        <div onClick={() => props.chevronClick(titleArray[2].value)}>
          {titleArray[2].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 2 && (
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {actualCompanyArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element &&
                    chevronFilter[i].title === "actualCompany"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("actualCompany", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>
                  <span>{element}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* WANTED TITLE */}
      <div className="talentList-right-block-wantedTitle">
        <div onClick={() => props.chevronClick(titleArray[3].value)}>
          {titleArray[3].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 3 && (
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {wantedTitleArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element &&
                    chevronFilter[i].title === "wantedTitle"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("wantedTitle", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>
                  <span>{element.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VALIDATED */}
      <div className="talentList-right-block-validated">
        <div onClick={() => props.chevronClick(titleArray[4].value)}>
          {titleArray[4].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 4 && (
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {validatedArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element.toString() &&
                    chevronFilter[i].title === "validated"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("validated", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>
                  {element === "false" && <span>Non-validé</span>}
                  {element === "true" && <span>Validé</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* STATUS */}
      <div className="talentList-right-block-status">
        <div onClick={() => props.chevronClick(titleArray[5].value)}>
          {titleArray[5].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 5 && (
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {statusArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element &&
                    chevronFilter[i].title === "status"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("status", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>
                  <span>{element}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LAST UPDATE */}
      <div className="talentList-right-block-lastUpdate">
        <div onClick={() => props.chevronClick(titleArray[6].value)}>
          {titleArray[6].value}
          <i className="fas fa-sort-down" />
        </div>
        {chevronClicked && chevronClickedPosition === 6 && (
          <div
            className="chevron-filter"
            tabIndex="0"
            onBlur={() => props.onBlurChevron()}
          >
            {lastUpdateArray.map((element, index) => {
              let clicked = false;
              for (let i = 0; i < chevronFilter.length; i++) {
                for (let j = 0; j < chevronFilter[i].filter.length; j++) {
                  if (
                    chevronFilter[i].filter[j] === element &&
                    chevronFilter[i].title === "lastUpdate"
                  ) {
                    clicked = true;
                  }
                }
              }
              return (
                <div key={index} className="filter-line">
                  <div
                    onClick={() => {
                      props.filterCheckBox("lastUpdate", element);
                    }}
                  >
                    {clicked ? (
                      <img
                        className="deleteCheck "
                        src={box}
                        alt="box cochée"
                      />
                    ) : (
                      <img
                        className="deleteUncheck "
                        src={checkedbox}
                        alt="box non cochée"
                      />
                    )}
                  </div>
                  <span>{element}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
