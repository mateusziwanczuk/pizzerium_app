import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import Paper from "@material-ui/core/Paper";
import { db } from "../../../App";
import Loader from "react-loader-spinner";

import CustomPizzaHeader from "./CustomPizzaHeader/CustomPizzaHeader";
import AvailablePizzerias from "./AvailablePizzerias/AvailablePizzerias";

const styles = theme => ({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		padding: 20,
		[theme.breakpoints.down("sm")]: {
			paddingTop: 50
		}
	},
	title: {
		width: "100%"
	},
	listGroup: {
		[theme.breakpoints.down("sm")]: {
			height: "21vh"
		}
	},
	succesPaper: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		textAlign: "center",
		padding: "15px 15px",
		[theme.breakpoints.down("sm")]: {
			width: "100%"
		}
	}
});

const getFromLocalStorage = item => {
	return JSON.parse(window.localStorage.getItem(item));
};

class CompleteOrderPage extends Component {
	state = {
		ingredients: [],
		isPizzeriaSelected: getFromLocalStorage("selectedPizzeria") ? true : false,
		selectedPizzeria: getFromLocalStorage("selectedPizzeria")
			? getFromLocalStorage("selectedPizzeria")
			: {},
		pizzerias: [],
		isFetchInProgress: true
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		db.ref("pizzerias")
			.once("value")
			.then(snapshot => {
				if (this._isMounted) {
					const pizzerias = snapshot.val();
					this.setState({
						...this.state,
						isPizzeriaSelected: !!getFromLocalStorage("selectedPizzeria"),
						selectedPizzeria: getFromLocalStorage("selectedPizzeria"),
						ingredients: getFromLocalStorage("ingredients"),
						isFetchInProgress: false,
						pizzerias
					});
				}
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	cancelIngredients = () => {
		window.localStorage.clear();
		this.props.submitPizza();
		this.props.history.push("/create-pizza");
	};

	handleChoosePizzeria = pizzeria => {
		this.setState({
			...this.state,
			isPizzeriaSelected: true,
			selectedPizzeria: pizzeria
		});
		window.localStorage.setItem("selectedPizzeria", JSON.stringify(pizzeria));
	};

	handleUnselectPizzeria = () => {
		this.setState({
			...this.state,
			isPizzeriaSelected: false,
			selectedPizzeria: {}
		});
		window.localStorage.removeItem("selectedPizzeria");
		window.localStorage.removeItem("isPizzeriaSubmitted");
	};

	submitSelectedPizzeria = price => {
		this.props.handleSubmitSelectedPizzeria();
		this.props.history.push("/summary-order");
		window.localStorage.setItem("isPizzeriaSubmitted", JSON.stringify(true));
		window.localStorage.setItem("orderTotalPrice", JSON.stringify(price));
	};

	unSubmitSelectedPizzeria = () => {
		const isCustomOrder = getFromLocalStorage("isCustomOrder");
		if (!isCustomOrder) {
			this.props.cancelOrder();
			this.props.history.push("/user-panel");
			window.localStorage.clear();
		}
		window.localStorage.removeItem("selectedPizzeria");
		window.localStorage.removeItem("isPizzeriaSubmitted");
		window.localStorage.removeItem("orderTotalPrice");
		this.props.handleSubmitSelectedPizzeria();
	};

	render() {
		const {
			classes,
			isCustomPizzaSubmitted,
			history,
			isPizzeriaSubmitted
		} = this.props;
		const {
			ingredients,
			selectedPizzeria,
			isPizzeriaSelected,
			pizzerias,
			isFetchInProgress
		} = this.state;
		return isPizzeriaSubmitted ? (
			<div
				variant="success"
				style={{
					position: "fixed",
					width: "100%",
					height: "100vh",
					backgroundColor: "rgba(209,241,218,0.6)",
					zIndex: 1000
				}}
			>
				<Paper className={classes.succesPaper}>
					<h2>Wybrałeś pizzerię!</h2>
					<h3>Przejdź do następnego kroku i złóż zamówienie.</h3>
					<Button
						className="d-inline custom-button btn-secondary"
						style={{
							width: 130,
							height: 35,
							fontSize: 14,
							padding: "5px 7px"
						}}
						onClick={this.unSubmitSelectedPizzeria}
					>
						{"Anuluj pizzerię"}
					</Button>
				</Paper>
			</div>
		) : (
			<Container
				className="h-100"
				style={{
					position: "relative"
				}}
			>
				<Row>
					<div className={classes.container}>
						<ListGroup className={classes.listGroup}>
							{isCustomPizzaSubmitted && (
								<CustomPizzaHeader
									ingredients={ingredients}
									cancelIngredients={this.cancelIngredients}
									isPizzeriaSelected={isPizzeriaSelected}
								/>
							)}
						</ListGroup>
						{isFetchInProgress ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<Loader type="Oval" color="#039be5" width={120} height={120} />
							</div>
						) : (
							<AvailablePizzerias
								history={history}
								isCustomPizza={isCustomPizzaSubmitted}
								choosePizzeria={this.handleChoosePizzeria}
								isPizzeriaSelected={isPizzeriaSelected}
								selectedPizzeria={selectedPizzeria}
								unselectPizzeria={this.handleUnselectPizzeria}
								ingredients={ingredients}
								pizzerias={pizzerias}
								submitSelectedPizzeria={this.submitSelectedPizzeria}
							/>
						)}
					</div>
				</Row>
			</Container>
		);
	}
}

export default withStyles(styles)(CompleteOrderPage);
