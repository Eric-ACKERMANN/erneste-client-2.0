import React from "react";
import "./index.css";

export default function ClientMail_Messages({
  contactShown,
  conversationShown,
  handleClickObject,
  handleClickMessage,
  handleClickAnswer,
  handleClickDeleteMessage,
  handleBlurAnswer,
  handleChangeMessageAnswer,
  handleKeyUpTextarea,
  handleSubmitAnswer,
  objectShown,
  clientData,
  textAreaAnswer,
  textAreaHeight
}) {
  if (contactShown && conversationShown) {
    return (
      <div className="client-mail-rightBlock">
        <div className="client-mail-conversationShown-container">
          <div className="client-mail-conversationShown-name">
            {`${contactShown.informations.firstName} ${
              contactShown.informations.lastName
            }`}
          </div>
          <div className="client-mail-conversationShown-title-block">
            <div className="client-mail-conversationShown-object">
              <span>{conversationShown.title}</span>
              <i
                onClick={() => {
                  handleClickObject();
                }}
                className={
                  objectShown ? "far fa-minus-square" : "far fa-plus-square"
                }
              />
            </div>
            <p
              className={
                objectShown
                  ? "client-mail-conversationShown-firstMessage"
                  : "client-mail-conversationShown-firstMessage-shrinked"
              }
            >
              {conversationShown.messages[0].body}
            </p>
            <div className="client-mail-conversationShown-link">
              <span>Fiche de poste proposée</span>{" "}
              <span>(Not available - coming soon)</span>
            </div>
          </div>

          {/* Message display*/}
          {conversationShown.status === "accepted" && (
            <div>
              {conversationShown.messages.map(message => {
                if (conversationShown.messages.indexOf(message) !== 0) {
                  return (
                    <div
                      key={message._id}
                      className="client-mail-conversationShown-messageBlock"
                    >
                      <div>
                        {message.action === "received" ? (
                          <img
                            className="client-mail-conversationShown-picture"
                            alt="portrait of talent"
                            src={contactShown.informations.photo}
                          />
                        ) : (
                          <img
                            className="client-mail-logo-company"
                            alt="logo of company"
                            src={clientData.logo}
                          />
                        )}
                      </div>
                      <div
                        className={
                          message.displayedFull
                            ? "client-mail-conversationShown-message"
                            : "client-mail-conversationShown-message messageshrink"
                        }
                      >
                        {message.body}
                      </div>
                      <div className="client-mail-conversationShown-trash">
                        <i
                          onClick={() => {
                            handleClickMessage(message);
                          }}
                          className={
                            message.displayedFull
                              ? "far fa-minus-square"
                              : "far fa-plus-square"
                          }
                        />
                        <i
                          className="far fa-trash-alt"
                          onClick={() => handleClickDeleteMessage(message)}
                        />
                      </div>
                    </div>
                  );
                } else return false;
              })}

              <div className="client-mail-conversationShown-messageBlock">
                <div className="client-mail-conversationShown-picture-company">
                  <img
                    className="client-mail-logo-company"
                    alt="logo of company"
                    src={clientData.logo}
                  />
                </div>
                <div className="client-mail-conversationShown-message">
                  <textarea
                    id="textArea"
                    value={textAreaAnswer}
                    onChange={event =>
                      handleChangeMessageAnswer(event.target.value)
                    }
                    placeholder="Ecrivez votre réponse ici..."
                    onClick={handleClickAnswer}
                    onBlur={handleBlurAnswer}
                    onKeyUp={() => {
                      handleKeyUpTextarea(document.getElementById("textArea"));
                    }}
                    style={{ height: textAreaHeight }}
                  />
                </div>
              </div>
              <div className="client-mail-conversationShown-buttons">
                {textAreaAnswer !== "" ? (
                  <div
                    className="client-mail-conversationShown-send"
                    onClick={() => handleSubmitAnswer()}
                  >
                    Envoyer
                  </div>
                ) : (
                  <div className="client-mail-conversationShown-send-disabled">
                    Envoyer
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else return null;
}
