import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "./styles.css";
import "../../CreatePizza/create-pizza-button.css";
import { MdHome } from "react-icons/md";
import { MdLocalPostOffice } from "react-icons/md";
import { MdPhone } from "react-icons/md";
import { MdWeb } from "react-icons/md";

const styles = {
	RightPane: {
		background: "white",
		border: "1px solid lightgray",
		borderRadius: "5px",
		padding: "15px"
	},
	FavIconEnabled: {
		float: "right",
		color: "#cc1a37"
	},
	FavIconDisabled: {
		float: "right",
		color: "#919191"
	}
};

class PizzeriaList extends Component {
	state = {
		pizzerias: []
	};
	componentDidMount() {
		fetch("pizzerias.json")
			.then(resp => resp.json())
			.then(pizzerias => this.setState({ pizzerias }));
	}

	cancelIngredients = () => {
		window.localStorage.clear();
		this.props.submitPizza(false);
		this.props.history.push("/create-pizza");
	};

	render() {
		return (
			<Container
				style={{ display: "flex", height: "100%", alignItems: "center" }}
			>
				<Button
					className="d-inline custom-button btn-secondary"
					onClick={this.cancelIngredients}
				>
					{"Anuluj"}
				</Button>
				<Tab.Container
					id="list-group-tabs-example list-group-tabs-pizzerias"
					defaultActiveKey="#link1"
				>
					<Row
						style={{ display: "flex", justifyContent: "center", width: "100%" }}
					>
						<Col sm={4}>
							<ListGroup className="Pizzerias--list">
								{this.state.pizzerias.map(pizzeria => {
									return (
										<ListGroup.Item
											className
											key={pizzeria.id}
											action
											href={`#${pizzeria.id}`}
										>
											{pizzeria.name}
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Col>
						<Col sm={4} style={styles.RightPane}>
							<Tab.Content>
								{" "}
								{this.state.pizzerias.map(pizzeria => {
									return (
										<Tab.Pane key={pizzeria.id} eventKey={`#${pizzeria.id}`}>
											       <h1>{pizzeria.name}</h1>
											       
											<p>
												<MdHome /> {pizzeria.contactInfo.address.street}
											</p>
											       
											<p>
												<MdLocalPostOffice />{" "}
												{pizzeria.contactInfo.address.postcode}
											</p>
											       
											<p>
												<MdPhone /> {pizzeria.contactInfo.phone}
											</p>
											       
											<p>
												<MdWeb />{" "}
												<a
													href={"http://" + pizzeria.contactInfo.website}
													target="_blank"
													rel="noopener noreferrer"
												>
													{" "}
													{pizzeria.contactInfo.website}
												</a>
											</p>
											                                     
										</Tab.Pane>
									);
								})}
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</Container>
		);
	}
}

export default PizzeriaList;
