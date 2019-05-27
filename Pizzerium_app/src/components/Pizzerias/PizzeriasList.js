import React, { Component } from "react";
import firebase from "firebase";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { FaHeart } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import { db } from "../../App";

import "./pizzerias.css";

const styles = theme => ({
	RightPane: {
		background: "white",
		border: "1px solid lightgray",
		borderRadius: "5px"
	},
	FavIconEnabled: {
		float: "right",
		color: "#cc1a37"
	},
	FavIconDisabled: {
		float: "right",
		color: "#919191"
	},
	success: {
		backgroundColor: "#33ab4e"
	},
	item: {
		display: "flex",
		alignItems: "center",
		paddingLeft: 0,
		paddingTop: 0,
		paddingBottom: 0
	},
	link: {
		color: "inherit",
		width: "100%",
		padding: "12px 15px",
		"&:hover": {
			color: "inherit"
		}
	}
});

function searchFor(term) {
	return function(x) {
		return x.name.toLowerCase().includes(term.toLowerCase());
	};
}

class PizzeriasList extends Component {
	state = {
		user: null,
		pizzas: [],
		favPizzerias: [],
		isFetchFavPizzerias: false,
		pizzerias: [],
		isSnackbarOpen: false,
		snackbarMessage: "",
		pizzeriaLocation: "#1",
		term: ""
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		const databaseRef = firebase.database().ref("pizzerias");
		databaseRef.once("value").then(snapshot => {
			const snapshotVal = snapshot.val() || {};
			if (this._isMounted) {
				this.setState({
					pizzerias: snapshotVal,
					pizzeriasPizzas: snapshotVal.map(
						snapshotVal => snapshotVal.availablePizzas
					)
				});
			}
			const currentPizzeria = this.props.location.hash;
			const defaultPizzeria = this.state.pizzeriaLocation;
			if (currentPizzeria !== defaultPizzeria && this._isMounted) {
				this.setState({ ...this.state, pizzeriaLocation: currentPizzeria });
			}
		});
		this.fetchFavPizzerias();
	}

