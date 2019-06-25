import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

export default function AddTalent(props) {
  return (
    <Link to={`/admin/talent-create`}>
      <div className="all-button-add-talent">
        <i className="fas fa-plus" />
        <button>Ajouter un talent</button>
      </div>
    </Link>
  );
}
