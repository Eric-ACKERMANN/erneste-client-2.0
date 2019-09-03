import React from "react";

export default function Tool({ search }) {
  return <div>Hello Tool</div>;
}

Tool.defaultProps = {
  search: { search: false, input: false, setInput: false, clearInput: false }
};
