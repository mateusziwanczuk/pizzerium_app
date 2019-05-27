import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { ListContainer, ListWrapper } from "../SharedComponents/containers";
import { FaHeart } from "react-icons/fa";
import "./Favourites.css";
import { db } from "../../App";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Loader from "react-loader-spinner";

const styles = theme => ({
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
	close: {
		padding: theme.spacing.unit / 2,
		"&:focus": {
			outline: "none"
		}
	},
	spinnerWrapper: {
		display: "flex",
		justifyContent: "center"
	}
});

class Favourites extends Component {
	state = {
		user: null,
		favPizzerias: [],
		isFetchFinished: false,
		isFetchInProgress: false,
		isSnackbarOpen: false,
		snackbarMessage: ""
	};

	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchFavPizzerias();
	}

	componentDidUpdate(prevProps) {
		if (this.state.user !== prevProps.user) {
			this.fetchFavPizzerias();
			if (this._isMounted) {
				this.setState({ ...this.state, user: this.props.user });
			}
		}
	}

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
				if (this._isMounted) {
					this.setState({
						...this.state,
						favPizzerias: selectedPizzerias,
						isSnackbarOpen: true,
						snackbarMessage: "Dodano do ulubionych"
					});
				}
				db.ref(`users/${user.uid}/favourites`).set({ ...selectedPizzerias });
			}
			if (isPizzeriaFavourite) {
				const removedFavPizzerias = favPizzerias.filter(
					fav => fav.name !== pizzeria.name
				);
				if (this._isMounted) {
					this.setState({
						...this.state,
						favPizzerias: removedFavPizzerias,
						isSnackbarOpen: true,
						snackbarMessage: "Usunięto z ulubionych"
					});
				}
				db.ref(`users/${user.uid}/favourites`).set({ ...removedFavPizzerias });
			}
		} else {
			const selectedPizzerias = [...favPizzerias, pizzeria];
			if (this._isMounted) {
				this.setState({
					...this.state,
					favPizzerias: selectedPizzerias,
					isSnackbarOpen: true,
					snackbarMessage: "Dodano do ulubionych"
				});
			}
			db.ref(`users/${user.uid}/favourites`).set({ ...selectedPizzerias });
		}
	};

	componentWillUnmount() {
		this._isMounted = false;
	}

	fetchFavPizzerias = () => {
		const { user } = this.props;
		if (this._isMounted) {
			this.setState({ ...this.state, isFetchInProgress: true });
		}
		if (user) {
			db.ref(`users/${user.uid}/favourites`)
				.once("value")
				.then(snapshot => {
					const favourites = snapshot.val() || [];
					if (this._isMounted) {
						this.setState({
							...this.state,
							favPizzerias: favourites,
							isFetchFinished: true,
							isFetchInProgress: false
						});
					}
				})
				.catch(err => console.log(err.message));
		}
	};

	favIconMarked = pizzeria => {
		const { favPizzerias } = this.state;
		if (favPizzerias.length) {
			return favPizzerias.some(fav => fav.name === pizzeria.name);
		}
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		this.setState({ ...this.state, isSnackbarOpen: false });
	};

	render() {
		const {
			favPizzerias,
			snackbarMessage,
			isFetchFinished,
			isFetchInProgress
		} = this.state;
		const { classes } = this.props;
		return (
			<ListContainer>
				<h2 className="user__favourites__header list-header">
					<span role="img" aria-label="pizzeria">
						🏠&nbsp;
					</span>
					Ulubione pizzerie:
				</h2>
				<ListWrapper className="list-scrollbar">
					{isFetchInProgress ? (
						<Loader type="Oval" color="#039be5" width={120} height={120} />
					) : isFetchFinished && !favPizzerias.length ? (
						<div className="list-group-item user__favourites__pizzerias">
							<img alt="pizzeria" src="img/user__pizzeria.jpg" />
							<p>Nie dodałeś jeszcze ulubionych pizzerii.</p>
						</div>
					) : (
						<div className="list-group">
							{favPizzerias.map((pizzeria, i) => {
								return (
									<Fragment key={i}>
										<div
											key={pizzeria.id}
											className="list-group-item list-group-item-action flex-column align-items-start"
											style={{
												overflowWrap: "break-word",
												wordWrap: "break-word"
											}}
										>
											<div className="d-flex w-100 justify-content-between">
												<h5>{favPizzerias[i].name}</h5>
												<FaHeart
													onClick={() => this.selectFavPizzeria(pizzeria)}
													className={
														this.favIconMarked(pizzeria)
															? classes.FavIconEnabled
															: classes.FavIconDisabled
													}
												/>
											</div>
											<span>
												Kontakt: {favPizzerias[i].contactInfo.phone}
												&nbsp;&nbsp;&nbsp;
												<a
													href={"http://" + favPizzerias[i].contactInfo.website}
												>
													{favPizzerias[i].contactInfo.website}
												</a>
											</span>
										</div>
									</Fragment>
								);
							})}
						</div>
					)}

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
				</ListWrapper>
			</ListContainer>
		);
	}
}

export default withStyles(styles)(Favourites);
