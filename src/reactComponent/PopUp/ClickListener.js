import React from "react";
import PropTypes from "prop-types";

export default class NativeClickListener extends React.Component {
  static propsType = {
    onClick: PropTypes.func,
    listenInside: PropTypes.bool,
    idItem: PropTypes.string
  };

  componentDidMount() {
    document.addEventListener("click", this.globalClickHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.globalClickHandler);
  }

  globalClickHandler = nativeEvent => {
    const { onClick, listenInside } = this.props;
    if (
      this._container &&
      this._container.contains(nativeEvent.target) &&
      !listenInside
    ) {
      return;
    }
    onClick(nativeEvent);
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className} ref={ref => (this._container = ref)}>
        {this.props.children}
      </div>
    );
  }
}

NativeClickListener.propsType = {
  onClick: PropTypes.func,
  listenInside: PropTypes.bool,
  idItem: PropTypes.string
};

NativeClickListener.defaultProps = {
  listenInside: false
};
