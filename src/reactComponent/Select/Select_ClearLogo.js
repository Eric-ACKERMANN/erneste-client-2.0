import React from "react";

export default function ClearLogo({ value, style, onClick }) {
  return (
    <div onClick={onClick} style={style}>
      {value}
    </div>
  );
}
