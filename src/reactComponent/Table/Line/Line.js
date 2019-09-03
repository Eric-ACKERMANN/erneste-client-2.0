import React from "react";
import { Link } from "react-router-dom";

export default function Line({ array, className, headlineArray }) {
  return (
    <ul className={className}>
      {headlineArray.map(function(element, index) {
        let result = null;

        // ****** SI on a un tableau en entrée, on le map ******
        if (array[element.back] && array[element.back].isArray) {
          result = (
            <li key={index}>
              {array[element.back].map(function(e) {
                return e;
              })}
            </li>
          );

          // ****** Si ce n'est pas un tableau
        } else {
          result = <li key={index}>{array[element.back]}</li>;
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
  headlineArray: []
};
