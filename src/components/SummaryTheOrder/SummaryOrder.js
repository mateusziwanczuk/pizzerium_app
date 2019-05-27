import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import firebase from "firebase";
import Button from "react-bootstrap/Button";

const styles = theme => ({
	wrapper: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
		maxHeight: "100vh",
		overflow: "auto"
	},
	header: {
		width: "100%",
		marginBottom: 15,
		[theme.breakpoints.down("sm")]: {
			textAlign: "center"
		}
	},
	ingredientsWrapper: {
		maxWidth: 350,
		width: "100%",
		fontSize: 16
	},
	pizzeriaWrapper: {
		maxWidth: 350,
		width: "100%",
		marginTop: 15,
		fontSize: 16
	},
	pizzeria: {
		padding: 15,
		textAlign: "center"
	},
	contactWrapper: {
		maxWidth: 350,
		width: "100%",
		marginTop: 15,
		fontSize: 16
	},
	contact: {
		padding: 15,
		textAlign: "center",
		fontSize: 16
	},
	info: {
		display: "block",
		fontWeight: "bold"
	},
	priceContainer: {
		maxWidth: 350,
		width: "100%",
		marginTop: 15,
		textAlign: "center"
	},
	favButton: {
		width: 140,
		height: 45,
		margin: "0 auto",
		padding: ".4rem .5rem",
		fontSize: "1.5rem",
		border: "none",
		color: "white",
		textDecoration: "none",
		backgroundColor: "#cc3333",
		"&:active": {
			color: "black",
			backgroundColor: "black"
		},
		"&:hover": {
			color: "white",
			textDecoration: "none",
			backgroundColor: "#a5182e"
		},
		"&:visited": {
			textDecoration: "none"
		},
		"&:focus": {
			textDecoration: "none",
			backgroundColor: "#a5182e",
			boxShadow: "none"
		}
	},
	makeOrderContainer: {
		maxWidth: 350,
		width: "100%",
		marginTop: 15,
		paddingBottom: 30
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%"
	}
});

const getFromLocalStorage = item => {
	return JSON.parse(window.localStorage.getItem(item));
};

class SummaryOrder extends Component {
	state = {
		user: this.props.user,
		pizzeria: getFromLocalStorage("selectedPizzeria"),
		ingredients: getFromLocalStorage("ingredients"),
		authUser: null,
		authUserRegistered: "",
		authUserEmail: "",
		authIsChecked: false
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;

		const ref = firebase.auth().onAuthStateChanged(user => {
			if (user && this._isMounted) {
				this.setState({
					...this.state,
					authUser: user,
					authUserId: user.uid,
					authUserEmail: user.email,
					authUserRegistered: user.metadata.creationTime,
					authIsChecked: true
				});
			}
			const databaseRef = firebase.database().ref("users");
			databaseRef.once("value").then(snapshot => {
				const snapshotVal = snapshot.val() || {};
				const findUser = Object.keys(snapshotVal)
					.map(key => ({
						id: key,
						...snapshotVal[key]
					}))
					.filter(user => {
						return user.id === this.state.authUserId;
					});
				const user = findUser[0];
				if (user && this._isMounted) {
					this.setState({
						user,
						userFirstName: user.name.split(" ")[0]
					});
				}
			});
		});
		this.setState({ ref });
	}

	componentDidUpdate(prevProps) {
		if (this.state.authUser !== prevProps.user) {
			this.setState({ ...this.state, authUser: this.props.user });
		}
	}

	componentWillUnmount() {
		this.state.ref && this.state.ref();
		this._isMounted = false;
	}

	cancelOrder = () => {
		window.localStorage.removeItem("selectedPizzeria");
		window.localStorage.removeItem("isPizzeriaSubmitted");
		this.setState({
			...this.state,
			pizzeria: null
		});
		this.props.handleSubmitSelectedPizzeria();
		const isOrderFromMenu = getFromLocalStorage("orderFromMenu");
		if (isOrderFromMenu) {
			this.props.history.push("/user-panel");
			window.localStorage.clear();
		} else {
			this.props.history.push("/make-order");
		}
	};

