import React from "react";
import "./index.css";

export default function ClientWelcomePopUp(props) {
  const {
    cancelPopUp,
    objectValue,
    messageValue,
    setObject,
    setMessage,
    sendMessage,
    talent
  } = props;
  return (
    <div className="contactPopUp-background">
      <div className="contactPopUp">
        <div className="contactPopUp-header">
          <span className="contactPopUp-header-title">Contacter</span>
          <i
            className="fas fa-times contactPopUp-header-cancel"
            onClick={cancelPopUp}
          />
        </div>
        <div className="contactPopUp-body">
          <span className="contactPopUp-subtitle">Objet</span>
          <input
            className="contactPopUp-input"
            value={objectValue}
            onChange={event => {
              setObject(event.target.value);
            }}
          />
          <span className="contactPopUp-subtitle">Messages</span>
          <textarea
            className="contactPopUp-textArea"
            value={messageValue}
            placeholder="Messages"
            onChange={event => {
              setMessage(event.target.value);
            }}
          />
          <div className="contactPopUp-add">
            <div className="contactPopUp-addButton">
              <i className="fas fa-paperclip contactPopUp-add-attachment" />
              <span>Ajouter pièce jointe</span>
            </div>
          </div>
          <div className="contactPopUp-added">Pièce jointe téléchargée</div>
          <div className="contactPopUp-buttons">
            <div className="contactPopUp-cancel" onClick={cancelPopUp}>
              Annuler
            </div>
            <div
              className="contactPopUp-send"
              onClick={() => sendMessage(talent.profil.informations.email)}
            >
              Envoyer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
