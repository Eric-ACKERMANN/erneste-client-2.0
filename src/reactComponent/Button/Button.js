import React from "react";

export default function Button({
  className,
  logoPosition,
  logo,
  children,
  onClick
}) {
  return (
    <button className={`${className}`} onClick={() => onClick()}>
      {logoPosition === -1 && (
        <span style={{ marginRight: "10px" }}>{logo}</span>
      )}
      {children}
      {logoPosition === 1 && <span style={{ marginLeft: "10px" }}>{logo}</span>}
    </button>
  );
}

Button.defaultProps = {
  className: "btn-primary",
  logoPosition: 0,
  logo: <span>Logo</span>,
  onClick: null
};
