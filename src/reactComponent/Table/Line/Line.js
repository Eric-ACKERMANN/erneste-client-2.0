import React from "react";
import { Link } from "react-router-dom";

export default function Line({
  array,
  className,
  headlineArray,
  deleteInLine,
  style
}) {
  return (
    <ul className={className} style={style.line}>
      {headlineArray.map(function(element, index) {
        let result = null;
        // ****** SI on a un tableau en entrée, on le map ******
        if (array[element.back] && Array.isArray(array[element.back])) {
          result = (
            <li
              key={index}
              style={index === 0 ? style.line_li_first : style.line_li}
            >
              {array[element.back].map(function(e) {
                return <span>{e}</span>;
              })}
            </li>
          );

          // ****** Si ce n'est pas un tableau
        } else {
          result = (
            <li
              style={index === 0 ? style.line_li_first : style.line_li}
              key={index}
              onClick={
                index === deleteInLine.position
                  ? () => deleteInLine.func(array._id)
                  : null
              }
            >
              {array[element.back]}
            </li>
          );
        }

        if (element.link) {
          result = (
            <Link key={index} to={element.link + array._id}>
              {result}
            </Link>
          );
        }
        return result;
      })}
    </ul>
  );
}

Line.defaultProps = {
  array: [],
  className: "",
  headlineArray: [],
  deleteInLine: {
    exist: false,
    position: null,
    func: () => {
      return null;
    }
  },
  handleClickDeleteInLine: () => {
    return null;
  },
  style: {}
};
