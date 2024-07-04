import React from "react";
import Emoji from "../Layout/Emoji";
import DateUtil from "../../Utils/DateUtil";

const QuizInfo = (props) => {
  return (
    <React.Fragment>
      <tr style={{}}>
        <th
          scope="row"
          className="counterCell"
          style={{
            fontFamily: `"Lexend Deca", sans-serif`,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        ></th>
        <td
          className="option-name"
          style={{
            fontFamily: `"Lexend Deca", sans-serif`,
            color: "var(--quizden-bg-dark)",
          }}
        >
          {props.title}
        </td>
        <td
          style={{
            fontFamily: `"Roboto", sans-serif`,
            color: "dimgray",
          }}
        >
          {DateUtil.getFormatedDateTime(props.date)}
        </td>
        <td
          className="option-dropdown"
          style={{ color: "var(--quizden-bg-dark" }}
        >
          {props.participated}
        </td>
        <td
          className="option-dropdown"
          style={{ color: "var(--quizden-bg-dark" }}
        >
          {props.flawless}
        </td>
        <td
          style={{
            fontFamily: `"Lexend Deca", sans-serif`,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <span
            style={{
              margin: "8px",
            }}
          >
            <Emoji emoji="📱" />
          </span>
          {props.id}
        </td>
      </tr>

    </React.Fragment>
  );
};

export default QuizInfo;
