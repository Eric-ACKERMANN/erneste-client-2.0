import React from "react";

export default function Placeholder({ value, style }) {
  return (
    <div style={placeholder({ ...style.value }, { ...style.placeholder })}>
      {value}
    </div>
  );
}

const placeholder = function(styleV, styleP) {
  const keysP = Object.keys(styleP);
  keysP.forEach(key => {
    styleV[key] = styleP[key];
  });
  return styleV;
};
