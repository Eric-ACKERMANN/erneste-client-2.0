import React from "react";
import Item from "./Select_Item";
import ClickListener from "./ClickListener";

export default function Options({
  idItem,
  options,
  style,
  onClick,
  CLprops,
  itemProps
}) {
  return (
    <div id={`${idItem}_options`} style={style} onClick={onClick}>
      <ClickListener
        onClick={CLprops.onClick}
        listenInside={CLprops.listenInside}
        idItem={idItem}
      >
        {options.map((element, index) => {
          return (
            <Item
              value={element}
              id={`${idItem}_${element}_${index}`}
              key={index}
              index={index}
              itemHover={itemProps.itemHover}
              selection={itemProps.itemSelected}
              hover={itemProps.hover}
              input={itemProps.input}
              styleItem={itemProps.styleItem}
              styleItemSelected={itemProps.styleItemSelected}
              styleItemHover={itemProps.styleItemHover}
              onMouseMoveItem={itemProps.onMouseMoveItem}
              onClick={itemProps.onClick}
            />
          );
        })}
      </ClickListener>
    </div>
  );
}
