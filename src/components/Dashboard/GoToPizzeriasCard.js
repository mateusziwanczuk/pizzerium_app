import React from "react";

class GoToPizzeriasCard extends React.Component {
    render() {
        return (
            <div className="card text-center shadow p-3 mb-5 rounded" style={{"width":"30rem", "height":"30rem"}}>
                <img src="img/ready-pizza.jpg" className="card-img-top" alt="pizza"/>
                <div className="card-body">
                    <h5 className="card-title">Pizzerie</h5>
                    <p className="card-text">Znajdź najlepszą pizzę blisko swojego domu.</p>
                    <a href="/pizzerias" className="btn btn-danger">Lista pizzerii</a>
                </div>
            </div>           
        )
    }
}

export default GoToPizzeriasCard;