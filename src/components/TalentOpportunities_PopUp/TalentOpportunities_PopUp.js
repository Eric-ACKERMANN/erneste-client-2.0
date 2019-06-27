import React from "react";
import "./index.css";

export default function TalentOpportunitiesPopUp({
  type,
  cancelPopUp,
  messageValue,
  setMessage,
  sendMessage
}) {
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
            {type
              ? "Ecrivez ici votre réponse à cette opportunité"
              : "Ecrivez ici la raison pour laquelle vous avez refusé cette proposition "}
          </span>
          <textarea
            className="opportunitiesPopUp-textArea"
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
