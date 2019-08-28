import React from "./node_modules/react";

export default function Input({
  readOnly,
  style,
  myRef,
  value,
  onKeyDown,
  onChange,
  onBlur,
  id
}) {
  if (readOnly) {
    return (
      <input
        id={id}
        readOnly
        ref={myRef}
        value={""}
        style={inputStyle(style, id, readOnly)}
        onKeyDown={onKeyDown}
      />
    );
  } else {
    return (
      <input
        id={id}
        style={inputStyle(style, id)}
        ref={myRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur ? onBlur : undefined}
      />
    );
  }
}

const inputStyle = function(style, id) {
  let numberChar = document.getElementById(id);
  let inputStyle = { ...style };
  if (numberChar !== null) {
    let inputWidth = `${numberChar.value.length + 1}ch`;
    style.width = inputWidth;
  } else {
    style.width = "5px";
  }
  return inputStyle;
};

Input.propTypes = {};

Input.defaultProps = {};
