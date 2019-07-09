import React from "react";
import "./index.css";

export default function TalentOpportunities_Messages({
  conversationShown,
  objectShown,
  textAreaHeight,
  textAreaAnswer,
  talentProfile,
  handleClickMessage,
  handleClickAnswer,
  handleClickObject,
  handleClickDeleteMessage,
  handleChangeAnswer,
  handleKeyUpTextarea,
  handleSubmitAnswer,
  handleBlurAnswer,
  setPopUpType,
  renderStars
}) {
  return (
    <div className="client-mail-leftBlock-contactBlock-list-contact">
      <div className="talent-opportunities-conversationShown-container">
        <div className="talent-opportunities-conversationShown-name">
          {conversationShown.companyName}
        </div>
        <div className="talent-opportunities-conversationShown-title-block">
          <div className="talent-opportunities-conversationShown-object">
            <span>{conversationShown.title}</span>
            <span>
              {conversationShown.rating && renderStars(conversationShown)}
            </span>
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
                ? "talent-opportunities-conversationShown-firstMessage"
                : "talent-opportunities-conversationShown-firstMessage-shrinked"
            }
          >
            {conversationShown.messages[0].body}
          </p>
          <div className="talent-opportunities-conversationShown-link">
            <div>
              <span>Fiche de poste proposée</span>{" "}
              <span>(Not available - coming soon)</span>
            </div>

            {conversationShown.status === "process" && (
              <div>
                <div onClick={() => setPopUpType(false)}>
                  <i className="fas fa-times" />
                </div>
                <div onClick={() => setPopUpType(true)}>Répondre</div>
              </div>
            )}
          </div>
        </div>

        {conversationShown.status === "declined" && (
          <div className="talent-opportunities-conversationShown-declined">
            Vous avez refusé cette offre, vous ne pouvez plus y répondre
          </div>
        )}
        {conversationShown.status === "accepted" && (
          <div>
            {conversationShown.messages.map(message => {
              if (conversationShown.messages.indexOf(message) !== 0) {
                return (
                  <div
                    key={message._id}
                    className="talent-opportunities-conversationShown-messageBlock"
                  >
                    <div>
                      {message.action === "received" ? (
                        <img
                          className="talent-opportunities-logo-company"
                          alt="logo of company"
                          src={conversationShown.companyLogo}
                        />
                      ) : (
                        <img
                          className="talent-opportunities-picture-talent"
                          alt="portrait of talent"
                          src={
                            talentProfile
                              ? talentProfile.informations.photo
                              : "Photo talent"
                          }
                        />
                      )}
                    </div>
                    <div
                      className={
                        message.displayedFull
                          ? "talent-opportunities-conversationShown-message"
                          : "talent-opportunities-conversationShown-message messageshrink"
                      }
                    >
                      {message.body}
                    </div>
                    <div className="talent-opportunities-conversationShown-delete">
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

            <div className="talent-opportunities-conversationShown-messageBlock">
              <div className="talent-opportunities-conversationShown-picture">
                <img
                  className="talent-opportunities-picture-talent"
                  alt="portrait of talent"
                  src={
                    talentProfile
                      ? talentProfile.informations.photo
                      : "Photo talent"
                  }
                />
              </div>
              <div className="talent-opportunities-conversationShown-message">
                <textarea
                  id="textArea"
                  value={textAreaAnswer}
                  onChange={event => handleChangeAnswer(event.target.value)}
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
            <div className="talent-opportunities-conversationShown-buttons">
              {textAreaAnswer !== "" ? (
                <div
                  className="talent-opportunities-conversationShown-send"
                  onClick={() => handleSubmitAnswer()}
                >
                  Envoyer
                </div>
              ) : (
                <div className="talent-opportunities-conversationShown-send-disabled">
                  Envoyer
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
