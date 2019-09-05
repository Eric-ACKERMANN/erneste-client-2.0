import React from "react";
import Search from "../Search";
import Button from "../Button";
import { Link } from "react-router-dom";

export default function Tool({ search, button }) {
  return (
    <ul className="tools">
      {search.search && (
        <li>
          <Search
            input={search.input}
            setInput={search.setInput}
            clearInput={search.clearInput}
            placeholder={search.placeholder}
          />
        </li>
      )}

      {button.length > 0 &&
        button.map(element => {
          return element.link ? (
            <li>
              <Link to={element.link}>
                <Button
                  className={
                    element.condition.length > 0
                      ? `${element.type} visible`
                      : `${element.type} invisible`
                  }
                  logoPosition={element.logoPosition}
                  logo={element.logo}
                  children={element.text}
                />
              </Link>
            </li>
          ) : (
            <li>
              <Button
                className={
                  element.condition.length > 0
                    ? `${element.type} visible`
                    : `${element.type} invisible`
                }
                logoPosition={element.logoPosition}
                logo={element.logo}
                onClick={() => element.onClick()}
                children={element.text}
              />
            </li>
          );
        })}
    </ul>
  );
}

Tool.defaultProps = {
  search: { search: false, input: false, setInput: false, clearInput: false },
  searchParameter: [],
  button: []
};
