import React from "react";
import box from "../../features/icons/check_24px.svg";
import "./index.css";

export default function ClientMail_Conversations({
  conversations,
  handleClickConversation
}) {
  return (
    <div className="client-mail-leftBlock-contactBlock-list-contact">
      {conversations.map(conversation => {
        return (
          <ul
            key={conversation._id}
            onClick={() => {
              handleClickConversation(conversation);
            }}
          >
            <li className="client-mail-leftBlock-contactBlock-list-checkBox">
              <img
                className="client-mail-contactblock-box"
                src={box}
                alt="box cochée"
              />
            </li>
            <li className="client-mail-leftBlock-contactBlock-list-talent">{`${
              conversation.contactFirstName
            } ${conversation.contactLastName}`}</li>
            <li className="client-mail-leftBlock-contactBlock-list-objet">
              {conversation.title}
            </li>
            <li className="client-mail-leftBlock-contactBlock-list-statut">
              {conversation.status === "accepted" && <span>Accepté</span>}
              {conversation.status === "process" && <span>En Cours</span>}
              {conversation.status === "declined" && <span>Refusé</span>}
            </li>
          </ul>
        );
      })}
    </div>
  );
}
