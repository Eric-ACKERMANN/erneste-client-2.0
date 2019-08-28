export const selectStyle = {
  container: {
    width: "250px" // INPUT WIDTH
  },
  inputBox: {
    border: "1px solid black", // INPUT BORDER COLOR
    backgroundColor: "white", // INPUT BACKGROUND COLOR
    borderRadius: 5, // INPUT BORDER RADIUS
    padding: "5px 5px 5px 5px" // INPUT PADDING
    // INPUT OUTLINE
  },
  input: {
    fontSize: 14, // INPUT FONT SIZE
    fontWeight: 500, // INPUT FONT WEIGHT
    backgroundColor: "white" // INPUT BAKCGROUND COLOR
  },
  value: {
    single: {
      fontSize: 14, // VALUE FONT SIZE
      fontWeight: 500 // VALUE FONT WEIGHT
    },
    multi: {
      padding: "0px 5px 0px 5px ", // VALUE MULTI PADDING
      backgroundColor: "#DDD" // VALUE MULTI BACKGROUND COLOR
    }
  },
  valueDelete: {
    normal: {
      fontSize: 10, // VALUE DELETE SIZE
      padding: 5, // VALUE DELETE PADDING

      backgroundColor: "red" // VALUE DELETE BAKCGROUND COLOR
    },
    hover: {
      backgroundColor: "blue", // VALUE DELETE HOVER BACKGROUND COLOR
      color: "cyan" // VALUE DELETE HOVER COLOR
    },
    focus: {
      backgroundColor: "yellow", // VALUE DELETE FOCUS BACKGROUND COLOR
      color: "orange" // VALUE DELETE FOCUS COLOR
    }
  },

  placeholder: {
    color: "#808080" // PLACEHOLDER COLOR
  },
  options: {
    backgroundColor: "white", // OPTIONS BACKGROUND COLOR
    boxShadow:
      "0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)", // OPTIONS BOX-SHADOW
    maxHeight: 200 // OPTIONS MAX HEIGHT
  },
  item: {
    normal: {
      fontSize: 14, // ITEMS FONT SIZE
      color: "black", // ITEMS COLOR
      padding: "5px 10px" // ITEMS PADDING
    },
    hover: {
      fontSize: 14, // ITEMS HOVER FONTSIZE
      color: "black", // ITEMS HOVER COLOR
      backgroundColor: "cyan" // ITEMS HOVER BAKCHORUNDCOLOR
    },
    selected: {
      fontSize: 14, // ITEMS SELECTED FONT SIZE
      fontWeight: 600, // ITEMS SELECTED FONT WEIGHT
      color: "black", // ITEMS SELECTED COLOR
      backgroundColor: "#DDD" // ITEMS SLEECTE BCKGROUNDCOLOR
    }
  },
  logo: {
    padding: "0px 0px 0px 5px", // LOGO PADDING
    margin: "0px 0px 0px 0px", // LOGO MARGIN
    borderLeft: "solid 1px black" // LOGO BORDER
  },
  clearLogo: {
    padding: "0px 0px 0px 5px", // CLEAR PADDING
    margin: "0px 5px 0px 0px" // CLEAR MARGIN
  }
};
