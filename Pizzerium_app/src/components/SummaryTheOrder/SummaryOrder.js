import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import firebase from "firebase";
import Button from "react-bootstrap/Button";

const styles = theme => ({
	container: {
		height: "100%",
		overflow: "auto",
		paddingTop: "5%",
	},
	wrappersContainer: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
		padding: "4vh 4vw",
		width: "100%",
	},
	wrapperPriceAndButtons: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
		marginBottom: "10%",
		width: "100%",
	},
	header: {
		color: "#cc3333",
		marginBottom: "2rem",
		textAlign: "center",
		width: "100%",
	},
	header3: {
		color: "grey",
		fontSize: 20,
		letterSpacing: ".1rem",
		padding: "1rem",
		textAlign: "center",
	},
	ingredientsWrapper: {
		marginBottom: "2%",
		width: "320px",
	},
	ingredientsContent: {
		height: 330,
		padding: 15,
	},
	pizzeriaWrapper: {
		fontSize: 16,
		marginBottom: "2%",
		width: "320px",
	},
	pizzeriaContent: {
		height: 330,
		padding: 15,
		textAlign: "center"
	},
	contactWrapper: {
		fontSize: 16,
		marginBottom: "2%",
		width: "320px",
	},
	contactContent: {
		height: 330,
		padding: 15,
		textAlign: "center",
	},
	info: {
		display: "block",
	},
	priceContainer: {
		width: "330px",
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
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		width: "330px",
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "space-between",
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
			<div className={classes.container}>
				<div className={classes.wrappersContainer}>
					<h1 className={classes.header}>Podsumowanie zamówienia</h1>
					{isOrderFromMenu ? (
						<div className={classes.ingredientsWrapper}>
							<Paper className={classes.ingredientsContent}>
								<h3 className={classes.header3}>
									Wybrane pizze:
								</h3>
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
							</Paper>
						</div>
					) : (
						<div className={classes.ingredientsWrapper}>
							<Paper className={classes.ingredientsContent}>
								<h3 className={classes.header3}>
									Wybrane składniki:
								</h3>
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
							</Paper>
						</div>
					)}

					<div className={classes.pizzeriaWrapper}>
						<Paper className={classes.pizzeriaContent}>
							<h3 className={classes.header3}>Wybrana pizzeria:</h3>
							<h4>{pizzeria.name}</h4>
								<span className={classes.info} style={{ paddingBottom: "1rem" }}>
									{pizzeria.contactInfo.address.street}
									<br />
									{pizzeria.contactInfo.address.postcode}&nbsp;
									{pizzeria.contactInfo.address.city}
								</span>
								<span className={classes.info} style={{ paddingBottom: "1rem" }}>Telefon: {pizzeria.contactInfo.phone}</span>
								<span className={classes.info}>
									{pizzeria.contactInfo.website}
								</span>
						</Paper>
					</div>
					<div className={classes.contactWrapper}>
						<Paper className={classes.contactContent}>
							<h3 className={classes.header3}>Dane kontaktowe: </h3>
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
				</div>
				<div className={classes.wrapperPriceAndButtons}>
					<div className={classes.priceContainer}>
						<h3 className={classes.header3}>
							Wartość zamówienia:
							<span style={{ display: "block", fontWeight: "bold", color: "#cc3333"}}>
								{price.toFixed(2)} zł
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
			</div>
		);
	}
}

export default withStyles(styles)(SummaryOrder);
