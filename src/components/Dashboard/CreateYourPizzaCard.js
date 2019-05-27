import React from "react";

class CreateYourPizzaCard extends React.Component {
    render() {
        return (
            <div className="card text-center shadow mb-5" style={{"width":"30rem", "height":"31rem", "padding":"0.5rem"}}>
                <img src="img/ready-pizza.jpg" className="card-img-top" alt="pizza"/>
                <div className="card-body">
                    <h5 className="card-text" style={{"lineHeight":"2rem"}}>Skorzystaj z kreatora pizzy i stwórz swoją własną, a my znajdziemy pizzerię, która zrobi ją dla ciebie albo znajdź już gotową pizzę w jednym z lokali współpracujących z nami.</h5>
                </div>
            </div>           
        )
    }
}

export default CreateYourPizzaCard;