	componentDidUpdate(prevProps) {
		if (this.state.user !== prevProps.user) {
			this.fetchFavPizzerias();
			this.setState({ ...this.state, user: this.props.user });
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchFavPizzerias = () => {
		const { user } = this.props;
		if (user) {
			db.ref(`users/${user.uid}/favourites`)
				.once("value")
				.then(snapshot => {
					const favourites = snapshot.val() || [];
					if (this._isMounted) {
						this.setState({
							...this.state,
							favPizzerias: favourites,
							isFetchFavPizzerias: true
						});
					}
				})
				.catch(err => console.log(err.message));
		}
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		this.setState({ ...this.state, isSnackbarOpen: false });
	};

	searchHandler = event => {
		this.setState({ ...this.state, term: event.target.value });
	};

	selectFavPizzeria = pizzeria => {
		const { favPizzerias } = this.state;
		const { user } = this.state;

		const isAnyPizzeriaFavourite = favPizzerias && favPizzerias.length;
		const isPizzeriaFavourite = favPizzerias.some(
			fav => fav.name === pizzeria.name
		);

		if (!user) {
			return;
		}

		if (isAnyPizzeriaFavourite) {
			if (!isPizzeriaFavourite) {
				const selectedPizzerias = [...favPizzerias, pizzeria];
				this.setState({
					...this.state,
					favPizzerias: selectedPizzerias,
					isSnackbarOpen: true,
					snackbarMessage: "Dodano do ulubionych"
				});
				db.ref(`users/${user.uid}/favourites`).set({ ...selectedPizzerias });
			}
			if (isPizzeriaFavourite) {
				const removedFavPizzerias = favPizzerias.filter(
					fav => fav.name !== pizzeria.name
				);
				this.setState({
					...this.state,
					favPizzerias: removedFavPizzerias,
					isSnackbarOpen: true,
					snackbarMessage: "Usunięto z ulubionych"
				});
				db.ref(`users/${user.uid}/favourites`).set({ ...removedFavPizzerias });
			}
		} else {
			const selectedPizzerias = [...favPizzerias, pizzeria];
			this.setState({
				...this.state,
				favPizzerias: selectedPizzerias,
				isSnackbarOpen: true,
				snackbarMessage: "Dodano do ulubionych"
			});
			db.ref(`users/${user.uid}/favourites`).set({ ...selectedPizzerias });
		}
	};

	favIconMarked = pizzeria => {
		const { favPizzerias } = this.state;
		if (favPizzerias.length) {
			return favPizzerias.some(fav => fav.name === pizzeria.name);
		}
	};

	changeLocation = id => {
		this.setState({ ...this.state, pizzeriaLocation: `#${id}` });
	};

	render() {
		const location = this.state.pizzeriaLocation;
		const { snackbarMessage, pizzerias, isFetchFavPizzerias } = this.state;
		const { classes } = this.props;
		const { setItemToLS } = this.props;
		return (
			<div>
				<form
					onSubmit={e => e.preventDefault()}
					style={{
						display: "flex",
						flexFlow: "column",
						paddingTop: "2rem",
						width: "100%"
					}}
				>
					<label
						style={{
							fontSize: "1.7rem",
							textAlign: "center",
							padding: "3px"
						}}
					>
						WYSZUKAJ PIZZERIĘ:
						<br />
						<input
							className="pizzerias-filter-input"
							type="text"
							onChange={this.searchHandler}
						/>
					</label>
					<span
						style={{
							background: "#f1cd7c",
							width: "100%",
							textAlign: "center",
							padding: "4px",
							marginBottom: "2%"
						}}
					>
						Zacznij wpisywać nazwę pizzerii
					</span>
				</form>

				<Container>
					<Tab.Container
						id="list-group-tabs-example list-group-tabs-pizzerias"
						activeKey={location}
						onSelect={() => null}
					>
						<Row
							style={{
								display: "flex",
								justifyContent: "center",
								width: "100%",
								maxHeight: "500px"
							}}
						>
							<Col sm={3}>
								<ListGroup>
									{pizzerias
										.filter(searchFor(this.state.term))
										.map(pizzeria => {
											return (
												<div
													key={pizzeria.id}
													className="pizzerias__list__item"
												>
													<ListGroup.Item action className={classes.item}>
														<Nav.Link
															href={`#${pizzeria.id}`}
															className={classes.link}
															onClick={() => this.changeLocation(pizzeria.id)}
														>
															<span>{pizzeria.name}</span>
														</Nav.Link>
														{isFetchFavPizzerias && (
															<FaHeart
																onClick={() => this.selectFavPizzeria(pizzeria)}
																className={
																	this.favIconMarked(pizzeria)
																		? classes.FavIconEnabled
																		: classes.FavIconDisabled
																}
															/>
														)}
													</ListGroup.Item>
												</div>
											);
										})}
								</ListGroup>
							</Col>
							<Col sm={8} className={classes.RightPane}>
								<Tab.Content>
									{pizzerias.map(pizzeria => {
										return (
											<Tab.Pane
												key={pizzeria.id}
												eventKey={`#${pizzeria.id}`}
												className="pizzeriasList__columns__container"
											>
												<div className="pizzeriasList__column__left">
													<div>
														<h1>{pizzeria.name}</h1>
														<p>
															{pizzeria.contactInfo.address.street},
															<br />
															{pizzeria.contactInfo.address.postcode}&nbsp;
															{pizzeria.contactInfo.address.city}
														</p>
														<p>{pizzeria.contactInfo.phone}</p>
														<a
															target="_blank"
															rel="noopener noreferrer"
															href={"http://" + pizzeria.contactInfo.website}
														>
															{pizzeria.contactInfo.website}
														</a>
													</div>
												</div>
												<div className="pizzeriasList__column__right">
													<h1>Menu:</h1>
													<div className="pizzeriasList__column__right__pizzas">
														{pizzeria.availablePizzas.map(pizza => {
															const pizzaObj = Object.values(pizza)[0];
															return (
																<div key={Math.random()}>
																	<h5>
																		<input
																			type="checkbox"
																			id={pizzaObj.name}
																			onChange={() => setItemToLS(pizzaObj)}
																			checked={this.props.isPizzaChecked(
																				pizzaObj
																			)}
																		/>
																		&nbsp;
																		{pizzaObj.name} ({pizzaObj.price.toFixed(2)}{" "}
																		zł)
																	</h5>
																	<h6>{pizzaObj.ingredients}</h6>
																	<hr />
																</div>
															);
														})}
													</div>
													<div
														className="pizzeriasList__column__right__button"
														onClick={() => this.props.orderPizzas(pizzeria)}
													>
														Zamów
													</div>
												</div>
											</Tab.Pane>
										);
									})}
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container>
				</Container>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
					open={this.state.isSnackbarOpen}
					autoHideDuration={4000}
					onClose={this.handleCloseSnackbar}
				>
					<SnackbarContent
						className={classes.success}
						message={
							<span style={{ fontSize: "1.1rem" }}>{snackbarMessage}</span>
						}
						action={[
							<IconButton
								key="close"
								aria-label="Close"
								color="inherit"
								className={classes.close}
								onClick={this.handleCloseSnackbar}
							>
								<CloseIcon />
							</IconButton>
						]}
					/>
				</Snackbar>
			</div>
		);
	}
}

export default withStyles(styles)(PizzeriasList);
