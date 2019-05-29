import React, { Component } from "react";
import firebase from "firebase";
import ButtonRegister from "./ButtonRegister";
import LogInButton from "./ButtonLogin";
import Chart1 from './Chart'
import Chart2 from './Chart2'
import Logo from "react-svg";

import "./dashboard.css";

class Dashboard extends Component {
  state = {
    user: null
};

componentDidMount() {
    const ref = firebase.auth().onAuthStateChanged(user => {
        this.setState({
            user
        })
    });
    this.setState({
      ref
    });
}

componentWillUnmount() {
  this.state.ref && this.state.ref();
}

  render() {
    return (
      <div className="dashboard__container">
        <div className="dashboard__header">
          <div className="dashboard__header__main">
            <h1>PIZZERIUM</h1>
            <Logo 
              src="logo.svg"
              svgStyle={{ width: 140, height: 100 }}
            />
          </div>
          <h3>Stwórz i zamów ulubioną pizzę!</h3>
          {this.state.user 
            ? null
            : <div className="dashboard__buttons">
                <LogInButton />
                <ButtonRegister />
              </div>
          }
        </div>
        <div className="dashboard__charts">
          <div className="dashboard__chart-1">
            <Chart1 />
          </div>
          <div className="dashboard__chart-2">
            <Chart2 />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
