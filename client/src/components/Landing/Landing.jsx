import React from "react";
import Icon from "../Layout/Icon";
import NavBar from "../Layout/NavBar";

const Landing = (props) => {
  return (
    <React.Fragment>
      <NavBar
        isLoggedIn={props.isLoggedIn}
        checkLogin={props.checkLogin}
        onLogout={props.onLogout}
      />
      <div className="container-fluid bg">
        <div className="" style={{ textAlign: "center", marginTop: "10vh" }}>
          <Icon size="240px" />
        </div>
        <div className="jumbo">Welcome to Quizlet</div>
        <div className=" jumbo-subtitle" >
          Ultimate Platform for creating, sharing and taking quizzes
          <br />
          CREATE SHARE AND LEARN
          <br/>
          <br/>
          <span>Developed by Akarsh Khandelwal</span>
        </div>
        <div className="mt-5" style={{ textAlign: "center" }}>

        </div>
      </div>
    </React.Fragment>
  );
};

export default Landing;
