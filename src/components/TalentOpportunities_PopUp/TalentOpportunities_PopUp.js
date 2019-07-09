import React from "react";
import "./index.css";

export default function TalentOpportunitiesPopUp({
  type,
  cancelPopUp,
  messageValue,
  setMessage,
  sendMessage,
  offerRating,
  offerRate,
  error
}) {
  let starArray = Array(5).fill(null);
  let errorValue = "";
  let errorRating = "";
  if (error.value) {
    errorValue = errorValue + "opportunitiesPopUp-errorValue";
  }
  if (error.rating) {
    errorRating = errorRating + "opportunitiesPopUp-errorRating";
  }

  return (
    <div className="opportunitiesPopUp-background">
      <div className="opportunitiesPopUp">
        <div className="opportunitiesPopUp-header">
          <span className="opportunitiesPopUp-header-title">
            {type
              ? "Répondez à cette opportunité"
              : "Qu'est ce qui n'allait pas ?"}
          </span>
          <i
            className="fas fa-times opportunitiesPopUp-header-cancel"
            onClick={cancelPopUp}
          />
        </div>
        <div className="opportunitiesPopUp-body">
          <span className="opportunitiesPopUp-subtitle">
            Quelle note donneriez vous à cette opportunité vis-à-vis de votre
            projet professionnel ?{" "}
            <span className="opportunitiesPopUp-note">
              (Cette note ne sera visible que par l'équipe Erneste)
            </span>
          </span>
          <div
            className={"opportunitiesPopUp-body-stars " + errorRating}
            onMouseLeave={() => {
              offerRating(0, "leave");
            }}
          >
            {starArray.map((e, index) => (
              <i
                key={index}
                className={
                  index + 1 > offerRate.rating ? "far fa-star" : "fas fa-star"
                }
                onMouseOver={() => {
                  offerRating(index + 1, "temp");
                }}
                onClick={() => {
                  offerRating(index + 1, "set");
                }}
              />
            ))}
          </div>
          <span className="opportunitiesPopUp-subtitle">
            {type
              ? "Ecrivez ici votre réponse à cette opportunité"
              : "Ecrivez ici la raison pour laquelle vous avez refusé cette proposition "}
          </span>
          <textarea
            className={"opportunitiesPopUp-textArea " + errorValue}
            value={messageValue}
            placeholder="Messages"
            onChange={event => {
              setMessage(event.target.value);
            }}
          />
          <div className="opportunitiesPopUp-buttons">
            <div className="opportunitiesPopUp-cancel" onClick={cancelPopUp}>
              Annuler
            </div>
            <div
              className="opportunitiesPopUp-send"
              onClick={() => sendMessage()}
            >
              Envoyer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
