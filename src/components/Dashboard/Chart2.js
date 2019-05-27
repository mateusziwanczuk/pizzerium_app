import React from "react";
import { db } from "../../App";


const PieChart = require("react-chartjs").Pie;


class Chart2 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            otherOrders: 0,
            customsPizzas: 0,
        }
    }

    componentDidMount() {
        db.ref("customOrders").once("value").then(snapshot => {
            const snapshotVal = snapshot.val() || {};
                this.setState({customsPizzas: snapshotVal})
        })
        db.ref("otherOrders").once("value").then(snapshot => {
            const snapshotVal = snapshot.val() || {};
                this.setState({otherOrders: snapshotVal})
        })
    }
    
    render() {
        const chart2Data = [
            {
                value: this.state.otherOrders,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Pizze z menu"
            },
            {
                value: this.state.customsPizzas,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Pizze użytkowników"
            }
        ]
    return <PieChart className="chart" data={chart2Data} />
 }
}

export default Chart2;