import React from "react";

import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container1">
      <div className="card1">
        <div className="inner-card">
          <img className="image" src={"./logo.png"} alt="logo" />
          <p className="text">SGM Configurator</p>
        </div>
        <div className="line">
          <hr />
        </div>
        <div className="btn1">
          <Link to="/dash">
            <button className="btn2">LOGIN</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
