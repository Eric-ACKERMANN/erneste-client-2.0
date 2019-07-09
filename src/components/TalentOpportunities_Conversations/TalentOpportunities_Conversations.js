import React from "react";
import "./index.css";

export default function TalentOpportunities_Conversations({
  conversations,
  handleClickConversation
}) {
  return (
    <div className="talent-opportunities-leftBlock-contactBlock-list-contact">
      {conversations.map(conversation => {
        return (
          <ul
            key={conversation._id}
            onClick={() => handleClickConversation(conversation)}
          >
            <li>{conversation.companyName}</li>
            <li>{conversation.title}</li>
            <li>{conversation.messages[0].date}</li>
          </ul>
        );
      })}
    </div>
  );
}
