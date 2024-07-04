import React from "react";
import QuizInfo from "./QuizInfo";

const CuratedQuizList = (props) => {
  return (
    <div className={props.classes}>
      <div className="profile-name"> My Quizzes</div>
      <div className="profile-email">
        These are quizzes created by you. Copy and share the code.
      </div>

      <table className="table mt-4">
        <thead className="count-title">
          <tr>
            <th scope="col">Serial</th>
            <th scope="col">Title</th>
            <th scope="col">Created at</th>
            <th scope="col">Total Participant</th>
            <th scope="col">Total Flawless</th>
            <th scope="col">Quiz Code</th>
          </tr>
        </thead>
        <tbody>
          {props.quizzes.map((quiz) => (
            <QuizInfo
              key={quiz._id}
              title={quiz.title}
              id={quiz._id}
              participated={quiz.participated}
              flawless={quiz.flawless}
              date={quiz.date}
            />
          ))}

        </tbody>
      </table>
    </div>
  );
};

export default CuratedQuizList;
