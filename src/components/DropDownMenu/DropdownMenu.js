import React, { Component } from "react";
import "./DropDown.css";
import NativeClickListener from "./NativeClickListener";

export default class DropdownPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      dropdown2Visible: false
    };
  }

  renderDropdownMenu() {
    return (
      <div className="dropdown-body" onClick={this.handleBodyClick}>
        <div>
          <input type="checkbox" />
          <span>option 1</span>
        </div>
        <div>
          <input type="checkbox" />
          <span>option 2</span>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="hyper-container">
        <div className="dropdown-container">
          <div className="dropdown-trigger">
            <button onClick={() => this.setState({ dropdownVisible: true })}>
              dropdown trigger (listen outside)
            </button>
          </div>
          {this.state.dropdownVisible && (
            <NativeClickListener
              onClick={() => this.setState({ dropdownVisible: false })}
            >
              <div className="dropdown-body" onClick={this.handleBodyClick}>
                <div>
                  <input type="checkbox" />
                  <span>option 1</span>
                </div>
                <div>
                  <input type="checkbox" />
                  <span>option 2</span>
                </div>
              </div>
            </NativeClickListener>
          )}
        </div>
      </div>
    );
  }
}
