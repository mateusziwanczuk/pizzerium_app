import React from "react";
import { db } from "../../App";

const BarChart = require("react-chartjs").Bar;

class Chart1 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };
  }
  
  componentDidMount() {
    let currentComponent = this;

    db.ref("users").once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const childData = childSnapshot.val().registerWeekDay;
        
        if (childData === "Monday"){
            currentComponent.setState((state) => {
              return {Monday: state.Monday + 1}
            })
        } else if (childData === "Tuesday"){
          currentComponent.setState((state) => {
            return {Tuesday: state.Tuesday + 1}
          })
        } else if (childData === "Wednesday"){
          currentComponent.setState((state) => {
            return {Wednesday: state.Wednesday + 1}
          })
        } else if (childData === "Thursday"){
          currentComponent.setState((state) => {
            return {Thursday: state.Thursday + 1}
          })
        } else if (childData === "Friday"){
          currentComponent.setState((state) => {
            return {Friday: state.Friday + 1}
          })
        } else if (childData === "Saturday"){
          currentComponent.setState((state) => {
            return {Saturday: state.Saturday + 1}
          })
        } else if (childData === "Sunday"){
          currentComponent.setState((state) => {
          return {Sunday: state.Sunday + 1}
        })   
        } else {return null}
      
      })
    })
  }

  render() {

    const chartData = {
      labels: [
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
        "Niedziala"
      ],
      datasets: [
        {
          label: "Nowi użytkownicy",
          fillColor: "rgb(105,168,104)",
          strokeColor: "rgb(101, 163, 100)",
          pointColor: "rgb(238,193,90)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [this.state.Monday, this.state.Tuesday, this.state.Wednesday, this.state.Thursday, this.state.Friday, this.state.Saturday, this.state.Sunday]
        }
      ]
    };
    return <BarChart className="chart" data={chartData} />;
  }
}

export default Chart1;
