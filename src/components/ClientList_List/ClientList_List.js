import React from "react";
import { Link } from "react-router-dom";

export default function ClientList_List({ clientList, renderStars }) {
  return (
    <div>
      {clientList.map((client, index) => {
        const field = { ...client.field };
        return (
          <Link
            key={index}
            to={`/admin/client/${client._id}`}
            className="hover-clientList-right-block"
          >
            <ul className="clientListItem">
              <li>{renderStars(client, index)}</li>
              <li>{client.name}</li>
              <li>{field.name}</li>
              <li>{client.size}</li>
              <li>{client.users.length}</li>
              <li>{client.recruited ? client.recruited : "0"}</li>
            </ul>
          </Link>
        );
      })}
    </div>
  );
}
