import React, { Component } from "react";
import PropTypes from "prop-types";
import Input from "./Select_input";
import Placeholder from "./Select_Placeholder";
import ClearLogo from "./Select_ClearLogo";
import Logo from "./Select_Logo";
import Options from "./Select_Options";
import Value from "./Select_Value";

const setView = function(item, container, direction) {
  let itemBounding = item.getBoundingClientRect();
  let itemBottom = itemBounding.bottom;
  let itemTop = itemBounding.top;
  let containerBounding = container.getBoundingClientRect();
  let containerBottom = containerBounding.bottom;
  let containerTop = containerBounding.top;
  if (
    direction === 1 &&
    (containerBottom < itemBottom || itemTop < containerTop)
  ) {
    item.scrollIntoView(false);
  }

  if (direction === -1 && containerTop > itemTop) {
    item.scrollIntoView(true);
  }
  if (direction === -1 && itemTop > containerBottom) {
    item.scrollIntoView(false);
  }
  return;
};

const setPosition = function(position, direction, array) {
  let newPosition = null;
  if (direction === 1 && position === array.length - 1) {
    newPosition = 0;
  } else if (direction === -1 && position === 0) {
    newPosition = array.length - 1;
  } else {
    newPosition = position + direction;
  }
  return newPosition;
};

