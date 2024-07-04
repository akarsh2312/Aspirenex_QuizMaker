import React from "react";
import QuizletLogo from "../../assets/Logo.svg";

const Icon = (props) => {
  return (
    <React.Fragment>
      <img
        src={QuizletLogo}
        style={{
          width: props.size,
        }}
        alt="Quizlet Logo"
      />
    </React.Fragment>
  );
};

export default Icon;
