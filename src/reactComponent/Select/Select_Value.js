import React from "react";
import Input from "./Select_input";
import ValueMulti from "./Select_ValueMulti";

export default function Value({
  style,
  valueInput,
  multiSelect,
  wrap,
  value,
  inputProps,
  multiValueProps
}) {
  return (
    <div
      style={
        multiSelect || (!valueInput && !multiSelect)
          ? valueStyle(style, multiSelect, wrap)
          : { display: "none" }
      }
    >
      {multiSelect ? (
        <ValueMulti
          value={value}
          style={style}
          multiValueProps={multiValueProps}
        />
      ) : (
        value
      )}

      {multiSelect && (
        <Input
          readOnly={inputProps.readOnly}
          id={inputProps.id}
          myRef={inputProps.myRef}
          value={inputProps.value}
          style={inputProps.style}
          onChange={inputProps.onChange}
          onKeyDown={inputProps.onKeyDown}
          onBlur={inputProps.onBlur}
        />
      )}
    </div>
  );
}

const multiWrap = function(style) {
  style.flexWrap = "wrap";
  return style;
};
const multiSelectStyle = function(style, wrap) {
  if (wrap) {
    style = multiWrap(style);
  }
  return style;
};
const valueStyle = function(style, multiSelect, wrap) {
  if (multiSelect) {
    style = multiSelectStyle(style, wrap);
  } else {
    style.position = "absolute";
  }
  return style;
};