export default class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: false,
      itemHover: 0,
      valueHover: false,
      valueFocus: false,
      placeholder: "Select...",
      valueInput: "",
      mounted: false
    };
  }

  onKeyDownInput = e => {
    // BACKSPACE
    if (e.keyCode === 8) {
      if (!this.props.searchable || this.state.valueInput === "") {
        if (this.props.valueTools.multi && this.props.value) {
          let value = [...this.props.value];
          if (this.state.valueFocus !== false) {
            value.splice(this.state.valueFocus, 1);
            if (this.state.valueFocus > value.length - 1) {
              this.setState({ valueFocus: false });
            }
          } else {
            value.pop();
          }
          if (value.length === 0) {
            this.props.setValue("");
          } else {
            this.props.setValue(value);
          }
        } else {
          this.props.setValue("");
        }
        return;
      }
      return;
    }
    // UP ARROW / DOWN ARROW
    if (e.keyCode === 40 || e.keyCode === 38) {
      let direction = "";
      let position = this.state.itemHover;
      let newPosition = null;

      if (e.keyCode === 40) {
        direction = 1;
      } else {
        direction = -1;
      }

      // Si le suggestion est fermé
      if (!this.state.options || this.state.itemHover === false) {
        newPosition = 0;
        this.setState({ options: true, itemHover: newPosition });
        return;
      }

      newPosition = setPosition(
        position,
        direction,
        this.modifyArray([...this.props.options])
      );

      // Set the view to auto-scroll if element is out of viewport.
      let item = document.getElementById(
        `${this.props.id}_${
          this.modifyArray([...this.props.options])[newPosition]
        }_${newPosition}`
      );

      let options = document.getElementById(`${this.props.id}_options`);
      setView(item, options, direction);

      this.setState({ itemHover: newPosition });
    }

    // ENTER
    if (e.keyCode === 13) {
      let value = this.modifyArray([...this.props.options])[
        this.state.itemHover
      ];
      if (value) {
        this.setValue(value, this.state.itemHover);
        this.setState({ options: false, itemHover: false });
      }
    }
    //ESCAPE
    if (e.keyCode === 27) {
      this.setState({ itemHover: false, options: false });
    }

    // LEFT Arrow / RIGHT Arrow
    if (e.keyCode === 37) {
      // Left Arrow
      if (!this.state.valueInput && this.state.valueFocus === false) {
        this.setState({ valueFocus: this.props.value.length - 1 });
      } else if (this.state.valueFocus > 0) {
        this.setState({ valueFocus: this.state.valueFocus - 1 });
      }
    }

    if (e.keyCode === 39) {
      // Right Arrow
      if (this.state.valueFocus === this.props.value.length - 1) {
        this.setState({ valueFocus: false });
      } else if (this.state.valueFocus !== false) {
        this.setState({ valueFocus: this.state.valueFocus + 1 });
      }
    }
  };

  handleClickInputBox = e => {
    this.input.focus();
    if (
      e.target.id.includes(`${this.props.id}multiDeleteBox`) ||
      e.target.id.includes(`${this.props.id}multiDelete`)
    ) {
      return;
    } else {
      this.setState({
        options: true,
        itemHover: 0
      });
    }
  };

  handleChangeInput = e => {
    this.setState({ valueInput: e.target.value, options: true });
  };

  // Removes the values (multi) selected from options
  filterValueMulti = array => {
    this.props.value.forEach(e => {
      let position = array.indexOf(e);
      if (position !== -1) {
        array.splice(position, 1);
      }
    });
  };

  // Removes the value selected (mono) from options
  filterValueMono = array => {
    let position = array.indexOf(this.props.value);
    if (position !== -1) {
      array.splice(position, 1);
    }
  };

  // Filter options with the value of the input
  filterInput = array => {
    let newArray = array.filter(e =>
      e.toLowerCase().includes(this.state.valueInput.toLowerCase())
    );
    return newArray;
  };

  // Apply all filters
  filterArray = array => {
    if (this.props.valueTools.multi && this.props.value) {
      this.filterValueMulti(array);
    } else {
      this.filterValueMono(array);
    }
    array = this.filterInput(array);
    return array;
  };

  setValue = async (element, index) => {
    if (
      index !== undefined &&
      index === this.filterArray(this.props.options).length
    ) {
      element = element.substr(8, element.length - 1 - 8);
    }
    if (this.props.valueTools.multi) {
      if (typeof this.props.value !== "object") {
        let value = [element];
        this.props.setValue(value);
      } else {
        let value = [...this.props.value];
        if (value.indexOf(element) === -1) {
          value.push(element);
        }
        this.props.setValue(value);
      }
      this.input.focus();
    } else {
      this.props.setValue(element);
    }
    await this.setState({ valueInput: "" });
  };

  createAnswer = arrayP => {
    let array = [...arrayP];
    const inputValue = this.state.valueInput.trim().toLowerCase();
    array.forEach(function(e, index) {
      return (array[index] = e.toLowerCase());
    });

    const position = array.indexOf(inputValue);

    if (position === -1 && this.state.valueInput) {
      arrayP.push(`Create "${this.state.valueInput}"`);
    }

    return arrayP;
  };

  multiValueDelete = element => {
    let value = [...this.props.value];
    let position = value.indexOf(element);
    value.splice(position, 1);
    this.props.setValue(value);
  };

  onClickClearLogo = () => {
    this.props.setValue("");
  };

  handleMouseMoveItem = index => {
    this.setState({ itemHover: index });
  };

  handleMouseEnterValue = index => {
    this.setState({ valueHover: index });
  };

  handleMouseLeaveValue = () => {
    this.setState({ valueHover: false });
  };

  handleClickDocument = () => {
    this.setState({ options: false });
  };

  modifyArray = options => {
    let array = [...options];
    if (this.props.optionsTools.selectedFilter) {
      array = this.filterArray(array);
    }
    if (this.props.optionsTools.createAnswer) {
      array = this.createAnswer(array);
    }
    return array;
  };

  render() {
    const containerStyle = {
      position: "relative",
      backgroundColor: "none",
      ...this.props.style.container
    };

    const inputBoxStyle = {
      display: "flex",
      alignItems: "center",
      ...this.props.style.inputBox
    };

    const valueBlockStyle = {
      position: "relative",
      display: "flex",
      overflow: "scroll",
      flex: 1
    };

    const inputStyle = {
      padding: 0,
      outline: "none",
      border: "none",
      width: 0,
      ...this.props.style.input
    };

    const valueSingleStyle = {
      display: "flex",
      padding: 0,
      top: 0,
      ...this.props.style.value.single
    };

    const valueMultiStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...this.props.style.value.multi
    };

    const valueDeleteNormalStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...this.props.style.valueDelete.normal
    };

    const valueDeleteHoverStyle = {
      backgroundColor: "blue", // VALUE DELETE HOVER BACKGROUND COLOR
      color: "cyan", // VALUE DELETE HOVER COLOR
      ...this.props.style.valueDelete.hover
    };

    const valueDeleteFocusStyle = {
      backgroundColor: "yellow", // VALUE DELETE FOCUS BACKGROUND COLOR
      color: "orange", // VALUE DELETE FOCUS COLOR
      ...this.props.style.valueDelete.focus
    };

    const placeholderStyle = {
      position: "absolute",
      ...this.props.style.placeholder
    };

    const optionsStyle = {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      top: "100%",
      width: "100%",
      padding: 0,
      zIndex: 2,
      overflow: "scroll",
      ...this.props.style.options
    };

    const itemNormalStyle = {
      fontSize: 14, // ITEMS FONT SIZE
      color: "black", // ITEMS COLOR
      padding: "5px 10px", // ITEMS PADDING
      ...this.props.style.item.normal
    };

    const itemHoverStyle = {
      fontSize: 14, // ITEMS HOVER FONTSIZE
      color: "black", // ITEMS HOVER COLOR
      backgroundColor: "cyan", // ITEMS HOVER BAKCHORUNDCOLOR
      ...this.props.style.item.hover
    };

    const itemSelectedStyle = {
      fontSize: 14, // ITEMS SELECTED FONT SIZE
      fontWeight: 600, // ITEMS SELECTED FONT WEIGHT
      color: "black", // ITEMS SELECTED COLOR
      backgroundColor: "#DDD", // ITEMS SLEECTE BCKGROUNDCOLOR
      ...this.props.style.item.selected
    };

    const logoStyle = {
      padding: "0px 0px 0px 5px", // LOGO PADDING
      margin: "0px 0px 0px 0px", // LOGO MARGIN
      borderLeft: "solid 1px black", // LOGO BORDER
      ...this.props.style.logo
    };

    const clearLogoStyle = {
      marginLeft: "auto",
      height: "100%",
      ...this.props.style.clearLogo
    };

    return (
      <div style={containerStyle}>
        <div style={inputBoxStyle} onClick={e => this.handleClickInputBox(e)}>
          {/* DIV DU LOGO */}
          {this.props.logo && this.props.logo.position === -1 && (
            <Logo style={this.props.style.logo} value={this.props.logo.body} />
          )}
          {/* DIV COMPRENANT INPUT ,PLACEHOLDER ET VALUE*/}
          <div style={valueBlockStyle}>
            <Value
              style={valueSingleStyle}
              valueInput={this.state.valueInput}
              multiSelect={this.props.valueTools.multi}
              wrap={this.props.valueTools.wrap}
              value={this.props.value}
              inputProps={{
                readOnly: this.props.searchable ? false : true,
                id: `${this.props.id}_input`,
                myRef: ref => (this.input = ref),
                value: this.props.searchable ? this.state.valueInput : "",
                style: inputStyle,
                onChange: this.props.searchable
                  ? this.handleChangeInput
                  : false,
                onKeyDown: this.onKeyDownInput,
                onBlur: this.props.searchable ? this.onBlurInput : undefined
              }}
              multiValueProps={{
                onMouseEnter: this.handleMouseEnterValue,
                onMouseLeave: this.handleMouseLeaveValue,
                idItem: this.props.id,
                styleMultiValue: {
                  multiValue: valueMultiStyle,
                  delete: valueDeleteNormalStyle,
                  deleteHover: valueDeleteHoverStyle,
                  deleteFocus: valueDeleteFocusStyle
                },
                multiDelete: this.props.valueTools.valueDeletable
                  ? this.multiValueDelete
                  : null,
                valueHover: this.props.valueTools.valueDeletableHover
                  ? this.state.valueHover
                  : null,
                valueFocus: this.state.valueFocus
              }}
            />

            {!this.props.valueTools.multi && (
              <Input
                readOnly={this.props.searchable ? false : true}
                id={`${this.props.id}_input`}
                myRef={ref => (this.input = ref)}
                value={this.props.searchable ? this.state.valueInput : ""}
                style={this.props.style.input}
                onChange={
                  this.props.searchable ? this.handleChangeInput : false
                }
                onKeyDown={this.onKeyDownInput}
                onBlur={this.props.searchable ? this.onBlurInput : undefined}
              />
            )}

            {/* PLACEHOLDER */}
            {(!this.props.value || this.props.value === []) &&
              !this.state.valueInput && (
                <Placeholder
                  style={{
                    value: valueSingleStyle,
                    placeholder: placeholderStyle
                  }}
                  value={this.props.placeholder}
                />
              )}
          </div>

          {/* DIV DU CLEARABLE */}
          {this.props.valueTools.clearable && (
            <ClearLogo
              onClick={this.onClickClearLogo}
              style={clearLogoStyle}
              value={this.props.valueTools.clearable}
            />
          )}

          {/* DIV DU LOGO */}
          {this.props.logo.body && this.props.logo.position === 1 && (
            <Logo style={logoStyle} value={this.props.logo.body} />
          )}
        </div>

        {this.state.options && (
          <Options
            options={this.modifyArray([...this.props.options])}
            idItem={this.props.id}
            style={optionsStyle}
            onClick={this.handleBodyClick}
            CLprops={{
              onClick: this.handleClickDocument,
              listenInside: this.props.optionsTools.disappearOnClick
            }}
            itemProps={{
              itemHover: this.state.itemHover,
              itemSelected: this.props.optionsTools.selectedEffect,
              hover: this.props.optionsTools.hoverEffect,
              input: this.props.value,
              styleItem: itemNormalStyle,
              styleItemSelected: itemSelectedStyle,

              styleItemHover: itemHoverStyle,
              onMouseMoveItem: index => this.handleMouseMoveItem(index),
              onClick: (element, index) => this.setValue(element, index)
            }}
          />
        )}
      </div>
    );
  }
}

Select.propsTypes = {
  searchable: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  optionsTools: PropTypes.shape({
    disappearOnClick: PropTypes.bool,
    hoverEffect: PropTypes.bool,
    selectedEffect: PropTypes.bool,
    selectedFilter: PropTypes.bool,
    createOptions: PropTypes.bool
  }),
  valueTools: PropTypes.shape({
    multi: PropTypes.bool,
    wrap: PropTypes.bool,
    valueDeletable: PropTypes.bool,
    valueDeletableHover: PropTypes.bool
  }),

  logo: PropTypes.shape({
    logo: PropTypes.bool,
    position: PropTypes.oneOf([-1, 1])
  }),
  style: PropTypes.objectOf(PropTypes.object)
};

Select.defaultProps = {
  searchable: false,
  options: [],
  value: "",
  id: "",
  placeholder: "",
  optionsTools: {
    disappearOnClick: true, // <=> listenInside
    hoverEffect: true,
    selectedEffect: false,
    selectedFilter: true,
    createOptions: true
  },
  valueTools: {
    multi: false,
    wrap: false,
    valueDeletable: true,
    valueDeletableHover: true,
    clearable: false
  },
  logo: {
    body: false,
    position: 0
  },
  style: {}
};
