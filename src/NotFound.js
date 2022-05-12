import { ArrowBackIosOutlined } from "@material-ui/icons";
import React, { Component } from "react";

class NotFound extends React.Component {
  render() {
    const styles = {
      heading: {
        position: "absolute",
        top: "20%",
        left: "45%",
        fontStyle: "italic",
      },
    };
    return (
      <div style={styles.heading}>
        <h1>Page Not Found</h1>
      </div>
    );
  }
}

export default NotFound;
