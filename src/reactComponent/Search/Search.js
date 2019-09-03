import React from "react";
import "../../index.css";

export default function Search({ input, setInput, clearInput, placeholder }) {
  return (
    <div className="tools-search">
      <i className="fas fa-search" />
      <input
        value={input}
        placeholder={placeholder}
        onChange={event => {
          setInput(event.target.value);
        }}
      />
      <i onClick={clearInput} className="fas fa-times" />
    </div>
  );
}

Search.defaultProps = {
  input: "",
  setInput: function() {
    return null;
  },
  clearInput: function() {
    return null;
  }
};