	sendOrder = () => {
		const isCustomOrder = getFromLocalStorage("isCustomOrder");
		const customOrderRef = firebase.database().ref("customOrders");
		const otherOrderRef = firebase.database().ref("otherOrders");
		const { user, pizzeria, ingredients } = this.state;
		const price = getFromLocalStorage("orderTotalPrice");

		firebase
			.database()
			.ref(`users/${user.uid}/orders`)
			.push()
			.set({
				pizzeria,
				ingredients,
				price
			})
			.then(() => {
				if (isCustomOrder) {
					customOrderRef.once("value").then(snapshot => {
						const totalCustomOrders = snapshot.val();
						customOrderRef.set(totalCustomOrders + 1).then(() => {
							alert("zamówienie wysłane!");
							this.props.history.push("/user-panel");
							window.localStorage.clear();
							this.props.makeOrder();
						});
					});
				} else {
					otherOrderRef.once("value").then(snapshot => {
						const totalOtherOrders = snapshot.val();
						otherOrderRef.set(totalOtherOrders + 1).then(() => {
							alert("zamówienie wysłane!");
							this.props.history.push("/user-panel");
							window.localStorage.clear();
							this.props.makeOrder();
						});
					});
				}
			});
	};

	render() {
		const { pizzeria, ingredients, user } = this.state;
		const { classes } = this.props;

		const price = getFromLocalStorage("orderTotalPrice");
		const isOrderFromMenu = getFromLocalStorage("orderFromMenu");
		const pizzasFromMenu = getFromLocalStorage("pizzasFromMenu");

		return (
			<div className={classes.wrapper}>
				<h1 className={classes.header}>Podsumowanie zamówienia</h1>
				{isOrderFromMenu ? (
					<div className={classes.ingredientsWrapper}>
						<h2>Wybrane pizze: </h2>
						<div className={classes.ingredients}>
							<ul>
								{pizzasFromMenu.map((el, i) => {
									return (
										<li key={i} style={{ fontSize: 16 }}>
											{el.name}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				) : (
					<div className={classes.ingredientsWrapper}>
						<h2>Wybrane składniki: </h2>
						<div className={classes.ingredients}>
							<ul>
								{ingredients.map((el, i) => {
									return (
										<li key={i} style={{ fontSize: 16 }}>
											{el.name}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				)}

				<div className={classes.pizzeriaWrapper}>
					<h2>Wybrana pizzeria: </h2>
					<Paper className={classes.pizzeria}>
						<h2>{pizzeria.name}</h2>
						<p>
							Adres:
							<span className={classes.info}>
								{pizzeria.contactInfo.address.street},
								{pizzeria.contactInfo.address.postcode}
								{pizzeria.contactInfo.address.city}
							</span>
						</p>
						<p>
							telefon:
							<span className={classes.info}>{pizzeria.contactInfo.phone}</span>
						</p>
						<p>
							WWW:
							<span className={classes.info}>
								{pizzeria.contactInfo.website}
							</span>
						</p>
					</Paper>
				</div>
				<div className={classes.contactWrapper}>
					<h2>Dane kontaktowe: </h2>
					<Paper className={classes.contact}>
						{user && (
							<Fragment>
								<p>
									Imię i nazwisko:
									<span className={classes.info}>{user.name}</span>
								</p>
								<p>
									email:
									<span className={classes.info}>{user.email}</span>
								</p>
								<p>
									telefon:
									<span className={classes.info}>{user.phone}</span>
								</p>
								<p>
									Adres dostawy:
									<span className={classes.info}>
										{user.street}, {user.city}
									</span>
								</p>
							</Fragment>
						)}
					</Paper>
				</div>
				<div className={classes.priceContainer}>
					<h3>
						Wartość zamówienia:
						<span style={{ display: "block", fontWeight: "bold" }}>
							{price} zł
						</span>
					</h3>
				</div>
				<div className={classes.makeOrderContainer}>
					<div className={classes.buttonsContainer}>
						<Button
							size="lg"
							className={classes.favButton}
							variant="link"
							onClick={this.sendOrder}
						>
							Zamów
						</Button>
						<Button
							size="lg"
							className="d-inline custom-button btn-secondary"
							style={{
								width: 145,
								height: 45,
								padding: "5px 7px"
							}}
							onClick={this.cancelOrder}
							variant="link"
						>
							Cofnij
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(SummaryOrder);
