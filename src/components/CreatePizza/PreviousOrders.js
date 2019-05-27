import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import "../SharedComponents/ListScrollbar.css";
import "./containers.css";
import { ListWrapper } from "../SharedComponents/containers";
import firebase from "firebase";
import Loader from "react-loader-spinner";

const styles = theme => ({
	container: {
		width: "440px",
		maxHeight: "500px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			height: "100%"
		}
	},
	header: {
		width: "100%",
		padding: "1rem 0"
	},
	spinnerWrapper: {
		display: "flex",
		justifyContent: "center"
	}
});

class PreviousOrders extends Component {
	state = {
		user: this.props.user,
		orders: [],
		isFetchFinished: false,
		isFetchInProgress: true
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchOrders();
	}

	componentDidUpdate(prevProps) {
		if (this.state.user !== prevProps.user) {
			this.setState({
				...this.state,
				user: this.props.user
			});
			this.fetchOrders();
		}
	}

	fetchOrders = () => {
		const { user } = this.props;
		if (user) {
			firebase
				.database()
				.ref(`users/${user.uid}/orders`)
				.once("value")
				.then(snapshot => {
					const ordersObject = snapshot.val();
					if (ordersObject) {
						const ordersArray = Object.keys(ordersObject).map(key => ({
							id: key,
							...ordersObject[key]
						}));
						if (this._isMounted) {
							this.setState({
								...this.state,
								orders: ordersArray,
								isFetchFinished: true,
								isFetchInProgress: false
							});
						}
					}
					if (this._isMounted) {
						this.setState({
							...this.state,
							isFetchFinished: true,
							isFetchInProgress: false
						});
					}
				});
		}
	};

	componentWillUnmount() {
		this._isMounted = false;
	}

	selectOrder = order => {
		const pizzeria = order.pizzeria;
		const price = order.price;
		const ingredients = order.ingredients;
		window.localStorage.setItem("isPizzaSubmitted", "true");
		window.localStorage.setItem("isCustomOrder", "false");
		window.localStorage.setItem("isPizzeriaSubmitted", "true");
		window.localStorage.setItem("orderTotalPrice", JSON.stringify(price));
		window.localStorage.setItem("selectedPizzeria", JSON.stringify(pizzeria));
		window.localStorage.setItem("ingredients", JSON.stringify(ingredients));
		this.props.history.push("/summary-order");
		this.props.selectPreviousOrder(order);
	};

	render() {
		const { orders, isFetchInProgress } = this.state;
		const { classes } = this.props;
		return isFetchInProgress ? (
			<Loader type="Oval" color="#039be5" width={120} height={120} />
		) : (
			<div className={classes.container}>
				{!orders.length ? (
					<h3 className={classes.header}>Nie złożyłeś żadnego zamówienia!</h3>
				) : (
					<h3 className={classes.header}>Twoje poprzednie zamówienia</h3>
				)}

				<ListWrapper
					style={{
						paddingLeft: 0,
						paddingRight: 15,
						borderRadius: 0,
						height: "100%"
					}}
					className="list-scrollbar"
				>
					<div className="list-group">
						{orders.map(order => {
							let allIngredients = "";
							return (
								<div
									key={order.id}
									className="list-group-item list-group-item-action flex-column align-items-start"
									style={{
										overflowWrap: "break-word",
										wordWrap: "break-word"
									}}
								>
									<div className="d-flex w-100 justify-content-between">
										<h5 className="mb-1">{order.pizzeria.name}</h5>
									</div>
									<p className="mb-1">
										{order.ingredients &&
											order.ingredients.forEach(orderIngredient => {
												if (allIngredients.length > 0) {
													allIngredients += ", ";
												}
												allIngredients += orderIngredient.name;
											})}
										{allIngredients}
									</p>
								</div>
							);
						})}
					</div>
				</ListWrapper>
			</div>
		);
	}
}

export default withStyles(styles)(PreviousOrders);
