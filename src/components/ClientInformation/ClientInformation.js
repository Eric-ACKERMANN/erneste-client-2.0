import React from "react";
import "./index.css";
import ReactFileReader from "react-file-reader";

export default function ClientInformation({
  clientName,
  clientField,
  clientSize,
  setPhoto,
  setSearch,
  clientLogo,
  clientUsers,
  hoverOn,
  hoverOff,
  renderStars,
  talentSearch,
  hoverContact,
  hoverMessage
}) {
  // setSearch = e => {
  //   this.setState({ talentSearch: e.target.value });
  // };

  // handleFiles = files => {
  //   this.props.setPhoto(files.base64);
  // };

  // renderStars(item) {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     if (i < item.rating) {
  //       stars.push(<i key={i} className="fas fa-star" />);
  //     } else {
  //       stars.push(<i key={i} className="far fa-star" />);
  //     }
  //   }
  //   return (
  //     <div style={{ flexDirection: "row", alignItems: "center" }}>{stars}</div>
  //   );
  // }
  return (
    <div className="client-information-container">
      <div className="client-information-detail-container">
        <ReactFileReader
          fileTypes={[".png", ".jpg"]}
          base64={true}
          multipleFiles={false}
          handleFiles={files => setPhoto(files.base64)}
        >
          {clientLogo !== null ? (
            <span className="client-information-picture-container">
              <img
                className="client-information-picture"
                src={clientLogo}
                alt="logo of"
              />
            </span>
          ) : (
            <div className="client-information-empty-picture">
              <div className="client-information-text-empty-picture">
                Cliquez pour ajouter une photo
              </div>
            </div>
          )}
        </ReactFileReader>
        <div className="client-information-detail">
          <div className="client-information-name">{clientName}</div>
          <div style={{ display: "flex" }}>
            <div className="client-information-field">{clientField}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div className="client-information-size">{clientSize}</div>
          </div>
        </div>
      </div>
      <div className="client-information-talent-container">
        <div className="client-information-talent-search">
          <div className="client-information-magnifier">
            <i className="fas fa-search" />
          </div>

          <input
            value={talentSearch}
            onChange={setSearch}
            placeholder="Recherche talent, état"
          />
        </div>

        <div>
          <ul className="client-information-talent-list-title">
            <li>Utilisateur</li>
            <li>Talent contacté</li>
            <li>Etat</li>
            <li>Note</li>
          </ul>
          {clientUsers &&
            clientUsers.map(user => {
              if (user.conversations) {
                return user.conversations.map(conversation => {
                  return (
                    <ul
                      className="client-information-talent-list-title"
                      key={conversation._id}
                    >
                      <li>
                        {user.firstName} {user.lastName}
                      </li>
                      <li>
                        {conversation.contactFirstName}{" "}
                        {conversation.contactLastName}
                      </li>
                      <li>
                        {conversation.status === "accepted" && (
                          <span>Contact accepté</span>
                        )}
                        {conversation.status === "declined" && (
                          <div>
                            <span
                              className="client-information-contact-refused"
                              onMouseEnter={() => {
                                hoverOn({
                                  body: conversation.messages[1].body,
                                  date: conversation.messages[1].date
                                });
                              }}
                              onMouseLeave={hoverOff}
                            >
                              Contact refusé
                            </span>

                            {hoverContact && (
                              <div className="client-information-contact-refused-hover">
                                <span>{hoverMessage.body}</span>
                                <span>{hoverMessage.date}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {conversation.status === "process" && (
                          <span>Contact en cours</span>
                        )}
                      </li>
                      <li>{renderStars(conversation)}</li>
                    </ul>
                  );
                });
              } else return false;
            })}
        </div>
      </div>
    </div>
  );
}
