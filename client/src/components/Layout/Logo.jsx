import React from "react";
import Icon from "./Icon";

const Logo = () => {
  return (
    <React.Fragment>
      <Icon size="40px" />
      <span
        style={{
          fontFamily: `'Lexend Deca', sans-serif`,
          fontSize: "29px",
          color: "var(--quizlet-light)",
          display: "inline-block",
          verticalAlign: "middle",
          paddingLeft: "8px",
        }}
      >
        Quizlet
      </span>
    </React.Fragment>
  );
};

export default Logo;
